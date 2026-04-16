import prisma from "@repo/db";
import { cookies } from "next/headers";
import { auth } from "@repo/common";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Plus, Clock, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateRoomModal } from "../components/CreateRoomModal";
import { DeleteRoomButton } from "../components/DeleteRoomButton";

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const result = auth.verifyTokenSafe(token);
    if (!result.valid) return null;
    return result.id;
}

export default async function DashboardPage() {
    const userId = await getUser();

    if (!userId) {
        redirect("/signin");
    }

    const rooms = await prisma.room.findMany({
        where: { adminId: userId },
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { shapes: true } } }
    });

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors">
            <main className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Your Canvas Rooms</h1>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors">Manage and jump back into your recent drawings.</p>
                    </div>
                    <CreateRoomModal>
                        <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                            <Plus size={18} />
                            Create / Join Room
                        </Button>
                    </CreateRoomModal>
                </div>

                {rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-gray-50 dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-[#222] transition-colors">
                        <div className="w-20 h-20 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Plus size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">No rooms found</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 transition-colors">You haven't created or joined any rooms yet. Start your first drawing session now.</p>
                        <CreateRoomModal>
                            <Button className="h-10 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors">
                                Start drawing
                            </Button>
                        </CreateRoomModal>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rooms.map((room) => (
                            <div key={room.id} className="relative group">
                                <DeleteRoomButton roomId={room.id} roomSlug={room.slug} />
                                <Link href={`/canvas/${room.id}`} className="flex flex-col bg-white dark:bg-[#111] rounded-3xl border border-gray-200/80 dark:border-[#222] overflow-hidden hover:border-black/30 dark:hover:border-white/30 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1 transition-all duration-300">
                                    <div className="h-40 relative overflow-hidden bg-gray-50 dark:bg-[#161616] flex items-center justify-center border-b border-gray-200/80 dark:border-[#222]">
                                    <div className="absolute inset-0 opacity-[0.06] dark:opacity-0" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, black 1.5px, transparent 0)', backgroundSize: '16px 16px' }} />
                                    <div className="absolute inset-0 opacity-0 dark:opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '16px 16px' }} />
                                    
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black/5 dark:bg-white/5 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                                    
                                    <div className="relative text-black/20 dark:text-white/20 group-hover:scale-110 group-hover:text-black dark:group-hover:text-white transition-all duration-500 transform group-hover:rotate-[5deg]">
                                        <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <rect x="4" y="4" width="10" height="10" rx="2" />
                                            <circle cx="16" cy="16" r="4" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18l6-6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col relative bg-white dark:bg-[#111] z-10 transition-colors">
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 truncate group-hover:text-black dark:group-hover:text-white transition-colors">/{room.slug}</h3>
                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-[#222]">
                                        <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 gap-1.5">
                                            <Clock size={14} className="text-gray-400 dark:text-gray-500" />
                                            <span>{formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300 gap-2 ml-auto bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-white/5 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
                                            <span>{room._count.shapes}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
