import classNames from "classnames";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  align?: "left" | "center";
  background?: "default" | "success" | "selected";
};

export const Container: FC<Props> = ({
  children,
  align = "left",
  background = "default",
}) => {
  return (
    <div className="p-[5px] rounded-md bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-800">
      <div
        className={classNames(
          "rounded-md flex text-white transition-colors",
          "text-3xl",
          "font-bold",
          "p-4",
          align === "center" && "justify-center",
          align === "left" && "justify-start",
          background === "default" && "bg-black",
          background === "success" &&
            "bg-gradient-to-r from-success-start from-60% to-success-end",
          background === "selected" &&
            "bg-gradient-to-r from-warning-start from-60% to-warning-end"
        )}
      >
        {children}
      </div>
    </div>
  );
};
