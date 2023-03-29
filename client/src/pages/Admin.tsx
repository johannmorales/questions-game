import { ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";

const LETTERS = "ABCD";

const QuestionButton: React.FC<{
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ onClick, children, disabled }) => {
  return (
    <button
      disabled={disabled}
      className="inline-flex items-center px-6 py-3 border border-transparent text-2xl font-medium rounded-md shadow-sm text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Admin: React.FC = () => {
  const { socket, state } = useSocket("s");

  if (!state || !socket) {
    return null;
  }

  const allShown = state.showQuestion && state.showOptionsUntil === 4;

  return (
    <div className="w-full flex flex-col gap-3 p-3 bg-gray-100 h-screen justify-between">
      <div>
        <h2 className="font-medium text-md text-gray-700 mb-1">
          Pregunta {state.questionIndex + 1} de {state.questions.length}
        </h2>
        <h1 className="text-3xl text-gray-800">
          {state.questions[state.questionIndex].text}
        </h1>
      </div>

      <div className="w-full grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
        {[...Array(4).keys()].map((index) => (
          <QuestionButton
            key={index}
            onClick={() => socket.emit("selectOption", index)}
          >
            {LETTERS[index]}.{" "}
            {state.questions[state.questionIndex].options[index].text}
          </QuestionButton>
        ))}
      </div>

      {allShown && state.selectedOption !== undefined && !state.showAnswer && (
        <button
          className="p-4 text-lg bg-green-500 rounded-md font-medium text-white"
          onClick={() => socket.emit("showAnswer")}
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
          Siguiente
        </button>
      )}

      <button
        className="p-5 text-2xl bg-gray-400 rounded-md font-medium text-white"
        onClick={() => socket.emit("previous")}
      >
        Atras
      </button>

      <button
        className="p-5 text-2xl bg-gray-400 rounded-md font-medium text-white"
        onClick={() => socket.emit("previous")}
      >
        Comodin 1
      </button>

      <button
        className="p-5 text-2xl bg-gray-400 rounded-md font-medium text-white"
        onClick={() => socket.emit("previous")}
      >
        Comodin 2
      </button>

      <button
        className="p-5 text-2xl bg-gray-400 rounded-md font-medium text-white"
        onClick={() => socket.emit("previous")}
      >
        Comodin 3
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
