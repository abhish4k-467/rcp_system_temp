import asyncio
import os
import re
from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from crawl4ai import AsyncWebCrawler
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig
from models import ExtractedData, Review, FeatureRequest

# Hard cap on content chars sent to the model (~4 chars/token).
MAX_CONTENT_CHARS = 6000

# Initialize Groq Model
model = GroqModel("openai/gpt-oss-120b")

# Agent with NO tools — we scrape externally and pass content as the user prompt.
agent = Agent(
    model,
    output_type=ExtractedData,
    retries=3,
    system_prompt=(
        "You extract negative reviews (1-3 stars) from product review text and categorize pain points.\n"
        "\n"
        "You MUST respond with a JSON object matching this exact schema:\n"
        "{\n"
        '  "reviews": [{"text": "<review text>", "rating": <1-5 int>}, ...],\n'
        '  "feature_requests": [{"category": "<short label>", "description": "<what to improve>", '
        '"source_reviews": ["<brief excerpt from review>", ...], "priority": "High"|"Medium"|"Low"}, ...]\n'
        "}\n"
        "\n"
        "Rules:\n"
        "- Only include reviews with rating 1, 2, or 3.\n"
        "- source_reviews must be a list of SHORT string excerpts, not numbers.\n"
        "- priority must be exactly one of: High, Medium, Low (capitalized).\n"
        "- Do NOT include any explanation or reasoning. Output ONLY the JSON."
    ),
)


def _find_review_section(markdown: str) -> str:
    """Try to locate and extract the review section from the full markdown."""
    # Common markers that signal the start of a reviews section
    review_section_markers = [
        r"Top reviews from",
        r"Top reviews\b",
        r"Customer reviews",
        r"Most relevant reviews",
        r"Reviews with images",
        r"Most helpful reviews",
    ]
    for pattern in review_section_markers:
        m = re.search(pattern, markdown, re.IGNORECASE)
        if m:
            # Take content from this marker onwards (reviews are after it)
            return markdown[m.start():]
    # No known section marker found — return the second half of the page
    # (reviews are typically at the bottom of product pages)
    halfway = len(markdown) // 2
    return markdown[halfway:]


def _clean_review_text(text: str) -> str:
    """Clean extracted review section: remove URLs, boilerplate, and compress."""
    # Remove markdown links but keep link text
    text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)
    # Remove raw URLs
    text = re.sub(r'https?://\S+', '', text)
    # Remove image markdown
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove very short lines (navigation fragments)
    lines = text.splitlines()
    lines = [l.strip() for l in lines if len(l.strip()) >= 15]
    return "\n".join(lines)


async def _scrape_reviews(url: str) -> str:
    """Scrape the page and return cleaned review text."""
    print(f"Scraping {url}...")
    browser_cfg = BrowserConfig(headless=True, verbose=False)
    run_cfg = CrawlerRunConfig(
        word_count_threshold=10,
        only_text=True,
        verbose=False,
        scan_full_page=True,      # Scroll through the entire page to load lazy content
        scroll_delay=0.3,
        excluded_selector=(
            "nav, header, footer, aside, "
            "[class*='nav'], [class*='header'], [class*='footer'], "
            "[class*='sidebar'], [class*='cookie'], [class*='banner'], "
            "[class*='ad-'], [class*='promo'], [class*='newsletter'], "
            "[id*='nav'], [id*='header'], [id*='footer'], [id*='sidebar']"
        ),
        exclude_external_links=True,
        exclude_social_media_links=True,
    )

    async with AsyncWebCrawler(config=browser_cfg) as crawler:
        result = await crawler.arun(url=url, config=run_cfg)
        if result.success:
            # Step 1: Find the reviews section in the huge markdown
            review_section = _find_review_section(result.markdown)
            # Step 2: Clean out URLs, images, short lines
            cleaned = _clean_review_text(review_section)
            # Step 3: Truncate to fit token budget
            if len(cleaned) > MAX_CONTENT_CHARS:
                cleaned = cleaned[:MAX_CONTENT_CHARS]
            print(f"Scraped: {len(result.markdown)} chars → review section: {len(review_section)} chars → cleaned: {len(cleaned)} chars")
            return cleaned
        else:
            raise RuntimeError(f"Failed to scrape {url}: {result.error_message}")


async def analyze_competitor(url: str):
    """Scrape reviews then analyze them with the LLM."""
    if not os.getenv("GROQ_API_KEY"):
        raise ValueError("GROQ_API_KEY environment variable is not set")

    # Step 1: scrape outside the agent (no tool overhead)
    reviews_text = await _scrape_reviews(url)
    if not reviews_text.strip():
        raise ValueError("No review content found on the page.")

    # Step 2: pass scraped text directly as the user prompt
    result = await agent.run(
        f"Reviews from {url}:\n\n{reviews_text}",
    )
    return result.output
