import { Button } from "@repo/ui/button";
import Link from "next/link";
import { Github } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#f0f0f0] selection:text-black">
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="black"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                <path d="M2 2l7.586 7.586" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium tracking-tight text-white/90">
                            draw it
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/signin"
                            className="text-sm text-white/50 transition-colors hover:text-white"
                        >
                            Sign in
                        </Link>
                        <Link href="/canvas">
                            <Button className="h-9 rounded-full bg-white px-5 text-xs font-medium text-black transition-transform hover:scale-105 active:scale-95">
                                Start drawing
                            </Button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                <section className="relative pt-32 pb-20">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]" />
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Free and open source
                            </div>
                            <h1 className="mb-6 text-5xl font-semibold tracking-tight text-white/90 md:text-7xl">
                                Sketch ideas at the speed of thought
                            </h1>
                            <p className="mx-auto mb-10 max-w-xl text-lg text-white/40">
                                A minimalist whiteboard for quick diagrams, wireframes, and
                                brainstorming.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link href="/canvas">
                                    <Button className="h-12 rounded-full bg-white px-8 text-sm font-medium text-black transition-all hover:scale-105 active:scale-95">
                                        Open whiteboard
                                    </Button>
                                </Link>
                                <a
                                    href="https://github.com/binay-das/draw-it"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
                                >
                                    <Github />
                                    <span className="hidden sm:inline">GitHub</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.02] p-2">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#111]">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="w-full h-full opacity-30"
                                        viewBox="0 0 800 500"
                                        fill="none"
                                    >
                                        <rect
                                            x="100"
                                            y="100"
                                            width="200"
                                            height="150"
                                            rx="8"
                                            stroke="white"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                        <rect
                                            x="350"
                                            y="80"
                                            width="180"
                                            height="200"
                                            rx="8"
                                            stroke="white"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                        <rect
                                            x="580"
                                            y="120"
                                            width="150"
                                            height="100"
                                            rx="8"
                                            stroke="white"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                        <path
                                            d="M200 280 Q300 200 400 280 T600 250"
                                            stroke="white"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        <circle
                                            cx="200"
                                            cy="380"
                                            r="40"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                        />
                                        <path
                                            d="M350 350 L450 420 L550 360"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                        />
                                        <rect
                                            x="80"
                                            y="380"
                                            width="80"
                                            height="8"
                                            rx="4"
                                            stroke="white"
                                            strokeWidth="1"
                                        />
                                        <rect
                                            x="80"
                                            y="400"
                                            width="60"
                                            height="8"
                                            rx="4"
                                            stroke="white"
                                            strokeWidth="1"
                                        />
                                        <rect
                                            x="620"
                                            y="350"
                                            width="100"
                                            height="8"
                                            rx="4"
                                            stroke="white"
                                            strokeWidth="1"
                                        />
                                        <rect
                                            x="620"
                                            y="370"
                                            width="80"
                                            height="8"
                                            rx="4"
                                            stroke="white"
                                            strokeWidth="1"
                                        />
                                        <path
                                            d="M50 50 L750 450"
                                            stroke="white"
                                            strokeWidth="0.5"
                                            opacity="0.3"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <span className="text-xs text-white/40">
                                            Untitled Canvas
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 rounded-lg border border-white/10 bg-black/60 p-2 backdrop-blur">
                                    <ToolIcon icon="select" />
                                    <ToolIcon icon="pencil" active />
                                    <ToolIcon icon="rectangle" />
                                    <ToolIcon icon="ellipse" />
                                    <ToolIcon icon="line" />
                                    <ToolIcon icon="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-t border-white/5 py-20">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-8 md:grid-cols-3">
                            <FeatureCard
                                icon="cursor"
                                title="Lightning fast"
                                description="Open the canvas instantly. No loading screens, no sign-up walls. Just pure creative flow."
                            />
                            <FeatureCard
                                icon="share"
                                title="Share instantly"
                                description="Generate a link and share your canvas with anyone. Collaborate in real-time."
                            />
                            <FeatureCard
                                icon="download"
                                title="Export anywhere"
                                description="Download your work as SVG or PNG. Vector-perfect at any resolution."
                            />
                        </div>
                    </div>
                </section>

                <section className="border-t border-white/5 py-24 text-center">
                    <div className="mx-auto max-w-6xl px-6">
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white/90">
                            Ready to sketch?
                        </h2>
                        <p className="mb-8 text-white/40">
                            Join thousands of designers who use draw it daily.
                        </p>
                        <Link href="/canvas">
                            <Button className="h-12 rounded-full bg-white px-8 text-sm font-medium text-black transition-all hover:scale-105 active:scale-95">
                                Start drawing now
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-8">
                <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
                    <p className="text-sm text-white/30">© 2026 draw it. Open source.</p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-sm text-white/30 transition-colors hover:text-white/60"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="text-sm text-white/30 transition-colors hover:text-white/60"
                        >
                            Terms
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ToolIcon({
    icon,
    active = false,
}: {
    icon: string;
    active?: boolean;
}) {
    const icons: Record<string, React.ReactNode> = {
        select: (
            <path
                d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
                strokeWidth="1.5"
                fill="none"
            />
        ),
        pencil: (
            <path
                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                strokeWidth="1.5"
                fill="none"
            />
        ),
        rectangle: (
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                strokeWidth="1.5"
                fill="none"
            />
        ),
        ellipse: (
            <ellipse cx="12" cy="12" rx="9" ry="6" strokeWidth="1.5" fill="none" />
        ),
        line: <line x1="5" y1="19" x2="19" y2="5" strokeWidth="1.5" />,
        text: (
            <>
                <path d="M4 7V4h16v3" strokeWidth="1.5" fill="none" />
                <path d="M12 4v16" strokeWidth="1.5" />
                <path d="M8 20h8" strokeWidth="1.5" />
            </>
        ),
    };

    return (
        <button
            className={`p-1.5 rounded transition-colors ${active ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/10"}`}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {icons[icon]}
            </svg>
        </button>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    const icons: Record<string, React.ReactNode> = {
        cursor: (
            <path
                d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
                strokeWidth="1.5"
                fill="none"
            />
        ),
        share: (
            <path
                d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                strokeWidth="1.5"
                fill="none"
            />
        ),
        download: (
            <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                strokeWidth="1.5"
                fill="none"
            />
        ),
    };

    return (
        <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white text-black transition-transform group-hover:scale-110">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {icons[icon]}
                </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white/90">{title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{description}</p>
        </div>
    );
}