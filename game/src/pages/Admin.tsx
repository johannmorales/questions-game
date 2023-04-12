import classNames from "classnames";
import { forwardRef, HTMLProps, ReactNode } from "react";
import { useGameState } from "../hooks";
import { callAction, getLetterFromIndex } from "../utils";

const Button = forwardRef<HTMLButtonElement, HTMLProps<HTMLButtonElement>>(
  (props, ref) => (
    <button
      {...props}
      type="button"
      ref={ref}
      className="disabled:bg-rose-400 w-full rounded-md bg-rose-600 py-6 text-2xl font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
    >
      {props.children}
    </button>
  )
);

const Option = forwardRef<
  HTMLButtonElement,
  { selected: boolean } & HTMLProps<HTMLButtonElement>
>((props, ref) => (
  <button
    {...props}
    type="button"
    ref={ref}
    className={classNames(
      "rounded-md px-3.5 py-2.5 text-2xl font-semibold text-white shadow-sm",
      "transition-colors duration-300",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
      "disabled:bg-rose-400",
      props.selected && "bg-rose-600 focus-visible:outline-rose-600",
      !props.selected && "bg-rose-500 focus-visible:outline-rose-500"
    )}
  >
    {props.children}
  </button>
));

export default () => {
  const { gameState } = useGameState();

  if (!gameState) {
    return (
      <>
        <Button onClick={() => callAction("restart")}>Restart</Button>
      </>
    );
  }

  const showOpenSurvey =
    gameState.questionIndex !== null &&
    !gameState.showSurvey &&
    !gameState.wheel.show;

  const showSurveyActions = gameState.showSurvey;

  const showOpenWheel =
    gameState.questionIndex !== null &&
    !gameState.wheel.show &&
    !gameState.showSurvey;

  const showWheelActions = gameState.wheel.show;

  const inMinigame = showSurveyActions || showWheelActions;

  const showStart = gameState.questionIndex === null;

  const showRevealQuestion =
    !inMinigame && !gameState.showQuestion && gameState.questionIndex !== null;

  const showRevealOption =
    !inMinigame && gameState.showQuestion && gameState.showOptionsUntil < 4;

  const showRevealAnswer =
    !inMinigame &&
    gameState.answerIndex === null &&
    gameState.showQuestion &&
    gameState.showOptionsUntil >= 4;

  const showNextQuestion =
    !inMinigame &&
    gameState.answerIndex !== null &&
    gameState.questionIndex !== null &&
    gameState.questionIndex + 1 !== gameState.questions;

  const showQuestion = !inMinigame && gameState.questionIndex !== null;

  const showRestart =
    !inMinigame &&
    gameState.answerIndex !== null &&
    gameState.questionIndex !== null &&
    gameState.questionIndex + 1 === gameState.questions;

  return (
    <div className="flex flex-col gap-4 h-full p-4 bg-rose-200">
      {showQuestion && (
        <>
          <div>
            <h2 className="font-medium text-xl text-gray-700 mb-2">
              Pregunta {gameState.questionIndex! + 1} de {gameState.questions}
            </h2>
            <h1 className="text-4xl text-gray-800">
              {gameState.questionContent}{" "}
              <span
                className={classNames(
                  gameState.showQuestion
                    ? "opacity-100 transition-opacity duration-300"
                    : "opacity-0"
                )}
              >
                ✅
              </span>
            </h1>
          </div>
          <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-4">
            {gameState.options?.map((option, index) => (
              <Option
                key={index}
                onClick={() => callAction("select-option", { index })}
                selected={index === gameState.selectedOptionIndex}
                disabled={
                  !(
                    gameState.showOptionsUntil >= 4 &&
                    gameState.showQuestion &&
                    gameState.answerIndex === null
                  )
                }
              >
                {getLetterFromIndex(index)}. {option}{" "}
                {gameState.adminAnswerIndex === index && "✅"}
              </Option>
            ))}
          </div>
        </>
      )}

      {showOpenSurvey && (
        <Button onClick={() => callAction("open-survey")}>
          Abrir Encuesta
        </Button>
      )}
      {showSurveyActions && (
        <>
          <div className="flex gap-4 w-full">
            <Button
              onClick={() => callAction("run-survey")}
              disabled={gameState.runningSurvey}
            >
              Empezar Encuesta!
            </Button>
            {gameState.runningSurvey && (
              <div className="bg-amber-500 flex items-center w-52 justify-center text-white text-2xl rounded-md">
                Corriendo...
              </div>
            )}
            {!gameState.runningSurvey && gameState.survey && (
              <div className="bg-green-600 flex items-center w-52 justify-center text-white text-2xl rounded-md">
                Listo!
              </div>
            )}
          </div>
          <Button onClick={() => callAction("close-survey")}>
            Cerrar Encuesta
          </Button>
          {gameState.survey && (
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {gameState.survey.map((amount, index) => (
                <div className="text-2xl font-semibold rounded-md p-6 bg-rose-500 text-white">
                  {getLetterFromIndex(index)}: {amount}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {showOpenWheel && (
        <Button onClick={() => callAction("open-wheel")}>Abrir Ruleta</Button>
      )}
      {showWheelActions && (
        <>
          <div className="flex gap-4 w-full">
            <Button onClick={() => callAction("run-wheel")}>
              Girar Ruleta
            </Button>
            <div className="bg-green-600 flex items-center w-28 justify-center text-white text-2xl rounded-md">
              {gameState.wheel.result}
            </div>
          </div>
          <Button onClick={() => callAction("close-wheel")}>
            Cerrar Ruleta
          </Button>
        </>
      )}
      {showStart && (
        <Button onClick={() => callAction("next-question")}>Iniciar!</Button>
      )}
      {showRevealQuestion && (
        <Button onClick={() => callAction("reveal-next")}>
          Mostrar Pregunta
        </Button>
      )}
      {showRevealOption && (
        <Button onClick={() => callAction("reveal-next")}>
          Mostrar Opción {getLetterFromIndex(gameState.showOptionsUntil)}
        </Button>
      )}
      {showRevealAnswer && (
        <Button
          onClick={() => callAction("reveal-answer")}
          disabled={gameState.selectedOptionIndex === null}
        >
          Mostrar Respuesta
        </Button>
      )}
      {showNextQuestion && (
        <Button
          onClick={() => callAction("next-question")}
          disabled={gameState.questionIndex! + 1 === gameState.questions}
        >
          Siguiente Pregunta
        </Button>
      )}

      {showRestart && (
        <Button onClick={() => callAction("restart")}>Reiniciar</Button>
      )}
    </div>
  );
};
