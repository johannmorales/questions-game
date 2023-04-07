import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Answer, Question, Steps, Survey } from "./components";
import { useGameState } from "./hooks";

function App() {
  const [current, setCurrent] = useState(0);
  const inputRef = useRef(null);
  const { gameState } = useGameState();

  console.log("useGameState", gameState);
  if (!gameState) {
    return null;
  }

  return (
    <div className="h-full w-full relative bg-red-400 flex flex-col p-2 items-stretch">
      <button ref={inputRef}>asd</button>
      <div className="grow flex justify-center items-center">
        <div
          className={classNames(
            "transition-opacity duration-500",
            gameState.showSurvey && "opacity-100",
            !gameState.showSurvey && "opacity-0"
          )}
        >
          <Survey data={gameState.survey!} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="px-10">
          <Steps amount={20} current={current} />
        </div>
        <Question hidden={false}>asd</Question>
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
          <Answer isAnswer={false} index={0}>
            As
          </Answer>
          <Answer isAnswer={true} index={1}>
            Bs
          </Answer>
          <Answer isAnswer={false} index={2}>
            Cs
          </Answer>
          <Answer isAnswer={false} isSelected index={3}>
            Ds
          </Answer>
        </div>
      </div>
    </div>
  );
}

export default App;
