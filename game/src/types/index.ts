type GameState = {
  showQuestion: boolean;
  adminAnswerIndex: number;
  showOptionsUntil: number;
  answerIndex: null | number;
  questionContent: string | null;
  questionIndex: number | null;
  options: [string, string, string, string] | null;
  selectedOptionIndex: number | null;
  questions: number;
  survey?: number[];
  showSurvey: boolean;
  sound: number;
  wheel: {
    show: boolean;
    result: number | null;
  };
  runningSurvey: boolean;
};

export type { GameState };
