export type State = {
  selectedOption?: number;
  questionIndex: number;
  showAnswer?: boolean;
  showQuestion: boolean;
  showOptionsUntil: number;
  questions: {
    text: string;
    options: {
      text: string;
      isAnswer?: boolean;
    }[];
  }[];
};
