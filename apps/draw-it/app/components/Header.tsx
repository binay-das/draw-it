"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { UserProfileModal } from "./UserProfileModal";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    initials: string | null;
}

export function Header({ user, initials }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/5 bg-[#ffffff]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl transition-colors">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black dark:bg-white transition-colors">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="text-white dark:text-black"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 19l7-7 3 3-7 7-3-3z" />
                            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                            <path d="M2 2l7.586 7.586" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium tracking-tight text-black/90 dark:text-white/90 transition-colors">
                        draw it
                    </span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/canvas">
                        <Button className="h-9 rounded-full bg-black text-white dark:bg-white px-5 text-xs font-medium dark:text-black transition-transform hover:scale-105 active:scale-95">
                            Start drawing
                        </Button>
                    </Link>
                    <ThemeToggle />
                    {user && initials ? (
                        <UserProfileModal user={user} initials={initials} />
                    ) : (
                        <Link
                            href="/signin"
                            className="text-sm text-black/50 dark:text-white/50 transition-colors hover:text-black dark:hover:text-white"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
