import { Answer } from "../components/Answer";
import { Question } from "../components/Question";
import { Steps } from "../components/Steps";
import { useSocket } from "../hooks/useSocket";

import "./Game.css";
import { Bonus } from "../components/Bonus";

export const Game: React.FC = () => {
  const { state } = useSocket();

  if (!state) {
    return null;
  }

  return (
    <div>
      <div className=" flex flex-col top-0 right-0 fixed p-1 md:p-4 gap-1 md:gap-3">
        <div className="flex flex-col md:flex-row gap-4 hidden">
          <Bonus available={state.bonus5050}>
            <span className="text-2xl text-white font-black">🌗</span>
          </Bonus>
          <Bonus available={state.bonusSacrifice}>
            <span className="text-2xl">💀</span>
          </Bonus>
          <Bonus available={state.bonusCall}>
            <span className="text-2xl">📞</span>
          </Bonus>
        </div>
      </div>
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
    </div>
  );
};
