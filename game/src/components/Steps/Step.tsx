import { FC } from "react";
import classNames from "classnames";

type Props = {
  max: number;
  index: number;
  isUnlocked: boolean;
  isCurrent: boolean;
};

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

export const Step: FC<Props> = ({ index, max, isUnlocked, isCurrent }) => {
  return (
    <div className="border-0 h-11 w-11 flex justify-center items-center">
      <div
        className={classNames(
          "absolute border-0 h-9 w-9 bg-[#fbd324] rounded-full shadow-sm",
          "transition-all duration-500",
          isCurrent && "scale-125 "
        )}
      >
        &nbsp;
      </div>
      <span
        className={classNames(
          "border-0 text-base drop-shadow flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full z-10 bg-gray-500 shadow-sm",
          isUnlocked && "transition-all duration-300 text-white",
          !isCurrent && !isUnlocked && "text-slate-400"
        )}
        style={{
          background: isUnlocked ? pickHex(index / (max - 1)) : undefined,
        }}
      >
        <span className="text-base font-semibold drop-shadow-lg">
          {index + 1}
        </span>
      </span>
    </div>
  );
};
