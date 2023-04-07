import { useEffect, useRef, useState, MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "../types";

import audioSourceQuestionStart from "../assets/audio/q02/15_Lights_To_Centre_2000.mp3";
import audioSourceQuestion from "../assets/audio/q02/16_2000_Question.mp3";
import audioSourceCorrect from "../assets/audio/q02/18_2000_Correct.mp3";
import audioSourceWrong from "../assets/audio/q02/19_2000_Wrong.mp3";
import audioSourceFinalAnswer from "../assets/audio/q02/17_2000_Final_Answer.mp3";

function updateAudioRef(
  ref: MutableRefObject<HTMLAudioElement | null>,
  audioSource: string,
  loop: boolean
) {
  if (ref.current) {
    ref.current.pause();
  }
  const audio = new Audio(audioSource);
  ref.current = audio;
  ref.current.loop = loop;
  ref.current.play;
}

export const useGameState = () => {
  const token = new URLSearchParams(document.location.search).get("token");
  const [gameState, setState] = useState<GameState | null>(null);
  const socket = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let _socket: null | Socket = null;

    if (token) {
      console.log("connecting with socket", token);
      _socket = io(import.meta.env.VITE_BACKEND_URL, {
        extraHeaders: {
          token,
        },
      });

      function onUpdate(newState: GameState) {
        setState(newState);
      }

      _socket.on("update2", onUpdate);

      _socket.on("wrongAnswer", () => {
        updateAudioRef(audioRef, audioSourceWrong, false);
      });

      _socket.on("correctAnswer", () => {
        updateAudioRef(audioRef, audioSourceCorrect, false);
      });

      _socket.on("connect", () => {
        console.log("Connected");
      });

      _socket.on("error", () => {
        console.log("error");
      });
    }

    socket.current = _socket;

    return () => {
      if (_socket) {
        _socket.disconnect();
        _socket.off("update");
      }
      socket.current = null;
    };
  }, [token, import.meta.env.VITE_BACKEND_URL]);

  return {
    socket: socket.current,
    gameState,
  };
};
