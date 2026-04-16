"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { initDraw, ShapeType } from "../../../draw";
import { Square, Circle, RectangleHorizontal, Minus, ArrowRight, Type, Undo, Redo, Eraser, Hand, Pencil } from "lucide-react";
import { useCanvasStore } from "../../../store/canvasStore";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import axios from "axios";
import { Share2, X as XIcon, Loader2, Menu, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { useTheme } from "next-themes";

export default function Page({
    params
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = use(params);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState<ShapeType>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("selected-shape");
            if (saved && ["rectangle", "square", "circle", "line", "arrow", "text", "pencil"].includes(saved)) {
                return saved as ShapeType;
            }
        }
        return "rectangle";
    });
    const shapeTypeRef = useRef<ShapeType>(selectedShape);
    const [isEraser, setIsEraser] = useState<boolean>(false);
    const isEraserRef = useRef<boolean>(false);
    const [isPanMode, setIsPanMode] = useState<boolean>(false);
    const isPanModeRef = useRef<boolean>(false);

    const [isShared, setIsShared] = useState<boolean>(false);
    const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
    const [isTogglingShare, setIsTogglingShare] = useState(false);
    const [isLoadingInitialState, setIsLoadingInitialState] = useState(true);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userRooms, setUserRooms] = useState<{ id: string, slug: string, updatedAt: string }[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);
    const { resolvedTheme } = useTheme();

    const undo = useCanvasStore((state) => state.undo);
    const redo = useCanvasStore((state) => state.redo);

    const canUndo = useCanvasStore((state) => {
        if (!roomId) return false;
        const room = state.rooms[roomId];
        return room ? room.historyStep > 0 : false;
    });

    const canRedo = useCanvasStore((state) => {
        if (!roomId) return false;
        const room = state.rooms[roomId];
        return room ? room.historyStep < room.history.length - 1 : false;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "z") {
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo(roomId);
                    } else {
                        undo(roomId);
                    }
                } else if (e.key === "y") {
                    e.preventDefault();
                    redo(roomId);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [undo, redo, roomId]);

    useEffect(() => {
        if (!roomId) return;
        setIsLoadingInitialState(true);
        axios.get(`/api/shapes/${roomId}`)
            .then(res => {
                if (res.data) {
                    setIsShared(Boolean(res.data.isShared));
                }
            })
            .catch(err => {
                console.error("Failed to load room state", err);
            })
            .finally(() => {
                setIsLoadingInitialState(false);
            });
    }, [roomId]);

    const { socket, error, retryCount } = useSocket(!isLoadingInitialState && isShared);

    useEffect(() => {
        if (socket && roomId) {
            socket.send(
                JSON.stringify({
                    type: "join",
                    roomId: roomId
                })
            );
        }
    }, [socket, roomId]);

    useEffect(() => {
        shapeTypeRef.current = selectedShape;
        if (typeof window !== "undefined") {
            localStorage.setItem("selected-shape", selectedShape);
        }
    }, [selectedShape]);

    useEffect(() => {
        isEraserRef.current = isEraser;
        isPanModeRef.current = isPanMode;

        if (canvasRef.current) {
            if (isEraser) {
                canvasRef.current.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21'/%3E%3Cpath d='M22 21H7'/%3E%3Cpath d='m5 11 9 9'/%3E%3C/svg%3E") 4 20, auto`;
            } else if (isPanMode) {
                canvasRef.current.style.cursor = "grab";
            } else {
                canvasRef.current.style.cursor = "default";
            }
        }
    }, [isEraser, isPanMode]);

    useEffect(() => {
        const init = async () => {
            if (isLoadingInitialState) return;
            if (!canvasRef.current) return;
            const cleanup = await initDraw(
                canvasRef.current,
                roomId,
                socket,
                shapeTypeRef,
                isEraserRef,
                isPanModeRef,
                resolvedTheme === "dark"
            );
            return cleanup;
        };

        const cleanupPromise = init();

        return () => {
            cleanupPromise.then(cleanup => cleanup?.());
        };
    }, [roomId, socket, resolvedTheme, isLoadingInitialState]);

    const toggleSharing = async () => {
        setIsTogglingShare(true);
        try {
            const newState = !isShared;
            const currentShapes = useCanvasStore.getState().rooms[roomId]?.shapes || [];

            const res = await axios.post(`/api/room/${roomId}/share`, {
                isShared: newState,
                shapes: newState ? currentShapes : []
            });

            if (res.data.success) {
                setIsShared(newState);
            }
        } catch (error) {
            console.error("Failed to toggle sharing", error);
            alert("Failed to toggle sharing. Are you the admin?");
        } finally {
            setIsTogglingShare(false);
            setIsSharingModalOpen(false);
        }
    };

    const fetchUserRooms = async () => {
        setIsLoadingRooms(true);
        try {
            const res = await axios.get("/api/user/rooms");
            if (res.data && res.data.rooms) {
                setUserRooms(res.data.rooms);
            }
        } catch (error) {
            console.error("Failed to load user rooms", error);
        } finally {
            setIsLoadingRooms(false);
        }
    };

    useEffect(() => {
        if (isSidebarOpen && userRooms.length === 0) {
            fetchUserRooms();
        }
    }, [isSidebarOpen]);

    if (isLoadingInitialState) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] gap-3 transition-colors">
                <div className="animate-spin w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full" />
                <p className="text-sm font-medium text-black dark:text-white">Loading...</p>
            </div>
        );
    }

    if (isShared && !socket) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] gap-3 transition-colors">
                {error ? (
                    <>
                        <p className="text-base font-medium text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 text-sm transition-colors"
                        >
                            Reload
                        </button>
                    </>
                ) : (
                    <>
                        <div className="animate-spin w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full" />
                        <p className="text-sm font-medium text-black dark:text-white">
                            {retryCount > 0
                                ? `Reconnecting… (attempt ${retryCount}/${5})`
                                : "Connecting to canvas…"}
                        </p>
                    </>
                )}
            </div>
        );
    }

    const shapes: { type: ShapeType; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
        { type: "rectangle", label: "Rectangle", Icon: RectangleHorizontal },
        { type: "square", label: "Square", Icon: Square },
        { type: "circle", label: "Circle", Icon: Circle },
        { type: "line", label: "Line", Icon: Minus },
        { type: "arrow", label: "Arrow", Icon: ArrowRight },
        { type: "text", label: "Text", Icon: Type },
        { type: "pencil", label: "Pencil", Icon: Pencil }
    ];

    return (
        <ErrorBoundary>
            <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-gray-900">
                <div className="absolute top-20 left-4 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-full border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90 shadow-sm"
                        title="Open Rooms Menu"
                    >
                        <Menu size={18} className="text-black/60 dark:text-white/60" />
                    </Button>
                </div>


                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}


                <div
                    className={`fixed top-0 left-0 h-full w-72 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-black/5 dark:border-white/5 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="p-5 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-black/60 dark:text-white/60 mb-0 ml-2">
                            Created Rooms
                        </h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 rounded-full text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <XIcon size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                        {isLoadingRooms ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-5 h-5 animate-spin text-black/20 dark:text-white/20" />
                            </div>
                        ) : userRooms.length === 0 ? (
                            <div className="text-center p-6 text-xs text-black/40 dark:text-white/40 font-medium">
                                No rooms created
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {userRooms.map((room) => (
                                    <Link
                                        key={room.id}
                                        href={`/canvas/${room.id}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="group"
                                    >
                                        <div className={`relative px-4 py-2.5 rounded-full transition-all duration-200 flex items-center justify-between ${room.id === roomId
                                            ? "bg-black/5 dark:bg-white/10"
                                            : "hover:bg-black/5 dark:hover:bg-white/5"
                                            }`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                    room.id === roomId 
                                                    ? "bg-black dark:bg-white animate-pulse" 
                                                    : "bg-transparent group-hover:bg-black/20 dark:group-hover:bg-white/20"
                                                }`} />
                                                <p className={`text-sm font-medium truncate tracking-tight ${room.id === roomId ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"}`}>
                                                    {room.slug}
                                                </p>
                                            </div>
                                            {room.id === roomId && (
                                                <div className="w-1 h-1 rounded-full bg-black dark:bg-white" />
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute top-20 right-4 z-10 flex items-center gap-3 bg-white dark:bg-[#1a1a1a] p-2 rounded-lg shadow-lg border border-black/10 dark:border-white/10">
                    <Button
                        onClick={() => setIsSharingModalOpen(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm active:scale-95 ${isShared
                            ? "bg-black text-white dark:bg-white dark:text-black border border-transparent hover:opacity-80"
                            : "bg-black/5 text-black hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 border border-transparent"
                            }`}
                    >
                        <Share2 size={16} />
                        {isShared ? "Live Shared" : "Share"}
                    </Button>
                </div>

                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-black/10 dark:border-white/10 p-2 flex gap-1">
                        {shapes.map((shape) => {
                            const Icon = shape.Icon;
                            return (
                                <button
                                    key={shape.type}
                                    onClick={() => { setSelectedShape(shape.type); setIsEraser(false); setIsPanMode(false); }}
                                    className={`
                                        p-3 rounded-md transition-all
                                        ${selectedShape === shape.type && !isEraser && !isPanMode
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                            : "bg-transparent text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
                                        }
                                    `}
                                    title={shape.label}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                        <div className="w-[1px] bg-black/10 dark:bg-white/10 mx-1"></div>
                        <button
                            onClick={() => { setIsEraser((prev) => !prev); setIsPanMode(false); }}
                            className={`p-3 rounded-md transition-all ${isEraser
                                ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                : "bg-transparent text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
                                }`}
                            title="Eraser (click shape edge to delete)"
                        >
                            <Eraser size={20} />
                        </button>
                        <button
                            onClick={() => { setIsPanMode((prev) => !prev); setIsEraser(false); }}
                            className={`p-3 rounded-md transition-all ${isPanMode
                                ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                : "bg-transparent text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
                                }`}
                            title="Pan (hold and drag to move canvas)"
                        >
                            <Hand size={20} />
                        </button>
                        <div className="w-[1px] bg-black/10 dark:bg-white/10 mx-1"></div>
                        <Button
                            onClick={() => undo(roomId)}
                            disabled={!canUndo}
                            className={`p-3 rounded-md transition-all ${canUndo ? "bg-transparent text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10" : "text-black/30 dark:text-white/30 cursor-not-allowed"}`}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo size={20} />
                        </Button>
                        <Button
                            onClick={() => redo(roomId)}
                            disabled={!canRedo}
                            className={`p-3 rounded-md transition-all ${canRedo ? "bg-transparent text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10" : "text-black/30 dark:text-white/30 cursor-not-allowed"}`}
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo size={20} />
                        </Button>
                    </div>
                </div>

                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                />

                {isSharingModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Live Collaboration</h2>
                                <button
                                    onClick={() => !isTogglingShare && setIsSharingModalOpen(false)}
                                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                                {isShared
                                    ? "This room is currently live. Anyone with the link can join and edit."
                                    : "This room is local. Share it to enable real-time collaboration with others."}
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSharingModalOpen(false)}
                                    disabled={isTogglingShare}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={toggleSharing}
                                    disabled={isTogglingShare}
                                    className={`${isShared ? "bg-red-500 hover:bg-red-600 focus:ring-red-500" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}`}
                                >
                                    {isTogglingShare ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    {isShared ? "Stop Sharing" : "Start Sharing"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}

