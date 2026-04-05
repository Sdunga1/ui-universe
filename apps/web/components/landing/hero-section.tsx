"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UIUniverseWordmark } from "../ui-universe-wordmark";

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    setShowVideo(true);
    // Small delay to ensure modal is visible before playing
    setTimeout(() => videoRef.current?.play(), 50);
  };

  const closeVideo = useCallback(() => {
    setShowVideo(false);
    if (videoRef.current && !document.pictureInPictureElement) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!showVideo) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showVideo, closeVideo]);

  // Handle picture-in-picture transitions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnterPiP = () => setShowVideo(false);
    const handleLeavePiP = () => {
      // Re-open modal so video has a DOM container to render back into
      if (video.paused) {
        // User closed PiP without expanding — just clean up
        video.currentTime = 0;
      } else {
        // User clicked expand — reopen the modal
        setShowVideo(true);
      }
    };
    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);
    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showVideo]);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[160px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center gap-20 py-24">
          {/* ── Left 40% ── */}
          <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col items-center text-center">
            <UIUniverseWordmark className="text-5xl mb-5 animate-fade-in justify-center" />

            <p className="text-base text-[var(--muted)] leading-relaxed mb-8 max-w-[280px] animate-fade-in-delay-1">
              AI-native motion UI components for React &amp; Next.js. Ship premium landing pages in
              minutes.
            </p>

            <div className="flex flex-col items-center gap-4 animate-fade-in-delay-2">
              <div className="flex gap-3">
                <a
                  href="/animations/fade-up"
                  className="px-6 py-3 bg-[var(--accent)] text-white rounded-none font-medium hover:bg-[var(--accent-hover)] transition-colors duration-200 text-sm"
                >
                  Browse Components
                </a>
                <a
                  href="https://github.com/Sdunga1/ui-universe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-neutral-700 text-white rounded-none font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 text-sm"
                >
                  GitHub
                </a>
              </div>

              {/* View Demo button */}
              <button
                type="button"
                onClick={openVideo}
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white transition-colors duration-200 group"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-600 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all duration-200">
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="currentColor"
                    className="ml-0.5"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>Play</title>
                    <path d="M0 0v14l12-7z" />
                  </svg>
                </span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* ── Right 60% ── */}
          <div className="w-full md:w-[60%] flex flex-col justify-center animate-fade-in-delay-2">
            <h2 className="text-6xl md:text-7xl font-azeret font-bold leading-[1.15] mb-8 text-white">
              Ship stunning <span className="text-[var(--accent)]">AI-Native</span> Components
            </h2>

            <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed max-w-3xl">
              The motion component library built for the AI era. Every component ships with
              machine-readable descriptors — your AI assistant already knows how to use them.
            </p>
          </div>
        </div>
      </section>

      {/* ── Video Modal Overlay (always in DOM for PiP support) ── */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-200 ${
          showVideo ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeVideo();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeVideo();
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeVideo}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors duration-200 z-10"
          tabIndex={showVideo ? 0 : -1}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            role="img"
          >
            <title>Close</title>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Video container */}
        <div className="w-full max-w-4xl mx-6">
          {/* biome-ignore lint/a11y/useMediaCaption: demo video, no captions needed */}
          <video
            ref={videoRef}
            controls
            playsInline
            className="w-full rounded-sm border border-neutral-800 shadow-2xl"
            src="/demo.mp4"
          />
        </div>
      </div>
    </>
  );
}
