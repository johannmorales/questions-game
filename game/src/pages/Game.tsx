import classNames from "classnames";
import { Answer, Question, Steps, Survey } from "../components";
import { FortuneWheel } from "../components";
import { useGameState } from "../hooks";

function App() {
  const { gameState } = useGameState();

  if (!gameState || gameState.questionIndex === null) {
    return null;
  }

  return (
    <div className="h-full w-full relative bg-rose-400 before:z-10 flex flex-col p-2 items-stretch">
      <div className="grow flex justify-center items-center z-10 relative">
        <div
          className={classNames(
            "absolute",
            "transition-opacity duration-300 ease-linear",
            !gameState.wheel.show && "opacity-0",
            gameState.wheel.show && "opacity-100"
          )}
        >
          <FortuneWheel result={gameState.wheel.result} />
        </div>
        <div
          className={classNames(
            "absolute",
            "transition-opacity duration-500",
            gameState.showSurvey && "opacity-100",
            !gameState.showSurvey && "opacity-0"
          )}
        >
          {<Survey data={gameState.survey} />}
        </div>
      </div>
      <div className="flex flex-col gap-2 z-10">
        <div className="px-10">
          <Steps
            amount={gameState.questions}
            current={gameState.questionIndex}
          />
        </div>
        <Question hidden={!gameState.showQuestion}>
          {gameState.questionContent}
        </Question>
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
          {gameState.options?.map((option, index) => (
            <Answer
              key={index}
              index={index}
              isSelected={index === gameState.selectedOptionIndex}
              isAnswer={index === gameState.answerIndex}
              hidden={gameState.showOptionsUntil <= index}
            >
              {option}
            </Answer>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
