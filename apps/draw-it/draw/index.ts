export async function initDraw(slug: string, canvas: HTMLCanvasElement, socket: WebSocket) {
  console.log(slug);
  console.log("init draw")
  
  const context = canvas.getContext("2d");
  if (!context) {
    console.log("no context");
    return () => { };
  }
  console.log("context: ", context);
  
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
