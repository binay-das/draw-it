"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Plus } from "lucide-react";

interface CreateRoomModalProps {
    children?: React.ReactNode;
}

export function CreateRoomModal({ children }: CreateRoomModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [slug, setSlug] = useState("");
    const router = useRouter();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug.trim()) return;
        setIsOpen(false);
        router.push(`/canvas/${slug.trim()}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                        <Plus size={18} />
                        Create / Join Room
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] text-gray-900 dark:text-white transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Join Canvas</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleJoin} className="flex flex-col gap-4 py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter a unique room slug to create a new canvas or join an existing one.
                    </p>
                    <Input
                        autoFocus
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. daily-standup"
                        className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white focus-visible:ring-blue-500 h-12 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <Button
                        type="submit"
                        disabled={!slug.trim()}
                        className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        Enter Room
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
