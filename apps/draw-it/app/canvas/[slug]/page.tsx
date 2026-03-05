"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { initDraw, ShapeType } from "../../../draw";
import { Square, Circle, RectangleHorizontal, Minus, ArrowRight, Type, Undo, Redo, Eraser, Hand } from "lucide-react";
import { useCanvasStore } from "../../../store/canvasStore";
import { Button } from "@repo/ui/button";
import { ErrorBoundary } from "../../components/ErrorBoundary";

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
            if (saved && ["rectangle", "square", "circle", "line", "arrow", "text"].includes(saved)) {
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

    const undo = useCanvasStore((state) => state.undo);
    const redo = useCanvasStore((state) => state.redo);
    const canUndo = useCanvasStore((state) => state.historyStep > 0);
    const canRedo = useCanvasStore((state) => state.historyStep < state.history.length - 1);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "z") {
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                } else if (e.key === "y") {
                    e.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [undo, redo]);

    const { socket, error, retryCount } = useSocket();

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
        let cleanup: (() => void) | null = null;

        if (canvasRef.current && socket) {
            initDraw(canvasRef.current, slug, socket, shapeTypeRef, isEraserRef, isPanModeRef).then((cleanupFn) => {
                cleanup = cleanupFn;
            });
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [slug, socket]);

    if (!socket) {
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
        { type: "text", label: "Text", Icon: Type }
    ];

    return (
        <ErrorBoundary>
            <div className="w-full h-screen relative">
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
                            onClick={undo}
                            disabled={!canUndo}
                            className={`p-3 rounded-md transition-all ${canUndo ? "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo size={20} />
                        </Button>
                        <Button
                            onClick={redo}
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
            </div>
        </ErrorBoundary>
    );
}

