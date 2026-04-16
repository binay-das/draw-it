"use client";

import axios from "axios";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@repo/ui/alert-dialog";


interface DeleteRoomButtonProps {
    roomId: string;
    roomSlug: string;
}

export function DeleteRoomButton({ roomId, roomSlug }: DeleteRoomButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/room/${roomId}`);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete room:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-black/40 hover:bg-red-50 dark:hover:bg-red-900/40 text-gray-500 hover:text-red-600 dark:hover:text-red-500 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-md transition-all duration-200 group/delete hover:scale-110 active:scale-95 disabled:opacity-50"
                    title="Delete Room"
                >
                    <Trash2 size={16} className={isDeleting ? "animate-pulse" : ""} />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                        This action cannot be undone. This will permanently delete your room <span className="font-bold text-gray-900 dark:text-white">"{roomSlug}"</span> and all its shapes.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl border-none shadow-lg shadow-red-500/20"
                    >
                        {isDeleting ? "Deleting..." : "Delete Room"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
