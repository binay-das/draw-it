import { useEffect, useState } from "react";

export function useSocket() {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    console.log("trying to connect to WebSocket");

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    }

    ws.onclose = () => {
      setLoading(true);
      setSocket(null);
    }
  }, []);

  return { loading, socket };
}
