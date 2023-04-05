import { FC } from "react";
import classNames from "classnames";

type Props = {
  max: number;
  index: number;
  isUnlocked: boolean;
  isCurrent: boolean;
};

export const Step: FC<Props> = ({ index, max, isUnlocked, isCurrent }) => {
  const maxPercentage = max * 100;
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
          "border-0 text-base drop-shadow flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full z-10 bg-gray-500 text-white shadow-sm",
          isUnlocked && "transition-all duration-300",
          !isCurrent && !isUnlocked && "text-gray-400"
        )}
        style={{
          background: isUnlocked
            ? `linear-gradient(to right, #00be58 ${index * -100}%, #d4212f ${
                maxPercentage - index * 100
              }%)`
            : undefined,
        }}
      >
        <h1 className="text-base font-semibold drop-shadow-lg ">{index + 1}</h1>
      </span>
    </div>
  );
};
