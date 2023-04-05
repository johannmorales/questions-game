type IQuestion = {
  id?: number;
  text: string;
  options: string[];
  answerIndex: number;
};

type IQuestionaire = {
  id?: number;
  questions: IQuestion[];
  token?: string;
};

type GameState = {
  answers: { [k: number]: number };
  startedAt: Date;
};

export { IQuestion };
