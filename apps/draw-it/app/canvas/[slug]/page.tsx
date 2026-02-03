"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { initDraw, ShapeType } from "../../../draw";
import { Square, Circle, RectangleHorizontal, Minus } from "lucide-react";

export default function Page({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState<ShapeType>("rectangle");

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
        let cleanup: (() => void) | null = null;

        if (canvasRef.current && socket) {
            initDraw(canvasRef.current, slug, socket, selectedShape).then((cleanupFn) => {
                cleanup = cleanupFn;
            });
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [slug, socket, selectedShape]);

    if (!socket) {
        return <div className="w-full h-screen">Loading…</div>;
    }

    const shapes: { type: ShapeType; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
        { type: "rectangle", label: "Rectangle", Icon: RectangleHorizontal },
        { type: "square", label: "Square", Icon: Square },
        { type: "circle", label: "Circle", Icon: Circle },
        { type: "line", label: "Line", Icon: Minus }
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
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
}
