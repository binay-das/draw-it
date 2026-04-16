"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

interface JoinRoomModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function JoinRoomModal({ isOpen, onOpenChange }: JoinRoomModalProps) {
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
            let targetId = "";

            if (input.includes("/canvas/")) {
                const parts = input.split("/canvas/");
                targetId = parts[parts.length - 1]?.split(/[?#]/)[0] || "";
            }
            else if (input.length >= 10 && /^[a-z0-9]+$/i.test(input) && !input.includes("-") && !input.includes(" ")) {
                targetId = input;
            }

            if (targetId) {
                onOpenChange(false);
                router.push(`/canvas/${targetId}`);
            } else {
                setError("Please enter a valid room ID or paste a canvas URL.");
            }
        } catch (err: any) {
            console.error("Error joining room:", err);
            setError("An error occurred while trying to join.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] text-gray-900 dark:text-white transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Join Collaboration</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleJoin} className="flex flex-col gap-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Paste a room ID or a full canvas URL to join someone else's drawing session.
                    </p>
                    <Input
                        autoFocus
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Paste room ID or URL here..."
                        disabled={isLoading}
                        className="bg-gray-50 dark:bg-[#2a2a2a] border-gray-200 dark:border-[#444] text-gray-900 dark:text-white focus-visible:ring-blue-500 h-12 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button
                        type="submit"
                        disabled={!id.trim() || isLoading}
                        className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Joining..." : "Join Session"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
