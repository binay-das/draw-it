"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { LogOut, User as UserIcon, Mail } from "lucide-react";

interface UserProfileModalProps {
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    initials: string;
}

export function UserProfileModal({ user, initials }: UserProfileModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await axios.post("/api/auth/signout");
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to sign out:", error);
            setIsSigningOut(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="rounded-full ring-1 ring-black/10 dark:ring-white/20 hover:ring-black/20 dark:hover:ring-white/40 transition-all focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/50">
                    <Avatar className="h-9 w-9 bg-black/5 dark:bg-white/10 text-sm font-medium text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                        <AvatarImage src="" alt={user.name || "User"} />
                        <AvatarFallback className="bg-transparent text-black dark:text-white">{initials}</AvatarFallback>
                    </Avatar>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] text-gray-900 dark:text-white transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Account Profile</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 bg-gray-100 dark:bg-[#2a2a2a] text-lg border border-gray-200 dark:border-[#444]">
                            <AvatarImage src="" alt={user.name || "User"} />
                            <AvatarFallback className="bg-transparent text-gray-900 dark:text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user.name || "User"}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-3 bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-xl border border-gray-200 dark:border-[#333] transition-colors">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <UserIcon size={16} className="text-gray-400 dark:text-gray-400" />
                            <span className="font-medium text-gray-500 dark:text-gray-400 w-16">Name:</span>
                            <span className="text-gray-900 dark:text-white truncate">{user.name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Mail size={16} className="text-gray-400 dark:text-gray-400" />
                            <span className="font-medium text-gray-500 dark:text-gray-400 w-16">Email:</span>
                            <span className="text-gray-900 dark:text-white truncate">{user.email}</span>
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center gap-2 mt-2 py-5 bg-red-50 dark:bg-red-600/10 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-600/20 hover:text-red-700 dark:hover:text-red-400 border border-red-200 dark:border-red-500/20 transition-colors"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                    >
                        {isSigningOut ? (
                            <div className="w-4 h-4 border-2 border-red-400 dark:border-red-500/30 border-t-red-600 dark:border-t-red-500 rounded-full animate-spin" />
                        ) : (
                            <LogOut size={18} />
                        )}
                        Sign Out
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
