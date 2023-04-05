import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "../types";

export const useGameState = () => {
  const token = new URLSearchParams(document.location.search).get("token");
  const [gameState, setState] = useState<GameState | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let _socket: null | Socket = null;

    // if (token) {
    //   _socket = io(import.meta.env.VITE_BACKEND_URL, {
    //     extraHeaders: {
    //       token,
    //     },
    //   });

    //   function onUpdate(newState: GameState) {
    //     setState(newState);
    //   }

    //   _socket.on("update2", onUpdate);
    // }

    setSocket(_socket);

    return () => {
      if (_socket) {
        _socket.disconnect();
        _socket.off("update");
      }
      setSocket(null);
    };
  }, [token, import.meta.env.VITE_BACKEND_URL]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/game-state`,
      {}
    );
    eventSource.onmessage = (e) => setState(JSON.parse(e.data));
    return () => {
      eventSource.close();
    };
  }, []);

  return {
    socket,
    gameState,
  };
};
