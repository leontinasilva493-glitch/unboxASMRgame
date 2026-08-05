"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowIcon } from "./icons";

const slides = [
  {
    title: "Unbox rare toys",
    description: "Start with the verified public loop, then use the beginner checklist before trusting an exact route or value.",
    href: "/beginner-guide/",
    cta: "Start the beginner guide",
    image: "/images/home/carousel-unboxing.webp",
    alt: "Editorial illustration of a warm toy crate opening in a cozy collection room",
  },
  {
    title: "Build the collection",
    description: "See what the official listing confirms about collection upgrades and better crates—and what still needs gameplay proof.",
    href: "/roblox-index/",
    cta: "Open the Roblox Index",
    image: "/images/home/carousel-collection-workshop.webp",
    alt: "Editorial illustration of crates moving through a colorful miniature collection workshop",
  },
  {
    title: "Track new updates",
    description: "Follow the dated Update 3 status without treating reports, generated art, or missing patch notes as verified gameplay.",
    href: "/updates/",
    cta: "Open update status",
    image: "/images/home/carousel-update-tracker.webp",
    alt: "Editorial illustration of a sealed purple event crate being checked with verification symbols",
  },
] as const;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, reducedMotion]);

  const showSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return (
    <section
      className="hero-carousel"
      aria-label="Unbox ASMR guide themes"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="hero-slides" aria-live={isPaused ? "polite" : "off"}>
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={slide.title}
              className="hero-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              data-active={isActive}
            >
              <Image
                className="hero-slide-image"
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 1100px) 70vw, 38vw"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <div className="hero-slide-scrim" />
              <div className="hero-slide-content">
                <span className="hero-slide-label">Editorial illustration</span>
                <h2 className="hero-slide-title">{slide.title}</h2>
                <p>{slide.description}</p>
                <Link href={slide.href} tabIndex={isActive ? 0 : -1}>
                  {slide.cta} <ArrowIcon />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <button className="hero-carousel-arrow hero-carousel-previous" type="button" aria-label="Show previous slide" onClick={() => showSlide(activeIndex - 1)}>
        <ArrowIcon />
      </button>
      <button className="hero-carousel-arrow hero-carousel-next" type="button" aria-label="Show next slide" onClick={() => showSlide(activeIndex + 1)}>
        <ArrowIcon />
      </button>
      <div className="hero-carousel-dots" aria-label="Choose a carousel slide">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => showSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
