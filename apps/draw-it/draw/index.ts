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
    shapeTypeRef: { current: ShapeType }
) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

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

    function drawShape(shape: Shape) {
        if (shape.type === "line") {
            context.beginPath();
            context.moveTo(shape.x, shape.y);
            context.lineTo(shape.x + shape.width, shape.y + shape.height);
            context.stroke();
            return;
        }

        if (shape.type === "arrow") {
            const startX = shape.x;
            const startY = shape.y;
            const endX = shape.x + shape.width;
            const endY = shape.y + shape.height;

            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();

            const angle = Math.atan2(endY - startY, endX - startX);
            const headLength = 15 / scale;
            const headAngle = Math.PI / 6;

            context.beginPath();
            context.moveTo(endX, endY);
            context.lineTo(
                endX - headLength * Math.cos(angle - headAngle),
                endY - headLength * Math.sin(angle - headAngle)
            );
            context.moveTo(endX, endY);
            context.lineTo(
                endX - headLength * Math.cos(angle + headAngle),
                endY - headLength * Math.sin(angle + headAngle)
            );
            context.stroke();
            return;
        }

        if (shape.type === "circle") {
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;

            context.beginPath();
            context.arc(cx, cy, radius, 0, Math.PI * 2);
            context.stroke();
            return;
        }

        if (shape.type === "text" && shape.text) {
            const fontSize = 16 / scale;
            context.font = `${fontSize}px Arial`;
            context.fillStyle = "#000000";
            context.fillText(shape.text, shape.x, shape.y);
            return;
        }

        context.strokeRect(
            shape.x,
            shape.y,
            shape.width,
            shape.height
        );
    }

    function clearCanvas() {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.setTransform(scale, 0, 0, scale, offsetX, offsetY);

        context.strokeStyle = "#000000";
        context.lineWidth = 2 / scale;
        useCanvasStore.getState().shapes.forEach(drawShape);
    }

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
            canvas.style.cursor = "default";
            return;
        }

        if (!isClicked) return;
        isClicked = false;

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
            clearCanvas();
            debouncedSaveViewport();
            return;
        }

        if (!isClicked) return;

        const canvasCoords = screenToCanvas(screenX, screenY);
        const rawWidth = canvasCoords.x - startX;
        const rawHeight = canvasCoords.y - startY;

        const { width, height } = normalizeSize(rawWidth, rawHeight);

        clearCanvas();

        context.strokeStyle = "#000000";
        context.lineWidth = 2 / scale;

        drawShape({
            type: shapeTypeRef.current,
            x: startX,
            y: startY,
            width,
            height
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
        unsubZustand();
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("wheel", handleWheel);
        socket.removeEventListener("message", handleSocketMessage);
    };
}
