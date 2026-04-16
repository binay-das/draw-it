"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Plus } from "lucide-react";
import axios from "axios";

interface CreateRoomModalProps {
    children?: React.ReactNode;
}

export function CreateRoomModal({ children }: CreateRoomModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        const input = id.trim();
        if (!input) return;

        setIsLoading(true);
        setError(null);

        try {
            // check if it's a full URL or just the path containing /canvas/
            let targetId = "";

            if (input.includes("/canvas/")) {
                const parts = input.split("/canvas/");
                targetId = parts[parts.length - 1]?.split(/[?#]/)[0] || "";
            }
            // check if it looks like a CUID or ID (alphanumeric, no spaces, reasonably long)
            else if (input.length >= 10 && /^[a-z0-9]+$/i.test(input) && !input.includes("-") && !input.includes(" ")) {
                targetId = input;
            }

            if (targetId) {
                setIsOpen(false);
                router.push(`/canvas/${targetId}`);
                return;
            }

            // otherwise treat as a personal id
            const res = await axios.post("/api/user/rooms", { slug: input });
            const room = res.data.room;
            if (room && room.id) {
                setIsOpen(false);
                router.push(`/canvas/${room.id}`);
            } else {
                setError("Failed to create room");
            }
        } catch (err: any) {
            console.error("Error joining/creating room:", err);
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setIsLoading(false);
        }
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
                        Enter a room name to create your own, or paste a room ID / URL to join collaboration.
                    </p>
                    <Input
                        autoFocus
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="e.g. daily-standup or copy-paste URL"
                        disabled={isLoading}
                        className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white focus-visible:ring-blue-500 h-12 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button
                        type="submit"
                        disabled={!id.trim() || isLoading}
                        className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Entering..." : "Enter Room"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
