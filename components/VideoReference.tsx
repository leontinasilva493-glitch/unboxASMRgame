"use client";

import { useState } from "react";

type VideoReferenceProps = {
  sectionId: string;
  videoId: string;
  heading: string;
  headingLevel?: "h2" | "h3";
  intro: string;
  videoTitle: string;
  channel: string;
  reviewedAt: string;
  compareItems: string[];
  unverifiedItems: string[];
  secondaryLink?: {
    label: string;
    url: string;
  };
};

export function VideoReference({
  sectionId,
  videoId,
  heading,
  headingLevel = "h2",
  intro,
  videoTitle,
  channel,
  reviewedAt,
  compareItems,
  unverifiedItems,
  secondaryLink,
}: VideoReferenceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const Heading = headingLevel;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <section className="video-reference" id={sectionId} data-video-id={videoId} aria-labelledby={`${sectionId}-title`}>
      <span className="eyebrow">Third-party gameplay reference</span>
      <Heading id={`${sectionId}-title`}>{heading}</Heading>
      <p className="video-reference-intro">{intro}</p>

      <div className="video-reference-player">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
            title={videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setIsPlaying(true)} aria-label={`Play third-party video: ${videoTitle}`}>
            {/* YouTube supplies this preview; the iframe is deferred until the visitor clicks. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width="480" height="360" />
            <span className="video-reference-play" aria-hidden="true"><span>▶</span></span>
            <span className="video-reference-load-label">Click to load video from YouTube</span>
          </button>
        )}
      </div>

      <p className="video-reference-meta">
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">{videoTitle}</a>
        <span>{channel} · Manually reviewed {reviewedAt}</span>
      </p>

      <div className="video-reference-notes">
        <div>
          <strong>Useful to compare</strong>
          <ul>{compareItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <strong>Still unverified</strong>
          <ul>{unverifiedItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      {secondaryLink ? (
        <p className="video-reference-secondary">Optional second viewpoint: <a href={secondaryLink.url} target="_blank" rel="noopener noreferrer">{secondaryLink.label}</a>. This link is not embedded and carries the same evidence limits.</p>
      ) : null}
    </section>
  );
}
