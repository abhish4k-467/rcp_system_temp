import streamlit as st
import asyncio
import sys
import os
import traceback
from concurrent.futures import ThreadPoolExecutor
from extractor import analyze_competitor

def run_async(coro):
    """Run an async coroutine from Streamlit's sync context safely."""
    def _run():
        # On Windows, Playwright needs ProactorEventLoop for subprocess support.
        # Explicitly set the policy so asyncio.run() in this thread uses it.
        if sys.platform == "win32":
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        return asyncio.run(coro)

    with ThreadPoolExecutor(max_workers=1) as pool:
        return pool.submit(_run).result()

# Set page config FIRST
st.set_page_config(page_title="Competitor 'Pain Point' Extractor", layout="wide")

# Streamlit App
st.title("Competitor 'Pain Point' Extractor")
st.markdown("""
This agent scrapes negative reviews from a competitor's product and categorizes them into "Feature Requests".
""")

# Input for URL
url = st.text_input("Product Reviews URL", placeholder="https://www.example.com/product/reviews")

# Check for API Key
if not os.getenv("GROQ_API_KEY"):
    st.error("GROQ_API_KEY is not set in environment variables.")
    st.stop()

if st.button("Extract Pain Points"):
    if not url:
        st.warning("Please enter a URL.")
    else:
        with st.spinner("Scraping reviews and extracting insights..."):
            try:
                result = run_async(analyze_competitor(url))
                
                # Using columns for layout
                col1, col2 = st.columns(2)

                
                with col1:
                    st.subheader("Feature Requests")
                    for req in result.feature_requests:
                        with st.expander(f"{req.priority} Priority: {req.category}"):
                            st.write(req.description)
                            st.write("**Source Reviews:**")
                            for source in req.source_reviews:
                                st.markdown(f"- {source}")
                                
                with col2:
                    st.subheader("Extracted Reviews used for analysis")
                    for review in result.reviews:
                        st.text(f"Rating: {review.rating}/5\n\"{review.text[:200]}...\"")
                        st.markdown("---")
                        
            except Exception as e:
                st.error(f"An error occurred: {type(e).__name__}: {e}")
                st.code(traceback.format_exc())
