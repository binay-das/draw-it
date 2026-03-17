import prisma from "@repo/db";
import { cookies } from "next/headers";
import { auth } from "@repo/common";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Plus, Clock, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
                    <Link href="/canvas">
                        <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                            <Plus size={18} />
                            Create / Join Room
                        </Button>
                    </Link>
                </div>

                {rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-gray-50 dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-[#222] transition-colors">
                        <div className="w-20 h-20 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Plus size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">No rooms found</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 transition-colors">You haven't created or joined any rooms yet. Start your first drawing session now.</p>
                        <Link href="/canvas">
                            <Button className="h-10 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors">
                                Start drawing
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rooms.map((room) => (
                            <Link href={`/canvas/${room.slug}`} key={room.id} className="group flex flex-col bg-white dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                                <div className="h-32 bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center border-b border-gray-100 dark:border-[#222] group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 transition-colors">
                                    <div className="text-gray-300 dark:text-gray-700 group-hover:text-blue-200 dark:group-hover:text-blue-900/40 transition-colors">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" /><path d="m10 14-1-1-3 4h12l-5-7z" /></svg>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate transition-colors">/{room.slug}</h3>
                                    <div className="flex items-center gap-4 mt-auto pt-4">
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1.5 transition-colors">
                                            <Clock size={14} />
                                            <span>{formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1.5 ml-auto transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                            <span>{room._count.shapes} shapes</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
