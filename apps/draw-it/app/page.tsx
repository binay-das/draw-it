import { Button } from "@repo/ui/button";
import Link from "next/link";
import {
  Github,
  Zap,
  Users,
  Download,
  ArrowRight,
  MousePointer2,
  Layers,
  Share2,
  Lock,
  Keyboard,
  Move,
  Eye,
} from "lucide-react";

export default async function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#090909] text-black dark:text-white selection:bg-black/10 dark:selection:bg-white/10">
      <main className="relative">
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,0,0,0.03),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.05),transparent)]" />

          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8">
                <span className="inline-block text-xs font-medium text-black/40 dark:text-white/40 mb-6">
                  Totally Free & Open Source
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-semibold tracking-tight md:text-7xl text-black dark:text-white">
                The canvas where
                <br />
                <span className="text-black/50 dark:text-white/50">
                  ideas take shape
                </span>
              </h1>

              <p className="mb-12 text-xl text-black/50 dark:text-white/50 max-w-xl mx-auto leading-relaxed">
                An infinite canvas built for creators. Draw, collaborate, and
                share in real-time, no downloads required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button className="h-12 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm font-medium">
                    Start Drawing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  href="https://github.com/binay-das/draw-it"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    className="h-12 px-6 rounded-full border-black/10 dark:border-white/10 text-sm font-medium"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-24 relative">
              <div className="relative rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 dark:border-white/5 bg-neutral-100/50 dark:bg-neutral-800/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                  </div>
                </div>
                <div className="aspect-[21/9] relative bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
                  <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="heroGrid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#heroGrid)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="flex gap-6">
                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center animate-float">
                          <MousePointer2 className="w-7 h-7 text-black/30 dark:text-white/30" />
                        </div>
                        <div
                          className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center animate-float"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <Layers className="w-7 h-7 text-white dark:text-black" />
                        </div>
                        <div
                          className="w-16 h-16 rounded-2xl border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center animate-float"
                          style={{ animationDelay: "0.4s" }}
                        >
                          <Share2 className="w-7 h-7 text-black/30 dark:text-white/30" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-black text-xs font-mono text-black/50 dark:text-white/50">
                          Create
                        </div>
                        <div className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-black text-xs font-mono text-black/50 dark:text-white/50">
                          Collaborate
                        </div>
                        <div className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-black text-xs font-mono text-black/50 dark:text-white/50">
                          Share
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 border-t border-black/5 dark:border-white/5">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-black/40 dark:text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-xs font-medium tracking-widest uppercase text-black/40 dark:text-white/40 mb-4 block">
                  Drawing Tools
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white">
                  Precision at your fingertips
                </h2>
                <p className="text-lg text-black/50 dark:text-white/50 mb-8 leading-relaxed">
                  A complete set of drawing tools designed for clarity and
                  control. Every stroke feels natural, every shape precise.
                </p>
                <div className="space-y-4">
                  {drawingTools.map((tool, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center">
                        {tool.icon}
                      </div>
                      <div>
                        <div className="font-medium text-black dark:text-white">
                          {tool.title}
                        </div>
                        <div className="text-sm text-black/40 dark:text-white/40">
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden">
                  <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="toolsGrid"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#toolsGrid)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 border-2 border-black/10 dark:border-white/10 rounded-2xl" />
                      <div className="absolute top-4 left-4 right-4 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
                      <div className="absolute top-8 left-4 w-20 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-black/20 dark:border-white/20 rounded-full" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10" />
                        <div className="w-8 h-8 rounded bg-black/20 dark:bg-white/20" />
                        <div className="w-8 h-8 rounded bg-black/30 dark:bg-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-black/40 dark:text-white/40 mb-4 block">
                Use Cases
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
                Built for every workflow
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-black/10 dark:hover:border-white/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {useCase.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="aspect-video rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden relative">
                  <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="collabGrid"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 32 0 L 0 0 0 32"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#collabGrid)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex -space-x-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-800 dark:bg-neutral-200 border-2 border-white dark:border-black flex items-center justify-center text-white dark:text-black text-sm font-medium">
                        A
                      </div>
                      <div className="w-12 h-12 rounded-full bg-neutral-700 dark:bg-neutral-300 border-2 border-white dark:border-black flex items-center justify-center text-white dark:text-black text-sm font-medium">
                        B
                      </div>
                      <div className="w-12 h-12 rounded-full bg-neutral-600 dark:bg-neutral-400 border-2 border-white dark:border-black flex items-center justify-center text-white dark:text-black text-sm font-medium">
                        C
                      </div>
                      <div className="w-12 h-12 rounded-full bg-neutral-500 dark:bg-neutral-500 border-2 border-white dark:border-black flex items-center justify-center text-white dark:text-black text-sm font-medium">
                        +2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-xs font-medium tracking-widest uppercase text-black/40 dark:text-white/40 mb-4 block">
                  Collaboration
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white">
                  Create together, in real-time
                </h2>
                <p className="text-lg text-black/50 dark:text-white/50 mb-8 leading-relaxed">
                  Share a link and collaborate instantly. See cursors, changes,
                  and ideas flow in real-time. 
                </p>
                <ul className="space-y-3">
                  {collabFeatures.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-black/70 dark:text-white/70"
                    >
                      <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-widest uppercase text-black/40 dark:text-white/40 mb-4 block">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
                Everything you need
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black/50 dark:text-white/50">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white">
                Ready when you are
              </h2>
              <p className="text-lg text-black/50 dark:text-white/50 mb-10">
                No downloads. Just open the browser and start creating.
              </p>
              <Link href="/dashboard">
                <Button className="h-12 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm font-medium">
                  Open Canvas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-32 border-t border-black/5 dark:border-white/5">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="font-semibold mb-4 text-black dark:text-white">
                  Product
                </h3>
                <ul className="space-y-3 text-sm text-black/50 dark:text-white/50">
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      Canvas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <span className="text-black/30 dark:text-white/30">
                      Mobile app (coming soon)
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-black dark:text-white">
                  Resources
                </h3>
                <ul className="space-y-3 text-sm text-black/50 dark:text-white/50">
                  <li>
                    <Link
                      href="https://github.com/binay-das/draw-it"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/binay-das/draw-it"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      GitHub
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/binay-das/draw-it/issues"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      Report Issues
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-black dark:text-white">
                  Legal
                </h3>
                <ul className="space-y-3 text-sm text-black/50 dark:text-white/50">
                  <li>
                    <span className="text-black/30 dark:text-white/30">
                      Privacy Policy
                    </span>
                  </li>
                  <li>
                    <span className="text-black/30 dark:text-white/30">
                      Terms of Service
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 dark:border-white/5 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-black/10 dark:border-white/10 bg-black dark:bg-white">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-white dark:text-black"
                  strokeWidth="2.5"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
              <span className="text-sm text-black/60 dark:text-white/60">
                draw it
              </span>
            </div>
            <p className="text-sm text-black/40 dark:text-white/40">
              Built by{" "}
              <Link
                href="https://github.com/binay-das"
                target="_blank"
                rel="noreferrer"
                className="text-black dark:text-white transition-colors hover:underline"
              >
                Binay 
              </Link>
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/binay-das/draw-it"
                target="_blank"
                rel="noreferrer"
                className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const stats = [
  { value: "100%", label: "Free & Open Source" },
  { value: "∞", label: "Canvas size" },
  { value: "<100ms", label: "Sync latency" }
];

const drawingTools = [
  {
    title: "Freehand Drawing",
    description: "Natural brush strokes with pressure sensitivity",
    icon: <MousePointer2 className="w-5 h-5 text-black dark:text-white" />,
  },
  {
    title: "Shapes & Lines",
    description: "Precise geometric tools with snap-to-grid",
    icon: <Layers className="w-5 h-5 text-black dark:text-white" />,
  },
  {
    title: "Text Annotations",
    description: "Add labels and notes anywhere on canvas",
    icon: <Keyboard className="w-5 h-5 text-black dark:text-white" />,
  },
  {
    title: "Selection & Move",
    description: "Select, resize, and reposition any element",
    icon: <Move className="w-5 h-5 text-black dark:text-white" />,
  },
];

const useCases = [
  {
    title: "Brainstorming",
    description:
      "Map out ideas visually with diagrams, sketches, and connecting lines. Perfect for mind-mapping sessions.",
    icon: <Layers className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Wireframing",
    description:
      "Quick UI sketches and layout planning. Iterate fast with simple shapes and text.",
    icon: <Move className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Teaching",
    description:
      "Explain concepts visually with drawings, annotations, and real-time demonstrations.",
    icon: <Eye className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Presentations",
    description:
      "Create visual narratives on an infinite canvas instead of traditional slides.",
    icon: <Share2 className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Documentation",
    description:
      "Illustrate processes, architectures, and workflows with annotated diagrams.",
    icon: <Download className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Remote Collaboration",
    description:
      "Work together in real-time regardless of location. Everyone sees changes instantly.",
    icon: <Users className="w-6 h-6 text-black dark:text-white" />,
  },
];

const collabFeatures = [
  "Live cursor tracking for all participants",
  "Instant shape and stroke synchronization",
  "Shareable rooms via simple link"
];

const features = [
  {
    title: "Real-time Sync",
    description:
      "Changes appear instantly across all connected clients with minimal latency.",
    icon: <Zap className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Local Persistence",
    description:
      "Your work is saved locally. Continue where you left off, even offline.",
    icon: <Download className="w-6 h-6 text-black dark:text-white" />,
  },
  {
    title: "Privacy First",
    description:
      "Your drawings stay on your device. We never collect or store your content.",
    icon: <Lock className="w-6 h-6 text-black dark:text-white" />,
  },
];
