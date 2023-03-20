import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { State } from "../types";

export const useSocket = (token: string) => {
  const [state, setState] = useState<State | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://192.168.100.8:3000", {
      extraHeaders: {
        token,
      },
    });

    function onUpdate(newState: State) {
      setState(newState);
    }

    newSocket.on("update", onUpdate);
    setSocket(newSocket);
    return () => {
      console.log("disconnecetig");
      newSocket.disconnect();
      newSocket.off("update", onUpdate);
      setSocket(null);
    };
  }, [token]);

  return {
    socket,
    state,
  };
};
