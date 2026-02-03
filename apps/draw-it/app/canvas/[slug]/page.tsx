"use client";

import { use, useEffect, useRef, useState } from "react";
import { initDraw } from "../../../draw";
import { useSocket } from "../../../hooks/useSocket";

export default function Canvas({
  params,
  messages = []
}: {
  params: Promise<{ slug: string }>;
  messages?: { message: string }[];
}) {
  const { slug } = use(params);
  const { socket, loading } = useSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chats, setChats] = useState<{ message: string }[]>(messages);
  const [currentMsg, setCurrentMsg] = useState<string>("");

  useEffect(() => {
    console.log("slug sent from console: ", slug);
    const canvas = canvasRef.current;
    if (canvas && socket) {
      initDraw(slug, canvas, socket);
    }

    if (slug && socket) {
      socket.send(
        JSON.stringify({
          type: "join",
          roomSlug: slug,
        }),
      );

      console.log("requeted to join room: ", slug);
    }
  }, [slug, socket]);

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && slug && currentMsg?.trim()) {
      socket.send(JSON.stringify({
        type: "chat",
        roomSlug: slug,
        message: currentMsg.trim()
      }))

      setCurrentMsg("");
    }
  }

 useEffect(() => {
  if (!socket) return;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("received:", data);

    if (data.type === "chat") {
      setChats(prev => [...prev, { message: data.message }]);
    }
  };

  return () => {
    socket.onmessage = null;
  };
}, [socket]);


  if (!socket) return <div className="w-full h-screen">Loading…</div>;

  return (
    <div className="">
      <div id="test-messages">
      {
        chats && chats.map((c, i) => (
        <p key={i}>{c.message}</p>
      ))}


      </div>
        <form onSubmit={sendMsg} className="p-2 flex gap-2">
          <input type="text" value={currentMsg} onChange={(e) => setCurrentMsg(e.target.value)} className="border px-2 flex-1"
            placeholder="Type message..."></input>
          <button type="submit">Send</button>
          
        </form>
        Canvas Page Socket Loaded
      <canvas ref={canvasRef} id="canvas" className="w-full h-full" />
    </div>
  );
}
