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
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
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
        if (!slug) return false;
        const room = state.rooms[slug as string];
        return room ? room.historyStep > 0 : false;
    });

    const canRedo = useCanvasStore((state) => {
        if (!slug) return false;
        const room = state.rooms[slug as string];
        return room ? room.historyStep < room.history.length - 1 : false;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "z") {
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo(slug as string);
                    } else {
                        undo(slug as string);
                    }
                } else if (e.key === "y") {
                    e.preventDefault();
                    redo(slug as string);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [undo, redo, slug]);

    useEffect(() => {
        if (!slug) return;
        setIsLoadingInitialState(true);
        axios.get(`/api/shapes/${slug}`)
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
    }, [slug]);

    const { socket, error, retryCount } = useSocket(!isLoadingInitialState && isShared);

    useEffect(() => {
        if (socket && slug) {
            socket.send(
                JSON.stringify({
                    type: "join",
                    roomSlug: slug
                })
            );
        }
    }, [socket, slug]);

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
            if (!canvasRef.current) return;
            const cleanup = await initDraw(
                canvasRef.current,
                slug,
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
    }, [slug, socket, resolvedTheme]);

    const toggleSharing = async () => {
        setIsTogglingShare(true);
        try {
            const newState = !isShared;
            const currentShapes = useCanvasStore.getState().rooms[slug as string]?.shapes || [];

            const res = await axios.post(`/api/room/${slug}/share`, {
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
            <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-3">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading canvas...</p>
            </div>
        );
    }


    if (isShared && !socket) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-3">
                {error ? (
                    <>
                        <p className="text-base font-medium text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                            Reload
                        </button>
                    </>
                ) : (
                    <>
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
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


                <div className="absolute top-4 left-4 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        title="Open Rooms Menu"
                    >
                        <Menu size={20} />
                    </Button>
                </div>


                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}


                <div
                    className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock size={18} className="text-blue-500" />
                            Recent Rooms
                        </h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                            <XIcon size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                        {isLoadingRooms ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : userRooms.length === 0 ? (
                            <div className="text-center p-8 text-sm text-gray-500 dark:text-gray-400">
                                You haven't created any rooms yet.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {userRooms.map((room) => (
                                    <Link
                                        key={room.id}
                                        href={`/canvas/${room.slug}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <div className={`p-3 rounded-lg border transition-all ${room.slug === slug
                                            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                                            : "bg-white border-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 shadow-sm hover:shadow"
                                            }`}>
                                            <p className={`font-medium truncate ${room.slug === slug ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"
                                                }`}>
                                                {room.slug}
                                                {room.slug === slug && <span className="ml-2 text-[10px] uppercase font-bold text-blue-500 tracking-wider">Current</span>}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1.5">
                                                Last edited: {new Date(room.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Button
                        onClick={() => setIsSharingModalOpen(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm active:scale-95 ${isShared
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-blue-200 dark:border-gray-600"
                            }`}
                    >
                        <Share2 size={16} />
                        {isShared ? "Live Shared" : "Share"}
                    </Button>
                </div>

                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1">
                        {shapes.map((shape) => {
                            const Icon = shape.Icon;
                            return (
                                <button
                                    key={shape.type}
                                    onClick={() => { setSelectedShape(shape.type); setIsEraser(false); setIsPanMode(false); }}
                                    className={`
                                        p-3 rounded-md transition-all
                                        ${selectedShape === shape.type && !isEraser && !isPanMode
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }
                                    `}
                                    title={shape.label}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                        <div className="w-[1px] bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button
                            onClick={() => { setIsEraser((prev) => !prev); setIsPanMode(false); }}
                            className={`p-3 rounded-md transition-all ${isEraser
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                            title="Eraser (click shape edge to delete)"
                        >
                            <Eraser size={20} />
                        </button>
                        <button
                            onClick={() => { setIsPanMode((prev) => !prev); setIsEraser(false); }}
                            className={`p-3 rounded-md transition-all ${isPanMode
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                            title="Pan (hold and drag to move canvas)"
                        >
                            <Hand size={20} />
                        </button>
                        <div className="w-[1px] bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <Button
                            onClick={() => undo(slug as string)}
                            disabled={!canUndo}
                            className={`p-3 rounded-md transition-all ${canUndo ? "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo size={20} />
                        </Button>
                        <Button
                            onClick={() => redo(slug as string)}
                            disabled={!canRedo}
                            className={`p-3 rounded-md transition-all ${canRedo ? "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
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

