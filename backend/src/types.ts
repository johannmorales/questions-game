export type GameState = {
  showQuestion: boolean;
  showOptionsUntil: number;
  answerIndex: undefined | number;
  questionContent: string;
  questionIndex: number;
  options: [string, string, string, string];
  questions: number;
  survey?: number[];
  showSurvey: boolean;
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
