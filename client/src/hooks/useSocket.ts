import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { State } from "../types";
import { useSearchParams } from "react-router-dom";

export const useSocket = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<State | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const newSocket = token
      ? io(import.meta.env.VITE_BACKEND_URL, {
          extraHeaders: {
            token,
          },
        })
      : null;

    function onUpdate(newState: State) {
      setState(newState);
    }

    if (newSocket) {
      newSocket.on("update", onUpdate);
    }

    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        newSocket.off("update", onUpdate);
      }
      setSocket(null);
    };
  }, [searchParams]);

  return {
    socket,
    state,
  };
};
