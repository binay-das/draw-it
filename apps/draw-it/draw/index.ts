import axios from "axios";
import { useCanvasStore } from "../store/canvasStore";

export type ShapeType = "rectangle" | "square" | "circle" | "line" | "arrow" | "text";

interface Shape {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
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
    socket: WebSocket,
    shapeTypeRef: { current: ShapeType },
    isEraserRef: { current: boolean }
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
            useCanvasStore.getState().setShapes(response.data.shapes);
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
            const currentShapes = [...useCanvasStore.getState().shapes];
            const shape = currentShapes[editingTextIndex];
            if (shape) {
                const newShape = { ...shape, text: text };
                currentShapes[editingTextIndex] = newShape;
                useCanvasStore.getState().setShapes(currentShapes);

                socket.send(JSON.stringify({
                    type: "chat",
                    roomSlug: slug,
                    message: newShape
                }));
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

            useCanvasStore.getState().addShape(textShape);
            socket.send(JSON.stringify({
                type: "chat",
                roomSlug: slug,
                message: textShape
            }));
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
        const currentShapes = useCanvasStore.getState().shapes;
        // erase the topmost drawn shape first
        for (let i = currentShapes.length - 1; i >= 0; i--) {
            const shape = currentShapes[i];
            if (!shape) continue;
            if (hitTestShape(shape, px, py)) {
                const newShapes = currentShapes.filter((_, idx) => idx !== i);
                useCanvasStore.getState().setShapes(newShapes);
                socket.send(JSON.stringify({
                    type: "delete",
                    roomSlug: slug,
                    message: shape
                }));
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
        useCanvasStore.getState().shapes.forEach(drawShape);
    }


    function clearActiveLayer() {
        activeCtx.setTransform(1, 0, 0, 1, 0, 0);
        activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    }


    let rafId: number | null = null;

    clearCanvas();

    const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        if (e.button === 1 || e.ctrlKey || e.metaKey) {
            isPanning = true;
            panStartX = screenX;
            panStartY = screenY;
            canvas.style.cursor = "grab";
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
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isPanning) {
            isPanning = false;
            canvas.style.cursor = isEraserRef.current ? "cell" : "default";
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
            height
        };

        useCanvasStore.getState().addShape(shape);
        clearCanvas();

        socket.send(JSON.stringify({
            type: "chat",
            roomSlug: slug,
            message: shape
        }));
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



            clearActiveLayer();
            activeCtx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
            activeCtx.strokeStyle = "#000000";
            activeCtx.lineWidth = 2 / scale;
            drawShapeOn(activeCtx, {
                type: shapeTypeRef.current,
                x: startX,
                y: startY,
                width,
                height
            });
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
            const currentShapes = useCanvasStore.getState().shapes;
            const newShapes = currentShapes.filter(s => JSON.stringify(s) !== deletedShape);
            useCanvasStore.getState().setShapes(newShapes);
            return;
        }

        if (data.type === "chat" && data.roomSlug === slug) {
            useCanvasStore.getState().addShape(data.message);
            clearCanvas();
        }
    };

    const unsubZustand = useCanvasStore.subscribe((state, prevState) => {
        if (state.shapes !== prevState.shapes) {
            clearCanvas();
        }
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    socket.addEventListener("message", handleSocketMessage);

    return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        unsubZustand();
        if (activeCanvas.parentElement) activeCanvas.parentElement.removeChild(activeCanvas);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("wheel", handleWheel);
        socket.removeEventListener("message", handleSocketMessage);
    };
}
