import axios from "axios";
import { useCanvasStore } from "../store/canvasStore";

export type ShapeType = "rectangle" | "square" | "circle" | "line" | "arrow" | "text" | "pencil";

interface Shape {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    points?: { x: number; y: number }[];
}

interface ViewportState {
    scale: number;
    offsetX: number;
    offsetY: number;
}

function saveViewport(slug: string, scale: number, offsetX: number, offsetY: number) {
    try {
        const state: ViewportState = { scale, offsetX, offsetY };
        localStorage.setItem(`canvas-viewport-${slug}`, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save viewport state:", error);
    }
}

function loadViewport(slug: string): ViewportState {
    try {
        const saved = localStorage.getItem(`canvas-viewport-${slug}`);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error("Failed to load viewport state:", error);
    }
    return { scale: 1, offsetX: 0, offsetY: 0 };
}

export async function initDraw(
    canvas: HTMLCanvasElement,
    slug: string,
    socket: WebSocket | null,
    shapeTypeRef: { current: ShapeType },
    isEraserRef: { current: boolean },
    isPanModeRef: { current: boolean }
) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;


    const activeCanvas = document.createElement("canvas");
    activeCanvas.width = canvas.width;
    activeCanvas.height = canvas.height;
    activeCanvas.style.position = "absolute";
    activeCanvas.style.top = "0";
    activeCanvas.style.left = "0";
    activeCanvas.style.pointerEvents = "none"; // clicks pass through to the static canvas
    if (canvas.parentElement) {
        canvas.parentElement.appendChild(activeCanvas);
    }
    const activeCtx = activeCanvas.getContext("2d") as CanvasRenderingContext2D;

    // shapes are now managed by Zustand store

    // load saved viewport state
    const savedViewport = loadViewport(slug);

    // zoom and pan state
    let scale = savedViewport.scale;
    let offsetX = savedViewport.offsetX;
    let offsetY = savedViewport.offsetY;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;

    // debounce timer for saving viewport
    let saveTimer: NodeJS.Timeout | null = null;
    function debouncedSaveViewport() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            saveViewport(slug, scale, offsetX, offsetY);
        }, 300);
    }

    try {
        const response = await axios.get<{ shapes: Shape[] }>(`/api/shapes/${slug}`);
        if (response.data && response.data.shapes) {
            useCanvasStore.getState().setShapes(slug, response.data.shapes);
        }
    } catch (error) {
        console.error("Error fetching existing shapes:", error);
    }

    let isClicked = false;
    let startX = 0;
    let startY = 0;

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.style.position = "absolute";
    textInput.style.border = "2px solid #4A90E2";
    textInput.style.padding = "4px 8px";
    textInput.style.fontSize = "16px";
    textInput.style.fontFamily = "Arial";
    textInput.style.zIndex = "1000";
    textInput.style.display = "none";
    textInput.style.outline = "none";
    textInput.style.borderRadius = "4px";
    if (canvas.parentElement) {
        canvas.parentElement.appendChild(textInput);
    }

    let editingTextIndex: number | null = null;

    function showTextInput(canvasX: number, canvasY: number, initialText = "") {
        const rect = canvas.getBoundingClientRect();
        const screenX = canvasX * scale + offsetX + rect.left;
        const screenY = canvasY * scale + offsetY + rect.top;

        textInput.style.left = `${screenX}px`;
        textInput.style.top = `${screenY - 20}px`;
        textInput.value = initialText;
        textInput.style.display = "block";
        textInput.focus();
    }

    function hideTextInput() {
        textInput.style.display = "none";
        textInput.value = "";
        editingTextIndex = null;
    }

    function handleTextInputComplete() {
        const text = textInput.value.trim();
        if (!text) {
            hideTextInput();
            return;
        }

        if (editingTextIndex !== null) {
            const currentRoomState = useCanvasStore.getState().rooms[slug];
            const currentShapes = currentRoomState ? [...currentRoomState.shapes] : [];
            const shape = currentShapes[editingTextIndex];
            if (shape) {
                const newShape = { ...shape, text: text };
                currentShapes[editingTextIndex] = newShape;
                useCanvasStore.getState().setShapes(slug, currentShapes);

                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "chat",
                        roomSlug: slug,
                        message: newShape
                    }));
                } else {
                    axios.post(`/api/shapes/${slug}`, {
                        action: "add",
                        shape: newShape
                    }).catch(err => console.error("Failed to save edited text shape:", err));
                }
            }
        } else {
            const canvasCoords = screenToCanvas(
                parseInt(textInput.style.left) - canvas.getBoundingClientRect().left,
                parseInt(textInput.style.top) + 20 - canvas.getBoundingClientRect().top
            );

            const textShape: Shape = {
                type: "text",
                x: canvasCoords.x,
                y: canvasCoords.y,
                width: 0,
                height: 0,
                text
            };

            useCanvasStore.getState().addShape(slug, textShape);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "chat",
                    roomSlug: slug,
                    message: textShape
                }));
            } else {
                axios.post(`/api/shapes/${slug}`, {
                    action: "add",
                    shape: textShape
                }).catch(err => console.error("Failed to save new text shape:", err));
            }
        }

        clearCanvas();
        hideTextInput();
    }

    textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleTextInputComplete();
        } else if (e.key === "Escape") {
            hideTextInput();
        }
    });

    textInput.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });

    // screen coordinates to canvas coordinates
    function screenToCanvas(screenX: number, screenY: number) {
        return {
            x: (screenX - offsetX) / scale,
            y: (screenY - offsetY) / scale
        };
    }

    function normalizeSize(width: number, height: number) {
        if (shapeTypeRef.current === "square" || shapeTypeRef.current === "circle") {
            const size = Math.min(Math.abs(width), Math.abs(height));
            return {
                width: width < 0 ? -size : size,
                height: height < 0 ? -size : size
            };
        }
        return { width, height };
    }

    // Hit testing: returns true if (px, py) is on or near the edge of shape
    const HIT_TOLERANCE = 5;
    function hitTestShape(shape: Shape, px: number, py: number): boolean {
        const tol = HIT_TOLERANCE / scale;

        if (shape.type === "line" || shape.type === "arrow") {
            // distance from point to line segment
            const x1 = shape.x, y1 = shape.y;
            const x2 = shape.x + shape.width, y2 = shape.y + shape.height;
            const dx = x2 - x1, dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;
            if (lenSq === 0) return Math.hypot(px - x1, py - y1) <= tol;
            const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
            const nearX = x1 + t * dx, nearY = y1 + t * dy;
            return Math.hypot(px - nearX, py - nearY) <= tol;
        }

        if (shape.type === "circle") {
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;
            return Math.abs(Math.hypot(px - cx, py - cy) - radius) <= tol;
        }

        if (shape.type === "text") {
            // box around text position
            const fontSize = 16 / scale;
            const approxWidth = (shape.text?.length ?? 0) * fontSize * 0.6;
            return px >= shape.x - tol && px <= shape.x + approxWidth + tol &&
                py >= shape.y - fontSize - tol && py <= shape.y + tol;
        }

        if (shape.type === "pencil" && shape.points && shape.points.length > 0) {
            // Check distance to any line segment connecting consecutive points
            for (let i = 0; i < shape.points.length - 1; i++) {
                const p1 = shape.points[i];
                const p2 = shape.points[i + 1];
                if (!p1 || !p2) continue;

                const lx1 = shape.x + p1.x, ly1 = shape.y + p1.y;
                const lx2 = shape.x + p2.x, ly2 = shape.y + p2.y;
                const dx = lx2 - lx1, dy = ly2 - ly1;
                const lenSq = dx * dx + dy * dy;

                let distToSegment;
                if (lenSq === 0) {
                    distToSegment = Math.hypot(px - lx1, py - ly1);
                } else {
                    const t = Math.max(0, Math.min(1, ((px - lx1) * dx + (py - ly1) * dy) / lenSq));
                    const nearX = lx1 + t * dx, nearY = ly1 + t * dy;
                    distToSegment = Math.hypot(px - nearX, py - nearY);
                }

                if (distToSegment <= tol) return true;
            }
            return false;
        }

        // rectangle and square: hit on any of the 4 edges
        const left = Math.min(shape.x, shape.x + shape.width);
        const right = Math.max(shape.x, shape.x + shape.width);
        const top = Math.min(shape.y, shape.y + shape.height);
        const bottom = Math.max(shape.y, shape.y + shape.height);
        const onLeft = Math.abs(px - left) <= tol && py >= top - tol && py <= bottom + tol;
        const onRight = Math.abs(px - right) <= tol && py >= top - tol && py <= bottom + tol;
        const onTop = Math.abs(py - top) <= tol && px >= left - tol && px <= right + tol;
        const onBottom = Math.abs(py - bottom) <= tol && px >= left - tol && px <= right + tol;
        return onLeft || onRight || onTop || onBottom;
    }

    function eraseShapeAt(px: number, py: number) {
        const currentRoomState = useCanvasStore.getState().rooms[slug];
        const currentShapes = currentRoomState ? currentRoomState.shapes : [];
        // erase the topmost drawn shape first
        for (let i = currentShapes.length - 1; i >= 0; i--) {
            const shape = currentShapes[i];
            if (!shape) continue;
            if (hitTestShape(shape, px, py)) {
                const newShapes = currentShapes.filter((_, idx) => idx !== i);
                useCanvasStore.getState().setShapes(slug, newShapes);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "delete",
                        roomSlug: slug,
                        message: shape
                    }));
                } else {
                    axios.post(`/api/shapes/${slug}`, {
                        action: "delete",
                        shape: shape
                    }).catch(err => console.error("Failed to delete shape:", err));
                }
                return; // erase one shape per call
            }
        }
    }

    function drawShapeOn(ctx: CanvasRenderingContext2D, shape: Shape) {
        if (shape.type === "line") {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.stroke();
            return;
        }

        if (shape.type === "arrow") {
            const sx = shape.x, sy = shape.y;
            const ex = shape.x + shape.width, ey = shape.y + shape.height;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();

            const angle = Math.atan2(ey - sy, ex - sx);
            const headLength = 15 / scale;
            const headAngle = Math.PI / 6;
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex - headLength * Math.cos(angle - headAngle), ey - headLength * Math.sin(angle - headAngle));
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex - headLength * Math.cos(angle + headAngle), ey - headLength * Math.sin(angle + headAngle));
            ctx.stroke();
            return;
        }

        if (shape.type === "circle") {
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
            return;
        }

        if (shape.type === "text" && shape.text) {
            const fontSize = 16 / scale;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = "#000000";
            ctx.fillText(shape.text, shape.x, shape.y);
            return;
        }

        if (shape.type === "pencil" && shape.points && shape.points.length > 0) {
            const firstPoint = shape.points[0];
            if (!firstPoint) return;
            ctx.beginPath();
            ctx.moveTo(shape.x + firstPoint.x, shape.y + firstPoint.y);
            for (let i = 1; i < shape.points.length; i++) {
                const p = shape.points[i];
                if (p) ctx.lineTo(shape.x + p.x, shape.y + p.y);
            }
            ctx.stroke();
            return;
        }

        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }

    function drawShape(shape: Shape) { drawShapeOn(context, shape); }

    function clearCanvas() {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.setTransform(scale, 0, 0, scale, offsetX, offsetY);
        context.strokeStyle = "#000000";
        context.lineWidth = 2 / scale;

        const currentRoomState = useCanvasStore.getState().rooms[slug];
        if (currentRoomState && currentRoomState.shapes) {
            currentRoomState.shapes.forEach(drawShape);
        }
    }


    function clearActiveLayer() {
        activeCtx.setTransform(1, 0, 0, 1, 0, 0);
        activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    }


    let rafId: number | null = null;
    let currentPencilPoints: { x: number; y: number }[] = [];
    let lastStreamTime = 0;
    const STREAM_THROTTLE_MS = 50;

    clearCanvas();

    const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        if (e.button === 1 || e.ctrlKey || e.metaKey || isPanModeRef.current) {
            isPanning = true;
            panStartX = screenX;
            panStartY = screenY;
            canvas.style.cursor = "grabbing";
            return;
        }

        // handle eraser tool
        if (isEraserRef.current) {
            const canvasCoords = screenToCanvas(screenX, screenY);
            eraseShapeAt(canvasCoords.x, canvasCoords.y);
            isClicked = true;
            return;
        }

        // handle text tool
        if (shapeTypeRef.current === "text") {
            const canvasCoords = screenToCanvas(screenX, screenY);
            showTextInput(canvasCoords.x, canvasCoords.y);
            return;
        }

        isClicked = true;
        const canvasCoords = screenToCanvas(screenX, screenY);
        startX = canvasCoords.x;
        startY = canvasCoords.y;

        if (shapeTypeRef.current === "pencil") {
            currentPencilPoints = [{ x: 0, y: 0 }];
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isPanning) {
            isPanning = false;
            // Restore the cursor appropriate to current mode
            if (isPanModeRef.current) {
                canvas.style.cursor = "grab";
            } else if (isEraserRef.current) {
                canvas.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21'/%3E%3Cpath d='M22 21H7'/%3E%3Cpath d='m5 11 9 9'/%3E%3C/svg%3E") 4 20, auto`;
            } else {
                canvas.style.cursor = "default";
            }
            return;
        }

        if (!isClicked) return;
        isClicked = false;


        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }

        clearActiveLayer();




        if (isEraserRef.current) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const canvasCoords = screenToCanvas(screenX, screenY);

        const rawWidth = canvasCoords.x - startX;
        const rawHeight = canvasCoords.y - startY;
        const { width, height } = normalizeSize(rawWidth, rawHeight);

        const shape: Shape = {
            type: shapeTypeRef.current,
            x: startX,
            y: startY,
            width,
            height,
            ...(shapeTypeRef.current === "pencil" ? { points: currentPencilPoints } : {})
        };

        if (shapeTypeRef.current === "pencil" && currentPencilPoints.length > 0) {

            let minX = 0, minY = 0, maxX = 0, maxY = 0;
            currentPencilPoints.forEach((p, i) => {
                if (i === 0) {
                    minX = maxX = p.x;
                    minY = maxY = p.y;
                } else {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            });
            shape.x = startX + minX;
            shape.y = startY + minY;
            shape.width = maxX - minX;
            shape.height = maxY - minY;

            shape.points = currentPencilPoints.map(p => ({ x: p.x - minX, y: p.y - minY }));
        }

        useCanvasStore.getState().addShape(slug, shape);
        clearCanvas();

        currentPencilPoints = [];

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "chat",
                roomSlug: slug,
                message: shape
            }));
        } else {
            axios.post(`/api/shapes/${slug}`, {
                action: "add",
                shape: shape
            }).catch(err => console.error("Failed to save new shape:", err));
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        if (isPanning) {
            const dx = screenX - panStartX;
            const dy = screenY - panStartY;
            offsetX += dx;
            offsetY += dy;
            panStartX = screenX;
            panStartY = screenY;
            // Pan redraws static layer — gate with RAF too
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                clearCanvas();
                rafId = null;
            });
            debouncedSaveViewport();
            return;
        }

        if (!isClicked) return;

        // eraser drag: erase shapes as we move
        if (isEraserRef.current) {
            const canvasCoords = screenToCanvas(screenX, screenY);
            eraseShapeAt(canvasCoords.x, canvasCoords.y);
            return;
        }

        const canvasCoords = screenToCanvas(screenX, screenY);
        const rawWidth = canvasCoords.x - startX;
        const rawHeight = canvasCoords.y - startY;
        const { width, height } = normalizeSize(rawWidth, rawHeight);


        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            rafId = null;

            if (shapeTypeRef.current === "pencil") {
                currentPencilPoints.push({
                    x: canvasCoords.x - startX,
                    y: canvasCoords.y - startY
                });
            }

            clearActiveLayer();
            activeCtx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
            activeCtx.strokeStyle = "#000000";
            activeCtx.lineWidth = 2 / scale;

            const activeShape: Shape = {
                type: shapeTypeRef.current,
                x: startX,
                y: startY,
                width,
                height,
                ...(shapeTypeRef.current === "pencil" ? { points: currentPencilPoints } : {})
            };

            drawShapeOn(activeCtx, activeShape);

            // Stream real-time drawing to other users (batched/throttled)
            const now = Date.now();
            if (now - lastStreamTime > STREAM_THROTTLE_MS) {
                lastStreamTime = now;
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "draw-stream",
                        roomSlug: slug,
                        message: activeShape
                    }));
                }
            }
        });
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // zoom factor
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 10);

        const scaleDiff = newScale - scale;
        offsetX -= (mouseX - offsetX) * (scaleDiff / scale);
        offsetY -= (mouseY - offsetY) * (scaleDiff / scale);

        scale = newScale;
        clearCanvas();
        debouncedSaveViewport();
    };

    const handleSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (data.type === "delete" && data.roomSlug === slug) {
            const deletedShape = JSON.stringify(data.message);
            const currentRoomState = useCanvasStore.getState().rooms[slug];
            const currentShapes = currentRoomState ? currentRoomState.shapes : [];
            const newShapes = currentShapes.filter(s => JSON.stringify(s) !== deletedShape);
            useCanvasStore.getState().setShapes(slug, newShapes);
            return;
        }

        if (data.type === "draw-stream" && data.roomSlug === slug) {

            if (!isClicked) {
                clearActiveLayer();
                activeCtx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
                activeCtx.strokeStyle = "#000000";
                activeCtx.lineWidth = 2 / scale;
                drawShapeOn(activeCtx, data.message);

                // Set a timeout to clear it if they stop streaming but haven't sent the committed 'chat' yet
                if (rafId !== null) cancelAnimationFrame(rafId);

            }
        }

        if (data.type === "chat" && data.roomSlug === slug) {
            clearActiveLayer(); // Clear any streamed active shapes when the final one arrives
            useCanvasStore.getState().addShape(slug, data.message);
            clearCanvas();
        }
    };

    const unsubZustand = useCanvasStore.subscribe((state, prevState) => {
        if (state.rooms[slug]?.shapes !== prevState.rooms[slug]?.shapes) {
            clearCanvas();
        }
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    if (socket) {
        socket.addEventListener("message", handleSocketMessage);
    }

    return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        unsubZustand();
        if (activeCanvas.parentElement) activeCanvas.parentElement.removeChild(activeCanvas);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("wheel", handleWheel);
        if (socket) {
            socket.removeEventListener("message", handleSocketMessage);
        }
    };
}
