type GameState = {
  showQuestion: boolean;
  showOptionsUntil: boolean;
  answerIndex: undefined | number;
  questionContent: string;
  questionIndex: number;
  options: [string, string, string, string];
  questions: number;
  survey?: number[];
  showSurvey: boolean;
  sound: number;
};

export type { GameState };
