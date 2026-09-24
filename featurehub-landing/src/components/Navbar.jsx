import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant">
      <div className="h-16 max-w-7xl mx-auto px-gutter flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant">
            <svg
              className="w-5 h-5 text-secondary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <circle cx="19" cy="5" r="2" />
              <circle cx="5" cy="5" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
              <line x1="7" y1="6" x2="10" y2="10" />
              <line x1="17" y1="6" x2="14" y2="10" />
              <line x1="7" y1="18" x2="10" y2="14" />
              <line x1="17" y1="18" x2="14" y2="14" />
            </svg>
          </div>
          <a className="flex items-center gap-space-sm group" href="#">
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              FeatureHub
            </span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high border border-outline-variant font-label-mono text-label-mono text-primary">
              v1.4
            </span>
          </a>
        </div>

        {/* Navigation & GitHub link */}
        <div className="flex items-center gap-space-md">
          <a
            className="inline-flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container border border-outline-variant hover:border-primary transition-colors text-on-surface-variant hover:text-on-surface"
            href="https://github.com/Dhairya1890/FeatureStore"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub Repository"
          >
            {/* Hardcoded GitHub SVG path */}
            <svg
              className="w-4 h-4 fill-current text-on-surface"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="font-code-base text-code-base hidden sm:inline">
              Repository
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
