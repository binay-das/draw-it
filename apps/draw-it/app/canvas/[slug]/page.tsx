"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { initDraw, ShapeType } from "../../../draw";
import { Square, Circle, RectangleHorizontal, Minus, ArrowRight, Type, Undo, Redo } from "lucide-react";
import { useCanvasStore } from "../../../store/canvasStore";
import { Button } from "@repo/ui/button";

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

    const { socket } = useSocket();

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
        let cleanup: (() => void) | null = null;

        if (canvasRef.current && socket) {
            initDraw(canvasRef.current, slug, socket, shapeTypeRef).then((cleanupFn) => {
                cleanup = cleanupFn;
            });
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [slug, socket]);

    if (!socket) {
        return <div className="w-full h-screen">Loading…</div>;
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
        <div className="w-full h-screen relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1">
                    {shapes.map((shape) => {
                        const Icon = shape.Icon;
                        return (
                            <button
                                key={shape.type}
                                onClick={() => setSelectedShape(shape.type)}
                                className={`
                                    p-3 rounded-md transition-all
                                    ${selectedShape === shape.type
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
    );
}
