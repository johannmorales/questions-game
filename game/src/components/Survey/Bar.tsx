import { FC } from "react";
import { getLetterFromIndex } from "../../utils";

type Props = {
  percentage: number;
  index: number;
  height: number;
};

export const Bar: FC<Props> = ({ percentage, index, height }) => {
  return (
    <div className="h-full flex flex-col justify-end items-center gap-1">
      <span className="text-white font-semibold text-sm">
        {percentage.toFixed(0)}%
      </span>
      <div
        className="bg-transparent w-14 bg-yellow-400 transition-all duration-300 rounded-sm"
        style={{ height: `${height || 1}%` }}
      ></div>
      <span className="text-lg text-sky-400">{getLetterFromIndex(index)}</span>
    </div>
  );
};
