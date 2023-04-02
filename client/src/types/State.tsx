export type State = {
  selectedOption: undefined | number;
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
