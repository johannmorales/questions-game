import { Answer } from "../components/Answer";
import { Question } from "../components/Question";
import { useSocket } from "../hooks/useSocket";

import "./Game.css";

export const Game: React.FC = () => {
  const { state } = useSocket("asd");

  if (!state) {
    return null;
  }

  return (
    <div className="wrapper">
      <Question
        index={state.questionIndex}
        value={state.questions[state.questionIndex].text}
        revealed={state.showQuestion}
      />
      <div className="answers">
        {state.questions[state.questionIndex].options.map((item, index) => (
          <Answer
            key={index}
            index={index}
            value={item.text}
            selected={state.selectedOption === index}
            showAnswer={!!(state.showAnswer && item.isAnswer)}
            revealed={index < state.showOptionsUntil}
          />
        ))}
      </div>
    </div>
  );
};
