"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  PenTool,
  Users,
  FolderOpen,
  Keyboard,
  Code2,
  Layers,
  Home,
} from "lucide-react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  {
    title: "Introduction",
    href: "/documentaion",
    icon: Home,
  },
  {
    title: "Getting Started",
    href: "/documentaion/getting-started",
    icon: BookOpen,
  },
  {
    title: "Drawing Tools",
    href: "/documentaion/drawing-tools",
    icon: PenTool,
  },
  {
    title: "Rooms & Sharing",
    href: "/documentaion/rooms",
    icon: FolderOpen,
  },
  {
    title: "Collaboration",
    href: "/documentaion/collaboration",
    icon: Users,
  },
  {
    title: "Keyboard Shortcuts",
    href: "/documentaion/keyboard-shortcuts",
    icon: Keyboard,
  },
  {
    title: "API Reference",
    href: "/documentaion/api",
    icon: Code2,
  },
  {
    title: "Architecture",
    href: "/documentaion/architecture",
    icon: Layers,
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white dark:bg-[#090909]">
      <div className="mx-auto max-w-6xl px-6 py-8 pt-24">
        <div className="flex gap-12">
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-20 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/documentaion" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium"
                        : "text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0 flex-1 max-w-2xl">
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
