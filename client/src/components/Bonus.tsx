import classNames from "classnames";
import { FC, ReactNode } from "react";

export const Bonus: FC<{ children: ReactNode; available: boolean }> = ({
  children,
  available,
}) => {
  return (
    <div
      className={classNames(
        "rounded-[100%] h-16 w-28 flex justify-center items-center bg-black border-blue-500 border-[3px] transition-opacity",
        !available && "opacity-50"
      )}
    >
      {children}
    </div>
  );
};
