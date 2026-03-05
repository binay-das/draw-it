import { useEffect, useRef, useState } from "react";

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(0);
  const intentionalCloseRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      setError("WebSocket URL is not configured.");
      return;
    }

    function connect() {
      const ws = new WebSocket(wsUrl as string);

      ws.onopen = () => {
        retryCountRef.current = 0;
        setRetryCount(0);
        setError(null);
        setSocket(ws);
      };

      ws.onclose = (event) => {
        setSocket(null);

        // Intentional close from auth failure or server rejection — do not retry
        if (intentionalCloseRef.current || event.code === 1008) {
          setError("Connection rejected by server.");
          return;
        }

        const nextRetry = retryCountRef.current + 1;
        if (nextRetry > MAX_RETRIES) {
          setError("Unable to connect after several attempts. Please reload the page.");
          return;
        }

        retryCountRef.current = nextRetry;
        setRetryCount(nextRetry);

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = BASE_DELAY_MS * Math.pow(2, nextRetry - 1);
        timeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        // onclose fires after onerror — retry logic is handled there
      };

      return ws;
    }

    const ws = connect();

    return () => {
      intentionalCloseRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ws?.close();
    };
  }, []);

  return { socket, error, retryCount };
}
