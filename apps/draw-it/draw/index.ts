import axios from "axios";

export type ShapeType = "rectangle" | "square" | "circle" | "line";

interface Shape {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function initDraw(
    canvas: HTMLCanvasElement,
    slug: string,
    socket: WebSocket,
    shapeType: ShapeType = "rectangle"
) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const shapes: Shape[] = [];

    try {
        const response = await axios.get<{ shapes: Shape[] }>(`/api/shapes/${slug}`);
        if (response.data && response.data.shapes) {
            shapes.push(...response.data.shapes);
        }
    } catch (error) {
        console.error("Error fetching existing shapes:", error);
    }

    let isClicked = false;
    let startX = 0;
    let startY = 0;

    function normalizeSize(width: number, height: number) {
        if (shapeType === "square" || shapeType === "circle") {
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

        if (shape.type === "circle") {
            const radius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;

            context.beginPath();
            context.arc(cx, cy, radius, 0, Math.PI * 2);
            context.stroke();
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
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        shapes.forEach(drawShape);
    }

    clearCanvas();

    const handleMouseDown = (e: MouseEvent) => {
        isClicked = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!isClicked) return;
        isClicked = false;

        const rect = canvas.getBoundingClientRect();
        const rawWidth = e.clientX - rect.left - startX;
        const rawHeight = e.clientY - rect.top - startY;
        const { width, height } = normalizeSize(rawWidth, rawHeight);

        const shape: Shape = {
            type: shapeType,
            x: startX,
            y: startY,
            width,
            height
        };

        shapes.push(shape);
        clearCanvas();

        socket.send(JSON.stringify({
            type: "chat",
            roomSlug: slug,
            message: shape
        }));
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isClicked) return;

        const rect = canvas.getBoundingClientRect();
        const rawWidth = e.clientX - rect.left - startX;
        const rawHeight = e.clientY - rect.top - startY;

        const { width, height } = normalizeSize(rawWidth, rawHeight);

        clearCanvas();

        context.strokeStyle = "#000000";
        context.lineWidth = 2;

        drawShape({
            type: shapeType,
            x: startX,
            y: startY,
            width,
            height
        });
    };

    const handleSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (data.type === "chat" && data.roomSlug === slug) {
            shapes.push(data.message);
            clearCanvas();
        }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    socket.addEventListener("message", handleSocketMessage);

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
        socket.removeEventListener("message", handleSocketMessage);
    };
}
