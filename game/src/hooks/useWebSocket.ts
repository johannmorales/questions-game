import { useEffect, useRef, MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";

export const useWebSocket = (debug = false) => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    let _socket: null | Socket = null;
    const token = new URLSearchParams(document.location.search).get("token");
    const host = import.meta.env.VITE_BACKEND_URL;
    if (debug) {
      console.log("Connecting to WS", host, "with token", token);
    }
    if (token) {
      _socket = io(host, {
        extraHeaders: {
          token,
        },
      });
    }

    socket.current = _socket;

    return () => {
      if (_socket) {
        _socket.disconnect();
      }
      socket.current = null;
    };
  }, []);

  return socket.current;
};
