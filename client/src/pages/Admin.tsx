import { useSocket } from "../hooks/useSocket";

export const Admin: React.FC = () => {
  const { socket, state } = useSocket("asd");

  if (!state || !socket) {
    return null;
  }

  const allShown = state.showQuestion && state.showOptionsUntil === 4;

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {allShown && state.selectedOption === undefined && (
        <div className="w-full grid grid-cols-2 grid-rows-2 gap-2">
          <button
            className="p-5 text-2xl bg-gray-200 rounded-md font-extrabold"
            onClick={() => socket.emit("selectOption", 0)}
          >
            A
          </button>
          <button
            className="p-5 text-2xl bg-gray-200 rounded-md font-extrabold"
            onClick={() => socket.emit("selectOption", 1)}
          >
            B
          </button>
          <button
            className="p-5 text-2xl bg-gray-200 rounded-md font-extrabold"
            onClick={() => socket.emit("selectOption", 2)}
          >
            C
          </button>
          <button
            className="p-5 text-2xl bg-gray-200 rounded-md font-extrabold"
            onClick={() => socket.emit("selectOption", 3)}
          >
            D
          </button>
        </div>
      )}

      {allShown && state.selectedOption !== undefined && !state.showAnswer && (
        <button
          className="p-5 text-2xl bg-green-500 rounded-md font-medium text-white"
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
        className="p-5 text-2xl bg-red-500 rounded-md font-medium text-white"
        onClick={() => socket.emit("reset")}
      >
        Reiniciar
      </button>
    </div>
  );
};
