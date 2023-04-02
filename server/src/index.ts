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
      text: "¿Cuál es la capital de Perú?",
      options: [
        {
          isAnswer: false,
          text: "Arequipa",
        },
        {
          isAnswer: false,
          text: "Cuzco",
        },
        {
          isAnswer: false,
          text: "San Juan de Miraflores",
        },
        {
          isAnswer: true,
          text: "Lima",
        },
      ],
    },
    {
      text: "¿Qué año se lanzó el videojuego llamado League of Legends?",
      options: [
        {
          isAnswer: false,
          text: "2008",
        },
        {
          isAnswer: true,
          text: "2009",
        },
        {
          isAnswer: false,
          text: "2010",
        },
        {
          isAnswer: false,
          text: "2011",
        },
      ],
    },
    {
      text: "¿Según el lore del famosísimo Don WuaWuas, ¿Con cuántas femeninas ha flirteado en lo que va del año?",
      options: [
        {
          isAnswer: false,
          text: "Ninguna",
        },
        {
          isAnswer: false,
          text: "2",
        },
        {
          isAnswer: false,
          text: "4",
        },
        {
          isAnswer: true,
          text: "5",
        },
      ],
    },
    {
      text: "¿Cuál es la lengua oficial en china?",
      options: [
        {
          isAnswer: false,
          text: "Cantonés",
        },
        {
          isAnswer: false,
          text: "Chino",
        },
        {
          isAnswer: true,
          text: "Mandarín",
        },
        {
          isAnswer: false,
          text: "Xiāng",
        },
      ],
    },
    {
      text: "Según el lore de League of legends, ¿Quién es el padre de Kai'sa?",
      options: [
        {
          isAnswer: true,
          text: "Kassadin",
        },
        {
          isAnswer: false,
          text: "Malzahar",
        },
        {
          isAnswer: false,
          text: "Vel'Koz",
        },
        {
          isAnswer: false,
          text: "Ryze",
        },
      ],
    },
    {
      text: `Existe un animal llamado vulgarmente "el animal más inútil del mundo", ¿cuál es?`,
      options: [
        {
          isAnswer: false,
          text: "Vaquita Marina",
        },
        {
          isAnswer: false,
          text: "Pez dragón",
        },
        {
          isAnswer: true,
          text: "Pez luna",
        },
        {
          isAnswer: false,
          text: "Pez gota",
        },
      ],
    },
    {
      text: `¿En qué año se produjo la Revolución Francesa?`,
      options: [
        {
          isAnswer: true,
          text: "1789",
        },
        {
          isAnswer: false,
          text: "1879",
        },
        {
          isAnswer: false,
          text: "1897",
        },
        {
          isAnswer: false,
          text: "1978",
        },
      ],
    },
    {
      text: `¿Cuál es el videojuego más vendido en la historia?`,
      options: [
        {
          isAnswer: false,
          text: "GTA V",
        },
        {
          isAnswer: false,
          text: "Tetris",
        },
        {
          isAnswer: false,
          text: "Super Mario Bros",
        },
        {
          isAnswer: true,
          text: "Minecraft",
        },
      ],
    },
    {
      text: `Según los acertados y muy útiles datos que he dado ¿cuál es el órgano qué más consume energía?`,
      options: [
        {
          isAnswer: false,
          text: "Corazón",
        },
        {
          isAnswer: false,
          text: "Pulmones",
        },
        {
          isAnswer: true,
          text: "Cerebro",
        },
        {
          isAnswer: false,
          text: "Hígado",
        },
      ],
    },
    {
      text: `¿Quién inventó la bombilla?`,
      options: [
        {
          isAnswer: false,
          text: "CummingReal",
        },
        {
          isAnswer: true,
          text: "Thomas Edison",
        },
        {
          isAnswer: false,
          text: "Isaac Newton",
        },
        {
          isAnswer: false,
          text: "Alexander Fleming",
        },
      ],
    },
    {
      text: `¿Cómo se llamaba el personaje que trabajaba en la tienda de neumáticos de Radiador Springs y además era el mejor amigo de Luigi?`,
      options: [
        {
          isAnswer: false,
          text: "Sally",
        },
        {
          isAnswer: false,
          text: "Fillmore",
        },
        {
          isAnswer: false,
          text: "Ramón",
        },
        {
          isAnswer: true,
          text: "Guido",
        },
      ],
    },
    {
      text: `¿Cuál de estos dinosaurios es carnívoro?`,
      options: [
        {
          isAnswer: false,
          text: "Estegosaurio",
        },
        {
          isAnswer: false,
          text: "Brontosaurus",
        },
        {
          isAnswer: false,
          text: "Protoceratops",
        },
        {
          isAnswer: true,
          text: "Alosaurio",
        },
      ],
    },
    {
      text: `¿En que año se lanzó la Nintendo Switch?`,
      options: [
        {
          isAnswer: false,
          text: "2016",
        },
        {
          isAnswer: false,
          text: "2017",
        },
        {
          isAnswer: false,
          text: "2018",
        },
        {
          isAnswer: true,
          text: "2019",
        },
      ],
    },
    {
      text: `¿En qué año se independizó Panamá de España?`,
      options: [
        {
          isAnswer: true,
          text: "1821",
        },
        {
          isAnswer: false,
          text: "1903",
        },
        {
          isAnswer: false,
          text: "1904",
        },
        {
          isAnswer: false,
          text: "1909",
        },
      ],
    },
    {
      text: `¿Qué videojuego se diseñó principalmente para tratar la depresión?`,
      options: [
        {
          isAnswer: false,
          text: "Smilez",
        },
        {
          isAnswer: true,
          text: "Sparx",
        },
        {
          isAnswer: false,
          text: "Alegría",
        },
        {
          isAnswer: false,
          text: "Therapex",
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
