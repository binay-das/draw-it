"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { initDraw } from "../../../draw";

export default function Page({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            initDraw(canvasRef.current, slug, socket).then((cleanupFn) => {
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

    return (
        <div className="w-full h-screen relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
}
