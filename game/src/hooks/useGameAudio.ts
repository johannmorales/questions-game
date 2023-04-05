import { createElement, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "../types";

import audio from "../assets/audio/01_Opening_2018.mp3";
import useSound from "use-sound";

export const useGameAUdio = () => {
  const [play, { stop }] = useSound(audio);
  useEffect(() => {
    let button = document.createElement("button");
    document.getElementById("root")?.appendChild(button);
    button.click();
    play();
    return () => {
      stop();
    };
  }, []);
};
