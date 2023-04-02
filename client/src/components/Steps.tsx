import classNames from "classnames";
import { State } from "../types";

function valueToHex(c: number) {
  return c.toString(16);
}

function rgbToHex([r, g, b]: number[]) {
  return `#${valueToHex(r)}${valueToHex(g)}${valueToHex(b)}`;
}

function pickHex(weight: number) {
  const color1 = [220, 53, 69];
  const color2 = [40, 167, 69];
  var w1 = weight;
  var w2 = 1 - w1;
  var rgb = [
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
  ];
  return rgbToHex(rgb);
}

const Step: React.FC<{
  max: number;
  index: number;
  unlocked: boolean;
  current: boolean;
}> = ({ index, unlocked, max, current }) => {
  return (
    <span
      className={classNames(
        "text-base border-[3px] drop-shadow flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full z-10 bg-gray-300 text-white shadow-md",
        current && "border-yellow-500",
        !current && "border-0",
        "transition-all duration-300",
        !current && !unlocked && "text-gray-400"
      )}
      style={{
        background: unlocked
          ? `linear-gradient(to right, ${pickHex(index / max)}, ${pickHex(
              (index + 1) / max
            )})`
          : undefined,
      }}
    >
      <h1 className="font-semibold drop-shadow-lg">{index + 1}</h1>
    </span>
  );
};

export const Steps: React.FC<{ state: State }> = ({ state }) => {
  return (
    <div className="relative">
      <hr className="absolute top-1/2 bottom-1/2 left-0 right-0 h-0.5 bg-gray-200 w-full" />
      <div className="flex justify-between">
        {state.questions.map((item, index) => (
          <Step
            key={index}
            max={state.questions.length}
            index={index}
            unlocked={index <= state.questionIndex}
            current={index === state.questionIndex}
          />
        ))}
      </div>
    </div>
  );
};
