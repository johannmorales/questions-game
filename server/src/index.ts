import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { GameState, getGameState, startSurvey } from "./game-state.service";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ override: true });
}

export type State = {
  selectedOption?: number;
  questionIndex: number;
  showAnswer?: boolean;
  showQuestion: boolean;
  showOptionsUntil: number;
  bonus5050: boolean;
  bonusCall: boolean;
  bonusSacrifice: boolean;
  questions: {
    text: string;
    options: {
      text: string;
      isAnswer?: boolean;
    }[];
  }[];
};

const state: State = {
  questionIndex: 0,
  selectedOption: undefined,
  showAnswer: false,
  showQuestion: false,
  showOptionsUntil: 0,
  bonus5050: true,
  bonusCall: true,
  bonusSacrifice: true,
  questions: [],
};

const app: Express = express();
const port = process.env.PORT;
const httpServer = createServer(app);

interface ServerToClientEvents {
  update: (state: State) => void;
  update2: (state: GameState) => void;
}

interface ClientToServerEvents {
  selectOption: (optionIndex: number) => boolean;
  reset: () => void;
  showAnswer: () => void;
  next: () => void;
  previous: () => void;
  bonusCall: () => void;
  bonusSacrifice: () => void;
  bonus5050: () => void;
}

interface InterServerEvents {}

interface SocketData {}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// security middleware
io.use((socket, next) => {
  if (socket.request.headers.token !== process.env.TOKEN) {
    socket.disconnect();
  }
  next();
});

io.on("connection", (socket) => {
  io.to(socket.id).emit("update2", getGameState());
  socket.on("selectOption", (selectedIndex) => {
    state.selectedOption = selectedIndex;
    io.emit("update", state);
    return true;
  });
  socket.on("showAnswer", () => {
    state.showAnswer = true;
    io.emit("update", state);
  });
  socket.on("next", () => {
    if (!state.showQuestion) {
      state.showQuestion = true;
    } else if (state.showOptionsUntil < 4) {
      state.showOptionsUntil += 1;
    } else if (state.questionIndex + 1 < state.questions.length) {
      state.questionIndex += 1;
      state.selectedOption = undefined;
      state.showAnswer = false;
      state.showQuestion = false;
      state.showOptionsUntil = 0;
    }
    io.emit("update", state);
  });
  socket.on("previous", () => {
    if (state.showAnswer) {
      state.showAnswer = false;
    } else if (state.selectedOption !== undefined) {
      state.selectedOption = undefined;
    } else if (state.showOptionsUntil > 0) {
      state.showOptionsUntil -= 1;
    } else if (state.showQuestion) {
      state.showQuestion = false;
    } else if (state.questionIndex > 0) {
      state.questionIndex -= 1;
    }
    io.emit("update", state);
  });
  socket.on("reset", () => {
    state.questionIndex = 0;
    state.selectedOption = undefined;
    state.showAnswer = false;
    state.showQuestion = false;
    state.showOptionsUntil = 0;
    io.emit("update", state);
  });
  socket.on("bonus5050", () => {
    state.bonus5050 = !state.bonus5050;
    io.emit("update", state);
  });
  socket.on("bonusCall", () => {
    state.bonusCall = !state.bonusCall;
    io.emit("update", state);
  });
});

startSurvey((state) => {
  io.emit("update2", state);
});

app.get("/game-status", () => {
  setInterval(() => {}, 1000);
});
httpServer.listen(port, () => {
  console.log("Server started running on port", port);
});
