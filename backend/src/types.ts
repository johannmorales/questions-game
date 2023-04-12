export type GameState = {
  showQuestion: boolean;
  adminAnswerIndex: boolean;
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

export type Questionaire = {
  content: string;
  options: [string, string, string, string];
  answerIndex: number;
}[];

export enum Role {
  User = 'user',
  Admin = 'admin',
}
