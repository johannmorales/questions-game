export type GameState = {
  showQuestion: boolean;
  showOptionsUntil: number;
  answerIndex: undefined | number;
  questionContent: string;
  questionIndex: number;
  options: [string, string, string, string];
  selectedOptionIndex: number | null;
  questions: number;
  survey?: number[];
  showSurvey: boolean;
  sound: number;
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
