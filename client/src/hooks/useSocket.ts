import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { State } from "../types";

export const useSocket = (token: string) => {
  const [state, setState] = useState<State | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = token
      ? io(import.meta.env.BACKEND_URL, {
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
  }, [token]);

  return {
    socket,
    state,
  };
};
