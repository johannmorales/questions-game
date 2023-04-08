type GameState = {
  showQuestion: boolean;
  showOptionsUntil: number;
  answerIndex: undefined | number;
  questionContent: string;
  questionIndex: number | null;
  options: [string, string, string, string];
  selectedOptionIndex: number | null;
  questions: number;
  survey?: number[];
  showSurvey: boolean;
  sound: number;
  wheel: {
    show: boolean;
    result: number | null;
  };
};

export type { GameState };
