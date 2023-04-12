import { useEffect, useRef, useState, MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "../types";

import audioSourceQuestionStart from "../assets/audio/q02/15_Lights_To_Centre_2000.mp3";
import audioSourceQuestion from "../assets/audio/q02/16_2000_Question.mp3";
import audioSourceCorrect from "../assets/audio/_edited/correct.mp3";
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
  ref.current.volume = 0.5;
  ref.current.loop = loop;
  ref.current.play();
}

export const useGameState = () => {
  const token = new URLSearchParams(document.location.search).get("token");
  const [gameState, setState] = useState<GameState | null>(null);
  const socket = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let _socket: null | Socket = null;

    if (token) {
      _socket = io(import.meta.env.VITE_BACKEND_URL, {
        extraHeaders: {
          Authorization: token,
        },
        reconnection: false,
      });

      function onGameStateUpdate(newState: GameState) {
        setState(newState);
      }

      _socket.on("GameStateUpdate", onGameStateUpdate);

      _socket.on("QuestionStart", () => {
        updateAudioRef(audioRef, audioSourceQuestionStart, false);
      });

      _socket.on("WaitingAnswer", () => {
        updateAudioRef(audioRef, audioSourceQuestion, true);
      });

      _socket.on("OptionChosen", () => {
        updateAudioRef(audioRef, audioSourceFinalAnswer, true);
      });

      _socket.on("RevealAnswer", (correct: boolean) => {
        if (correct) {
          updateAudioRef(audioRef, audioSourceCorrect, false);
        } else {
          updateAudioRef(audioRef, audioSourceWrong, false);
        }
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
  }, []);

  return {
    socket: socket.current,
    gameState,
  };
};
