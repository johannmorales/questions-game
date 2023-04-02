import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import * as dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

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
  questions: [
    {
      text: "Cual es la capital de peru?",
      options: [
        {
          isAnswer: true,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: false,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
    {
      text: "Cual es la capital de chile?",
      options: [
        {
          isAnswer: false,
          text: "Lima",
        },
        {
          isAnswer: false,
          text: "Caracas",
        },
        {
          isAnswer: false,
          text: "Jaen",
        },
        {
          isAnswer: true,
          text: "Santiago",
        },
      ],
    },
  ],
};

const app: Express = express();
const port = process.env.PORT;
const httpServer = createServer(app);

interface ServerToClientEvents {
  update: (state: State) => void;
}

interface ClientToServerEvents {
  selectOption: (optionIndex: number) => void;
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
    console.error("Wrong token", socket.request.headers.token);
    socket.disconnect();
  } else {
    console.log("New socket connection", socket.request.headers.origin);
  }
  next();
});

io.on("connection", (socket) => {
  io.to(socket.id).emit("update", state);
  socket.on("selectOption", (selectedIndex) => {
    state.selectedOption = selectedIndex;
    io.emit("update", state);
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
  socket.on("bonusSacrifice", () => {
    state.bonusSacrifice = !state.bonusSacrifice;
    io.emit("update", state);
  });
});

httpServer.listen(port, () => {
  console.log("Server started running on port", port);
});
