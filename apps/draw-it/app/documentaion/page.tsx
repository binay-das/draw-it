export default function DocsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Documentation
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Welcome to the Draw It documentation. Draw It is a real-time
        collaborative whiteboard application that lets you create, draw, and
        collaborate on an infinite canvas directly in your browser.
      </p>

      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
        <h2 className="text-lg font-semibold mb-3 text-black dark:text-white">
          Quick Links
        </h2>
        <ul className="space-y-2 text-black/60 dark:text-white/60">
          <li>
            <Link
              href="/documentaion/getting-started"
              className="hover:text-black dark:hover:text-white underline underline-offset-4"
            >
              Getting Started
            </Link>{" "}
            — Create your first canvas in under a minute
          </li>
          <li>
            <Link
              href="/documentaion/drawing-tools"
              className="hover:text-black dark:hover:text-white underline underline-offset-4"
            >
              Drawing Tools
            </Link>{" "}
            — Learn about all available drawing tools
          </li>
          <li>
            <Link
              href="/documentaion/collaboration"
              className="hover:text-black dark:hover:text-white underline underline-offset-4"
            >
              Collaboration
            </Link>{" "}
            — Work together in real-time
          </li>
          <li>
            <Link
              href="/documentaion/api"
              className="hover:text-black dark:hover:text-white underline underline-offset-4"
            >
              API Reference
            </Link>{" "}
            — Integrate with your own applications
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        What is Draw It?
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It is a free, open-source collaborative canvas built for creators,
        teams, and anyone who wants to visualize ideas together. Unlike
        traditional design tools, Draw It emphasizes simplicity and real-time
        collaboration.
      </p>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Whether you&apos;re brainstorming, wireframing, teaching, or presenting,
        Draw It provides an infinite space where your ideas can take shape.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Key Features
      </h2>
      <ul className="space-y-3 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">
            Infinite Canvas
          </strong>{" "}
          — Never run out of space. Pan and zoom freely to organize your ideas.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Real-time Collaboration
          </strong>{" "}
          — See changes from other users instantly as they draw.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Multiple Drawing Tools
          </strong>{" "}
          — From freehand pencil to precise shapes and text annotations.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Room Management
          </strong>{" "}
          — Create and organize multiple canvas projects in one place.
        </li>
        <li>
          <strong className="text-black dark:text-white">Privacy First</strong>{" "}
          — Your drawings are stored locally by default, with optional cloud
          sync.
        </li>
        <li>
          <strong className="text-black dark:text-white">Dark Mode</strong> —
          Built-in support for light and dark themes.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Open Source
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It is fully open source and built with modern web technologies. The
        entire codebase is available on GitHub for anyone to explore, contribute
        to, or fork for their own projects.
      </p>
      <div className="flex gap-4 pt-2">
        <a
          href="https://github.com/binay-das/draw-it"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  );
}

import Link from "next/link";
