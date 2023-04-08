import { useEffect, useRef, useState, MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { GameState } from "../types";

export const useGameState2 = (socket: Socket | null) => {
  const [gameState, setState] = useState<GameState | null>(null);
  useEffect(() => {
    console.log("socket", socket);
    if (socket) {
      function onUpdate(newState: GameState) {
        setState(newState);
      }
      socket.on("gameStateUpdate", onUpdate);
      socket.on("error", () => {
        socket.off("gameStateUpdate", onUpdate);
      });
    }
  }, [socket]);

  return gameState;
};
