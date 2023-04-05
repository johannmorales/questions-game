import { FC } from "react";
import { Step } from "./Step";

type Props = {
  amount: number;
  current: number;
};

export const Steps: FC<Props> = ({ amount, current }) => {
  const percentage = Math.round((current / (amount - 1)) * 100);
  return (
    <div className="relative my-1">
      <div className="absolute top-1/2 bottom-1/2 left-0 right-0 w-full px-1">
        <div className="flex flex-row">
          <div
            className="border-0 transition-all duration-500 h-[0.5px] bg-gray-300"
            style={{
              width: `${percentage}%`,
            }}
          ></div>
          <div
            className="border-0 transition-all duration-500 h-[0.5px] bg-gray-500"
            style={{
              width: `${100 - percentage}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        {Array.from(Array(amount), (_, x) => x).map((index) => (
          <Step
            key={index}
            isUnlocked={index <= current}
            isCurrent={index === current}
            index={index}
            max={amount}
          />
        ))}
      </div>
    </div>
  );
};
