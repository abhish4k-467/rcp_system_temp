"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Cable,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Forklift,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  ShieldCheck,
  Star,
  Thermometer,
  X,
  Youtube
} from "lucide-react";
import {
  caseStudies,
  environments,
  features,
  navLinks,
  news,
  stats,
  steps,
  testimonials
} from "@/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

const carouselDelay = 4000;

function useAutoCarousel(slideCount: number, delay = carouselDelay) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "center", 
    loop: true,
    duration: 50,
    skipSnaps: false,
    dragFree: false
  });
  const [selected, setSelected] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    if (!emblaApi || slideCount < 2) {
      return;
    }

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      emblaApi.scrollNext();
    }, delay);
  }, [delay, emblaApi, slideCount]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
      setProgressKey((current) => current + 1);
      resetTimer();
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [emblaApi, resetTimer]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      resetTimer();
    },
    [emblaApi, resetTimer]
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    resetTimer();
  }, [emblaApi, resetTimer]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    resetTimer();
  }, [emblaApi, resetTimer]);

  return { emblaRef, selected, progressKey, scrollTo, scrollPrev, scrollNext };
}

function LeadForm({
  variant,
  fields,
  button,
  success
}: {
  variant: "dark" | "amber" | "footer";
  fields: { name: string; label: string; type: "text" | "email"; placeholder: string }[];
  button: string;
  success: string;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const missing = fields.some((field) => !String(formData.get(field.name) ?? "").trim());
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (missing || !validEmail) {
      setMessage("");
      setError("Please enter the required details with a valid email address.");
      return;
    }

    form.reset();
    setError("");
    setMessage(success);
  }

  return (
    <form className={`lead-form lead-form--${variant}`} onSubmit={handleSubmit} noValidate>
      <div className="lead-form__fields">
        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input name={field.name} type={field.type} placeholder={field.placeholder} required />
          </label>
        ))}
        <button className="button button--form" type="submit">
          {button}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p className={`form-status ${error ? "is-error" : ""}`} aria-live="polite">
        {error || message}
      </p>
    </form>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
      <a className="site-nav__logo" href="#home" aria-label="SecureRack Systems home">
        <span className="text-logo">Secure<span className="text-gradient">Rack</span></span>
      </a>

      <nav className="site-nav__links" aria-label="Primary navigation">
        {navLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="site-nav__actions">
        <a className="button button--ghost button--nav" href="#demo">
          Book a Demo
        </a>
        <a className="button button--nav" href="#quote">
          Get a Quote
        </a>
      </div>

      <button
        className="icon-button site-nav__toggle"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>

      <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu__panel">
          <button
            className="icon-button mobile-menu__close"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
          {navLinks.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="mobile-menu__actions">
            <a className="button button--ghost" href="#demo" onClick={() => setOpen(false)}>
              Book a Demo
              <ArrowRight size={18} />
            </a>
            <a className="button button--primary" href="#quote" onClick={() => setOpen(false)}>
              Get a Quote
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [mediaMode, setMediaMode] = useState<"unknown" | "video" | "poster">("unknown");
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const useVideo = mediaMode === "video";
  const contentReady = mediaMode === "poster" || videoEnded || (useVideo && videoLoaded);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => {
      const nextMode = mediaQuery.matches ? "video" : "poster";
      setMediaMode(nextMode);
      if (nextMode === "poster") {
        setVideoEnded(true);
      }
    };
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const actions = document.querySelector<HTMLElement>("[data-hero-actions]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reducedMotion ? 0 : useVideo ? 0.18 : 0.45;

    gsap.set(actions, { autoAlpha: 0, y: 18 });

    if (mediaMode === "unknown" || !contentReady) {
      return undefined;
    }

    const timeline = gsap.timeline({ delay });
    timeline.to(actions, {
      autoAlpha: 1,
      y: 0,
      duration: reducedMotion ? 0 : 0.42,
      ease: "power2.out"
    });

    return () => {
      timeline.kill();
    };
  }, [contentReady, mediaMode, useVideo]);

  return (
    <section className={`hero ${contentReady ? "hero--content-ready" : ""}`} id="home">
      <div className="hero__poster" />
      {useVideo ? (
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.pause();
            }
            setVideoEnded(true);
          }}
        >
          <source src="/media/final.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="hero__shade" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__content">
        <div className="hero__actions" data-hero-actions>
          <a className="button button--primary" href="#demo">
            Book a Virtual Demo
            <ArrowRight size={20} />
          </a>
          <a className="button button--ghost" href="#quote">
            Get a Free Quote
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const doubledStats = useMemo(() => [...stats, ...stats], []);

  return (
    <section className="problem section" id="problem" data-reveal>
      <div className="section-heading">
        <p className="section-label">The Reality of Racking</p>
        <h2>Racking collapses aren&apos;t rare. They&apos;re inevitable - without protection.</h2>
        <p className="problem__intro">
          The cost shows up in injured people, interrupted operations and lost stock. SecureRack is
          designed for the moment a routine impact becomes a business-critical risk.
        </p>
      </div>
      <div className="stats-ticker" aria-label="Racking safety statistics">
        <div className="stats-ticker__track">
          {doubledStats.map((stat, index) => (
            <article className="stat-card" key={`${stat.label}-${index}`}>
              <span className="stat-card__index">{String((index % stats.length) + 1).padStart(2, "0")}</span>
              <strong
                data-count={typeof stat.countTarget === "number" ? "true" : undefined}
                data-count-target={stat.countTarget}
                data-count-prefix={stat.prefix}
                data-count-suffix={stat.suffix}
              >
                {stat.value}
              </strong>
              <span>{stat.label}</span>
              <p>{stat.context}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="solution section" id="our-system" data-reveal>
      <div className="solution__visual">
        <Image src="/images/better.png" alt="One System Total Protection" width={620} height={420} style={{ width: '100%', height: 'auto', borderRadius: '1rem' }} />
      </div>
      <div className="solution__copy">
        <p className="section-label">Our Patented System</p>
        <h2>One System. <span className="text-gradient">Total Protection.</span></h2>
        <p>
          UK designed and UK + European patented - the SecureRack System is the only proven
          racking safety system to eliminate collapse. A network of precision steel cables
          and engineered brackets absorbs and redistributes impact energy before domino
          collapse can begin.
        </p>
        <div className="feature-pills">
          {features.map((feature, index) => {
            const Icon = [Thermometer, ShieldCheck, ClipboardCheck][index];
            return (
              <span key={feature}>
                <Icon size={18} />
                {feature}
              </span>
            );
          })}
        </div>
        <a className="button button--ghost button--inline" href="#case-studies">
          Full System Breakdown
          <ArrowRight size={19} />
        </a>
      </div>
    </section>
  );
}

function StepsCarousel() {
  const { emblaRef, selected, progressKey, scrollPrev, scrollNext, scrollTo } = useAutoCarousel(steps.length);
  const icons = [Forklift, Cable, ShieldCheck];

  return (
    <section className="steps section section--wide" id="how-it-works" data-reveal>
      <div className="section-heading">
        <p className="section-label">How It Works</p>
        <h2>Three Steps Between Impact and Catastrophe.</h2>
      </div>
      <div className="carousel-shell carousel-shell--steps">
        <button className="icon-button carousel-arrow carousel-arrow--left" onClick={scrollPrev} aria-label="Previous step">
          <ChevronLeft />
        </button>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {steps.map((step, index) => {
              const Icon = icons[index % icons.length];
              return (
                <article className={`embla__slide step-card ${selected === index ? "is-selected" : ""}`} key={`${step.title}-${index}`}>
                  <div className="media-card__image" style={{ "--card-image": `url(${step.image})` } as React.CSSProperties} />
                  <div className="media-card__shade" />
                  <div className="step-card__content">
                    <span>{step.kicker}</span>
                    <Icon size={34} aria-hidden="true" />
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <button className="icon-button carousel-arrow carousel-arrow--right" onClick={scrollNext} aria-label="Next step">
          <ChevronRight />
        </button>
      </div>
      <div className="carousel-progress">
        <span key={progressKey} style={{ animationDuration: `${carouselDelay}ms` }} />
      </div>
      <div className="carousel-dots">
        {steps.map((step, index) => (
          <button
            aria-label={`Show ${step.title}`}
            className={selected === index ? "is-active" : ""}
            key={step.title}
            onClick={() => scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function Environments() {
  const { emblaRef, selected, progressKey, scrollTo } = useAutoCarousel(environments.length, 5200);

  return (
    <section className="environments section" data-reveal>
      <div className="section-heading">
        <p className="section-label">Built for Conditions</p>
        <h2>Built for Every Environment.</h2>
      </div>
      <div className="embla embla--peek" ref={emblaRef}>
        <div className="embla__container">
          {environments.map((item, index) => (
            <article
              className={`embla__slide environment-card environment-card--${item.accent} ${
                selected === index ? "is-selected" : ""
              }`}
              key={`${item.title}-${index}`}
            >
              <div className="media-card__image" style={{ "--card-image": `url(${item.image})` } as React.CSSProperties} />
              <div className="media-card__shade" />
              <div className="environment-card__content">
                <span>{item.badge}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <a href="#quote">
                  Learn More
                  <ArrowRight size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="carousel-progress">
        <span key={progressKey} style={{ animationDuration: "5200ms" }} />
      </div>
      <div className="carousel-dots">
        {environments.map((item, index) => (
          <button
            aria-label={`Show ${item.title}`}
            className={selected === index ? "is-active" : ""}
            key={item.title}
            onClick={() => scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const { emblaRef, selected, progressKey, scrollPrev, scrollNext, scrollTo } = useAutoCarousel(testimonials.length, 6000);

  return (
    <section className="testimonials section" id="testimonials" data-reveal>
      <div className="section-heading">
        <p className="section-label">Trusted by Industry Leaders</p>
        <h2>Don&apos;t Just Take Our Word For It.</h2>
      </div>
      <div className="carousel-shell">
        <button className="icon-button carousel-arrow carousel-arrow--left" onClick={scrollPrev} aria-label="Previous testimonial">
          <ChevronLeft />
        </button>
        <div className="embla embla--peek" ref={emblaRef}>
          <div className="embla__container">
            {testimonials.map((item, index) => (
              <article className={`embla__slide testimonial-card ${selected === index ? "is-selected" : ""}`} key={`${item.client}-${index}`}>
                <Quote className="testimonial-card__quote" size={62} aria-hidden="true" />
                <div className="stars" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star fill="currentColor" size={18} key={index} />
                  ))}
                </div>
                <p>{item.quote}</p>
                <div className="testimonial-card__footer">
                  <div className="testimonial-card__logo">
                    {item.logo ? (
                      <Image src={item.logo} alt={`${item.client} logo`} width={118} height={54} />
                    ) : (
                      <span>{item.logoLabel}</span>
                    )}
                  </div>
                  <div>
                    <strong>{item.client}</strong>
                    <span>{item.person}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button className="icon-button carousel-arrow carousel-arrow--right" onClick={scrollNext} aria-label="Next testimonial">
          <ChevronRight />
        </button>
      </div>
      <div className="carousel-progress">
        <span key={progressKey} style={{ animationDuration: "6000ms" }} />
      </div>
      <div className="carousel-dots">
        {testimonials.map((item, index) => (
          <button
            aria-label={`Show ${item.client}`}
            className={selected === index ? "is-active" : ""}
            key={item.client}
            onClick={() => scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function CaseStudies() {
  return (
    <section className="case-studies section" id="case-studies" data-reveal>
      <div className="section-heading">
        <p className="section-label">Proven in the Field</p>
        <h2>Real Incidents. Real Protection.</h2>
      </div>
      <div className="case-grid">
        {caseStudies.map((item) => (
          <a className="case-card" href={item.href} key={item.title} target="_blank" rel="noreferrer">
            <div className="media-card__image" style={{ "--card-image": `url(${item.image})` } as React.CSSProperties} />
            <div className="media-card__shade" />
            <div className="case-card__logo">
              {item.logo ? (
                <Image src={item.logo} alt={`${item.title} logo`} width={112} height={52} />
              ) : (
                <span className={item.logoLabel === "SecureRack" ? "text-logo text-logo--small" : ""}>
                  {item.logoLabel === "SecureRack" ? (
                    <>Secure<span className="text-gradient">Rack</span></>
                  ) : (
                    item.logoLabel
                  )}
                </span>
              )}
            </div>
            <div className="case-card__content">
              <span>{item.impact}</span>
              <h3>{item.title}</h3>
              <p>
                Read Case Study
                <ArrowRight size={18} />
              </p>
            </div>
          </a>
        ))}
      </div>
      <a className="text-link text-link--center" href="https://securerack.demo/case-studies" target="_blank" rel="noreferrer">
        View All Case Studies
        <ArrowRight size={18} />
      </a>
    </section>
  );
}

function WhitePaper() {
  return (
    <section className="white-paper section" data-reveal>
      <div>
        <p className="section-label">Warehouse Risk Intelligence</p>
        <h2>Know the Risk. Download Free.</h2>
        <p>
          Our white paper covers the mechanics of rack collapse, the true cost of incidents,
          and how to eliminate the risk entirely.
        </p>
      </div>
      <LeadForm
        variant="dark"
        fields={[{ name: "email", label: "Email", type: "email", placeholder: "name@example.com" }]}
        button="Download Free White Paper"
        success="Thank you. The white paper download flow is ready to wire into your email platform."
      />
      <small>Privacy assured, unsubscribe anytime.</small>
    </section>
  );
}

function NewsStrip() {
  return (
    <section className="news section" id="news" data-reveal>
      <div className="section-heading">
        <p className="section-label">Latest from SecureRack</p>
        <h2>Warehouse Safety, Updated.</h2>
      </div>
      <div className="news-grid">
        {news.map((item) => (
          <a className="news-card" href={item.href} key={item.title} target="_blank" rel="noreferrer">
            <span>News</span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            <strong>
              Continue Reading
              <ArrowRight size={17} />
            </strong>
            <time>{item.date}</time>
          </a>
        ))}
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section className="demo-section section" id="demo" data-reveal>
      <div className="section-heading">
        <p className="section-label">Live Experience</p>
        <h2>See SecureRack in Action.</h2>
      </div>
      <div className="demo-grid demo-grid--centered">
        <div className="demo-content">
          <h3>Book a Virtual Site Visit</h3>
          <p>
            Experience how SecureRack Systems integrates into your specific warehouse layout. 
            Our engineers will walk you through a digital twin simulation of your facility.
          </p>
          <ul className="demo-features">
            <li>
              <ShieldCheck size={20} />
              <span>Real-time impact simulation</span>
            </li>
            <li>
              <Cable size={20} />
              <span>Stress-test analysis for your racking type</span>
            </li>
            <li>
              <ClipboardCheck size={20} />
              <span>ROI and insurance premium calculation</span>
            </li>
          </ul>
          <div className="demo-cta">
            <a className="button button--primary" href="#quote">
              Schedule My Demo
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section className="quote-section" id="quote" data-reveal>
      <div>
        <h2>Stop the Risk. Start Today.</h2>
        <p>Get a no-obligation quote tailored to your warehouse - UK, Ireland or Europe.</p>
      </div>
      <LeadForm
        variant="amber"
        fields={[
          { name: "name", label: "Full Name", type: "text", placeholder: "E.g. Joe Bloggs" },
          { name: "email", label: "Email", type: "email", placeholder: "name@example.com" }
        ]}
        button="Get My Free Quote"
        success="Thank you. Your quote form is ready for CRM or email integration."
      />
      <a className="quote-section__phone" href="tel:07375676401">
        <Phone size={18} />
        Call us directly: 07375 676 401
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__logo">
            <span className="text-logo">Secure<span className="text-gradient">Rack</span></span>
          </div>
          <p className="footer__tagline">Protecting Workforces. Preserving Brands.</p>
          <ul className="footer__contact">
            <li>
              <MapPin size={18} />
              Seafield Lane, Redditch B98 9DB
            </li>
            <li>
              <Phone size={18} />
              <a href="tel:07375676401">07375 676 401</a>
            </li>
            <li>
              <Mail size={18} />
              <a href="mailto:demo@securerack.demo">demo@securerack.demo</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Navigation</h3>
          <div className="footer__links">
            {[
              "How It Works",
              "Our System",
              "Case Studies",
              "Demo",
              "Testimonials",
              "Gallery",
              "Videos",
              "News",
              "Contact"
            ].map((item) => (
              <a href={item === "Contact" ? "#quote" : `#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
                {item}
              </a>
            ))}
          </div>
          <div className="footer__socials">
            <a
              href="https://uk.linkedin.com/company/securerack-systems"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={21} />
            </a>
            <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noreferrer">
              <Youtube size={22} />
            </a>
          </div>
        </div>
        <div>
          <h3>Newsletter</h3>
          <p>Stay updated on warehouse safety.</p>
          <LeadForm
            variant="footer"
            fields={[{ name: "email", label: "Email", type: "email", placeholder: "name@example.com" }]}
            button="Subscribe"
            success="Thank you. Newsletter sign-up is ready to connect."
          />
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2016-2026 SecureRack Systems Ltd.</p>
        <div>
          <a href="https://securerack.demo/privacy" target="_blank" rel="noreferrer">
            Privacy
          </a>
          <a href="https://securerack.demo/terms" target="_blank" rel="noreferrer">
            Terms
          </a>
          <a href="https://securerack.demo/cookies" target="_blank" rel="noreferrer">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function SecureRackHome() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      // Hero Parallax
      gsap.to(".hero__poster, .hero__video", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 50, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true
            }
          }
        );
      });

      // Staggered child reveals for grids
      const grids = gsap.utils.toArray<HTMLElement>(".case-grid, .news-grid, .feature-pills");
      grids.forEach((grid) => {
        const children = grid.children;
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: grid,
                start: "top 85%",
                once: true
              }
            }
          );
        }
      });

      gsap.utils.toArray<SVGPathElement>("[data-cable-path]").forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".diagram-panel",
            start: "top 70%",
            once: true
          }
        });
      });

      gsap.fromTo(
        "[data-cable-node]",
        { scale: 0.7, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".diagram-panel",
            start: "top 65%",
            once: true
          }
        }
      );
    }

    gsap.utils.toArray<HTMLElement>("[data-count='true']").forEach((element) => {
      const target = Number(element.dataset.countTarget ?? 0);
      const prefix = element.dataset.countPrefix ?? "";
      const suffix = element.dataset.countSuffix ?? "";
      const counter = { value: 0 };

      gsap.to(counter, {
        value: target,
        duration: reducedMotion ? 0 : 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 92%",
          once: true
        },
        onUpdate: () => {
          element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsStrip />
        <Solution />
        <StepsCarousel />
        <Environments />
        <Testimonials />
        <CaseStudies />
        <DemoSection />
        <WhitePaper />
        <NewsStrip />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}




