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

    

    
    const shapes: Shape[] = [];

    let isClicked = false;
    let startX = 0;
    let startY = 0;

    function clearCanvas() {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#000000";
        context.lineWidth = 2;

        shapes.forEach((shape) => {
            context.strokeRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height
            );
        });
    }

    clearCanvas();

    const onMouseDown = (e: MouseEvent) => {
        isClicked = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isClicked) return;
        isClicked = false;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const shape: Shape = {
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY
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
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isClicked) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        clearCanvas();

        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeRect(
            startX,
            startY,
            currentX - startX,
            currentY - startY
        );
    };

    const onSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (data.type === "chat" && data.roomSlug === slug) {
            shapes.push(data.message);
            clearCanvas();
        }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    socket.addEventListener("message", onSocketMessage);

    return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mousemove", onMouseMove);
        socket.removeEventListener("message", onSocketMessage);
    };
}
