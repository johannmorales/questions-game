import { useSearchParams } from "react-router-dom";
import { Answer } from "../components/Answer";
import { Question } from "../components/Question";
import { Steps } from "../components/Steps";
import { useSocket } from "../hooks/useSocket";

import "./Game.css";

export const Game: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useSocket(searchParams.get("id")!);

  if (!state) {
    return null;
  }

  return (
    <div className="wrapper">
      <div className="hidden md:block pb-3">
        <Steps state={state} />
      </div>
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
