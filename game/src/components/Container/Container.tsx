import classNames from "classnames";
import { FC, ReactNode } from "react";
import "./Container.css";

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
    <div
      id="box"
      className={classNames(
        "rounded-md flex text-white transition-colors",
        "text-3xl",
        "font-bold",
        "p-4",
        "gradient-border",
        "bg-black",
        "m-[5px]",
        "after:rounded-md",
        "after:top-4",
        align === "center" && "justify-center",
        align === "left" && "justify-start",
        background === "default" && "bg-black",
        background === "success" &&
          "bg-gradient-to-r from-success-start from-60% to-success-end",
        background === "selected" &&
          "bg-gradient-to-r from-warning-start from-60% to-warning-end transition-colors duration-500"
      )}
    >
      {children}
    </div>
  );
};
