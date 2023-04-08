import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Answer, Question, Steps, Survey } from "./components";
import { FortuneWheel } from "./components/FortuneWheel/FortuneWheel";
import { useGameState, useGameState2, useWebSocket } from "./hooks";
import { callAction } from "./utils";

function App() {
  const { gameState } = useGameState();

  console.log("game", gameState);
  if (!gameState || gameState.questionIndex === null) {
    return (
      <>
        <button onClick={() => callAction("restart")}>Restart</button>
        <button onClick={() => callAction("next-question")}>
          nextQuestion
        </button>
      </>
    );
  }

  return (
    <div className="h-full w-full relative bg-red-400 flex flex-col p-2 items-stretch">
      {!gameState.showSurvey && !gameState.wheel.show && (
        <>
          <button onClick={() => callAction("restart")}>Restart</button>
          <button onClick={() => callAction("next-question")}>
            nextQuestion
          </button>
          <button onClick={() => callAction("select-option", { index: 0 })}>
            select option A
          </button>
          <button onClick={() => callAction("select-option", { index: 1 })}>
            select option B
          </button>
          <button onClick={() => callAction("select-option", { index: 2 })}>
            select option C
          </button>
          <button onClick={() => callAction("select-option", { index: 3 })}>
            select option D
          </button>
          <button onClick={() => callAction("reveal-answer")}>
            reveal answer
          </button>
          <button onClick={() => callAction("open-survey")}>open-survey</button>
          <button onClick={() => callAction("open-wheel")}>open-wheel</button>
        </>
      )}

      {gameState.showSurvey && (
        <>
          <button onClick={() => callAction("run-survey")}>run-survey</button>
          <button onClick={() => callAction("close-survey")}>
            close-survey
          </button>
        </>
      )}

      {gameState.wheel.show && (
        <>
          <button onClick={() => callAction("run-wheel")}>run-wheel</button>
          <button onClick={() => callAction("close-wheel")}>close-wheel</button>
        </>
      )}
      <div className="grow flex justify-center items-center">
        <div className={classNames(!gameState.wheel.show && "hidden")}>
          <FortuneWheel result={gameState.wheel.result} />
        </div>
        <div
          className={classNames(
            "transition-opacity duration-500",
            gameState.showSurvey && "opacity-100",
            !gameState.showSurvey && "opacity-0"
          )}
        >
          <Survey data={gameState.survey} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
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
          {gameState.options.map((option, index) => (
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
