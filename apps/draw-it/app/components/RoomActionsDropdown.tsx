"use client";

import { useState } from "react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@repo/ui/dropdown-menu";
import { Button } from "@repo/ui/button";
import { Plus, Layout, Users, ChevronDown } from "lucide-react";
import { CreateRoomModal } from "./CreateRoomModal";
import { JoinRoomModal } from "./JoinRoomModal";

export function RoomActionsDropdown() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 border-none">
                        <Plus size={18} />
                        Create / Join Room
                        <ChevronDown size={16} className="ml-1 opacity-70" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] rounded-2xl shadow-xl z-[100]">
                    <DropdownMenuItem 
                        onSelect={() => setIsCreateOpen(true)}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                    >
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                            <Layout size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-white">Create New</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Start a fresh canvas</span>
                        </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-white/5" />
                    
                    <DropdownMenuItem 
                        onSelect={() => setIsJoinOpen(true)}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                    >
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg group-hover:scale-110 transition-transform">
                            <Users size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-white">Join Existing</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Collaborate via ID/URL</span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateRoomModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
            <JoinRoomModal isOpen={isJoinOpen} onOpenChange={setIsJoinOpen} />
        </>
    );
}
