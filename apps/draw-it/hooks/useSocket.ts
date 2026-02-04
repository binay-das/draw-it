import { useEffect, useState } from "react";

export function useSocket() {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.error("NEXT_PUBLIC_WS_URL is not defined");
      return;
    }
    
    const ws = new WebSocket(wsUrl);
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
