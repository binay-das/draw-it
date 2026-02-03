import axios from "axios";

interface Shape {
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function initDraw(
    canvas: HTMLCanvasElement,
    slug: string,
    socket: WebSocket
) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const shapeType: "rectangle" | "square" | "circle" | "line" = "line";

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
        if (shapeType === "line") {
            context.beginPath();
            context.moveTo(shape.x, shape.y);
            context.lineTo(
                shape.x + shape.width,
                shape.y + shape.height
            );
            context.stroke();
            return;
        }

        if (shapeType === "circle") {
            const radius = Math.min(
                Math.abs(shape.width),
                Math.abs(shape.height)
            ) / 2;

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

    canvas.addEventListener("mousedown", (e) => {
        isClicked = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseup", (e) => {
        if (!isClicked) return;
        isClicked = false;

        const rect = canvas.getBoundingClientRect();
        const rawWidth = e.clientX - rect.left - startX;
        const rawHeight = e.clientY - rect.top - startY;

        const { width, height } = normalizeSize(rawWidth, rawHeight);

        const shape: Shape = {
            x: startX,
            y: startY,
            width,
            height
        };

        shapes.push(shape);
        clearCanvas();

        socket.send(
            JSON.stringify({
                type: "chat",
                roomSlug: slug,
                message: shape
            })
        );
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isClicked) return;

        const rect = canvas.getBoundingClientRect();
        const rawWidth = e.clientX - rect.left - startX;
        const rawHeight = e.clientY - rect.top - startY;

        const { width, height } = normalizeSize(rawWidth, rawHeight);

        clearCanvas();

        context.strokeStyle = "#000000";
        context.lineWidth = 2;

        drawShape({
            x: startX,
            y: startY,
            width,
            height
        });
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "chat" && data.roomSlug === slug) {
            shapes.push(data.message);
            clearCanvas();
        }
    });

    return () => {
        canvas.replaceWith(canvas.cloneNode(true));
        socket.onmessage = null;
    };
}
