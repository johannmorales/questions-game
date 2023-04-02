import { ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import classNames from "classnames";

const LETTERS = "ABCD";

const QuestionButton: React.FC<{
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  selected: boolean;
}> = ({ onClick, children, disabled, selected }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "rounded-md px-3.5 py-2.5 text-2xl font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ",
        selected && "bg-amber-600 hover:bg-amber-500",
        !selected &&
          "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600",
        "transition-colors disabled:bg-gray-400"
      )}
    >
      {children}
    </button>
  );
};

export const Admin: React.FC = () => {
  const { socket, state } = useSocket();

  if (!state || !socket) {
    return null;
  }

  const allShown = state.showQuestion && state.showOptionsUntil === 4;

  return (
    <div className="w-full flex flex-col gap-3 p-3 bg-gray-100 h-screen justify-between">
      <div className="w-full flex gap-4 flex-row hidden">
        <button
          className={classNames(
            "flex-grow rounded-md px-3.5 py-5 text-2xl font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            !state.bonus5050 &&
              "bg-gray-500  focus-visible:outline-gray-500 hover:bg-gray-400",
            state.bonus5050 &&
              "bg-indigo-600  focus-visible:outline-indigo-600 hover:bg-indigo-500",
            "transition-colors"
          )}
          onClick={() => socket.emit("bonus5050")}
        >
          50/50
        </button>

        <button
          className={classNames(
            "flex-grow rounded-md px-3.5 py-5 text-2xl font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            !state.bonusSacrifice &&
              "bg-gray-500  focus-visible:outline-gray-500 hover:bg-gray-400",
            state.bonusSacrifice &&
              "bg-indigo-600  focus-visible:outline-indigo-600 hover:bg-indigo-500",
            "transition-colors"
          )}
          onClick={() => socket.emit("bonusSacrifice")}
        >
          Sacrificio
        </button>

        <button
          className={classNames(
            "flex-grow rounded-md px-3.5 py-5 text-2xl font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            !state.bonusCall &&
              "bg-gray-500  focus-visible:outline-gray-500 hover:bg-gray-400",
            state.bonusCall &&
              "bg-indigo-600  focus-visible:outline-indigo-600 hover:bg-indigo-500",
            "transition-colors"
          )}
          onClick={() => socket.emit("bonusCall")}
        >
          Llamada
        </button>
      </div>

      <div>
        <h2 className="font-medium text-md text-gray-700 mb-1">
          Pregunta {state.questionIndex + 1} de {state.questions.length}
        </h2>
        <h1 className="text-3xl text-gray-800">
          {state.questions[state.questionIndex].text}{" "}
          {state.showQuestion ? "✅" : ""}
        </h1>
      </div>

      <div className="w-full grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
        {state.questions[state.questionIndex].options.map((option, index) => (
          <QuestionButton
            key={index}
            onClick={() =>
              allShown &&
              !state.showAnswer &&
              socket.emit("selectOption", index)
            }
            disabled={state.showOptionsUntil <= index}
            selected={state.selectedOption === index}
          >
            {LETTERS[index]}. {option.text} {option.isAnswer ? "✅" : ""}
          </QuestionButton>
        ))}
      </div>

      {allShown && !state.showAnswer && (
        <button
          className="p-5 text-2xl bg-green-500 rounded-md font-medium text-white disabled:bg-gray-400"
          onClick={() => socket.emit("showAnswer")}
          disabled={state.selectedOption === undefined}
        >
          Mostrar Respuesta
        </button>
      )}

      {((state.selectedOption !== undefined && state.showAnswer) ||
        !state.showQuestion ||
        state.showOptionsUntil < 4) && (
        <button
          className="p-5 text-2xl bg-green-500 rounded-md font-medium text-white"
          onClick={() => socket.emit("next")}
        >
          {!state.showQuestion && <>Mostrar Pregunta</>}
          {state.showQuestion && !allShown && (
            <>Mostrar Opcion {LETTERS[state.showOptionsUntil]}</>
          )}
          {state.showQuestion &&
            allShown &&
            state.selectedOption !== undefined && <>Siguiente Pregunta</>}
        </button>
      )}

      <button
        className="p-5 text-2xl bg-gray-400 rounded-md font-medium text-white"
        onClick={() => socket.emit("previous")}
      >
        Atras
      </button>

      <button
        className="p-5 text-2xl bg-red-500 rounded-md font-medium text-white"
        onClick={() => socket.emit("reset")}
      >
        Reiniciar
      </button>
    </div>
  );
};
