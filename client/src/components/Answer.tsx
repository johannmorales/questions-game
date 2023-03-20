import clsasNames from "classnames";

const LETTERS = "ABCDEFGHI";

export const Answer: React.FC<{
  index: number;
  value: string;
  selected: boolean;
  showAnswer: boolean;
  revealed: boolean;
}> = ({ index, value, selected, showAnswer, revealed }) => {
  return (
    <div
      className={clsasNames(
        "answer",
        selected && !showAnswer && "answerSelected",
        showAnswer && "answerCorrect"
      )}
    >
      <span className="letter">· {LETTERS.at(index)}: </span>
      {revealed && value}
    </div>
  );
};
