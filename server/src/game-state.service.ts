import tmi from "tmi.js";

type Questionaire = {
  content: string;
  options: [string, string, string, string];
  answerIndex: number;
}[];

export type GameState = {
  showQuestion: boolean;
  showOptionsUntil: number;
  answerIndex: undefined | number;
  questionContent: string;
  questionIndex: number;
  options: [string, string, string, string];
  questions: number;
  survey: number[];
  showSurvey: boolean;
};

let questionaire: Questionaire = [];

let gameState: GameState | null = {
  showQuestion: false,
  showOptionsUntil: 0,
  answerIndex: 0,
  questionContent: "1",
  questionIndex: 1,
  options: ["", "", "", ""],
  questions: 15,
  survey: [0, 0, 0, 0],
  showSurvey: false,
};

reset();

let surveyNames = new Map();

function reset() {
  gameState = {
    showQuestion: false,
    showOptionsUntil: 0,
    answerIndex: 0,
    questionContent: "1",
    questionIndex: 1,
    options: ["", "", "", ""],
    questions: 15,
    survey: [0, 0, 0, 0],
    showSurvey: false,
  };
}

export async function startSurvey(onVoteUpdate: (state: GameState) => void) {
  if (!gameState) {
    return;
  }
  const duration = Number.parseInt(process.env.SURVEY_SECONDS!);

  const surveyAnswer = new Map();

  gameState.survey = [0, 0, 0, 0];
  gameState.showSurvey = true;

  onVoteUpdate(gameState);

  const client = new tmi.Client({
    channels: [process.env.CHANNEL!],
  });

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    if (gameState && message.match(/^[a-d]/gi)) {
      const userId = tags["user-id"];
      const oldAnswer = surveyAnswer.get(userId);
      const answer =
        message.charAt(0).toUpperCase().charCodeAt(0) - "A".charCodeAt(0);

      if (oldAnswer !== answer) {
        const result = [...gameState.survey!];

        if (oldAnswer !== undefined) {
          result[oldAnswer]--;
        }

        surveyAnswer.set(userId, answer);
        result[answer]++;

        gameState.survey = result;
        onVoteUpdate(gameState!);
      }
    }
  });

  setTimeout(() => {
    client.disconnect();
  }, duration * 1000);
}

export function getGameState() {
  return JSON.parse(JSON.stringify(gameState)) as GameState;
}
