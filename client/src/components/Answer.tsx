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
        "answer drop-shadow-2xl",
        selected && !showAnswer && "answerSelected",
        showAnswer && "answerCorrect"
      )}
    >
      <div
        className={clsasNames(
          "transition-opacity duration-50",
          revealed && "opacity-100",
          !revealed && "opacity-0"
        )}
      >
        <span className="letter">
          <span className="hidden md:inline-block">·</span> {LETTERS.at(index)}:{" "}
        </span>
        <span className="drop-shadow-lg">{value}</span>
      </div>
    </div>
  );
};
