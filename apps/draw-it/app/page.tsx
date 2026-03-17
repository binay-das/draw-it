import { Button } from "@repo/ui/button";
import Link from "next/link";
import { Github } from "lucide-react";

export default async function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors selection:bg-black/10 dark:selection:bg-[#f0f0f0] selection:text-black dark:selection:text-black">
            <main>
                <section className="relative pt-32 pb-20">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,0,0,0.04),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]" />
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs text-black/60 dark:text-white/60">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                Free and open source
                            </div>
                            <h1 className="mb-6 text-5xl font-semibold tracking-tight text-black/90 dark:text-white/90 md:text-7xl">
                                A simple canvas for
                                <span className="block text-black/40 dark:text-white/40">complex ideas</span>
                            </h1>
                            <p className="mb-10 text-lg text-black/60 dark:text-white/60">
                                Create, collaborate, and share your ideas on an infinite
                                canvas. Built with Next.js, WebSockets, and Canvas API.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/dashboard">
                                    <Button className="h-12 w-full sm:w-auto rounded-full bg-black dark:bg-white px-8 text-sm font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                        Open canvas
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 12h14M12 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Button>
                                </Link>
                                <Link
                                    href="https://github.com/binay-das/draw-it"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full sm:w-auto rounded-full border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-8 text-sm font-medium text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <Github className="mr-2 h-4 w-4" />
                                        Star on GitHub
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-12 md:grid-cols-3">
                            {features.map((feature, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute -inset-4 rounded-2xl bg-black/5 dark:bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="relative">
                                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1a1a]">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mb-2 text-lg font-medium text-black/90 dark:text-white/90">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-black/60 dark:text-white/60">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-black/5 dark:border-white/5 py-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                    <p className="text-sm text-black/40 dark:text-white/40">
                        Built for speed and collaboration.
                    </p>
                    <div className="flex gap-6 text-sm text-black/40 dark:text-white/40">
                        <Link href="https://github.com/binay-das/draw-it" className="hover:text-black dark:hover:text-white transition-colors">
                            Built by Binay
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const features = [
    {
        title: "Real-time Collaboration",
        description: "Draw together with others in real-time. Changes sync instantly across all clients.",
        icon: (
            <svg className="h-5 w-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        title: "Fast & Smooth",
        description: "Built on HTML5 Canvas and engineered for performance with zero lag.",
        icon: (
            <svg className="h-5 w-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: "Local State",
        description: "Your drawings are saved locally so you never lose your work when offline.",
        icon: (
            <svg className="h-5 w-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
        ),
    },
];
