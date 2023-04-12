import classNames from "classnames";
import { ComponentProps, FC, ReactNode } from "react";
import { getLetterFromIndex } from "../../utils";
import { Container } from "../Container";

type Props = {
  index: number;
  children: ReactNode;
  isAnswer: boolean;
  isSelected: boolean;
  hidden: boolean;
};

export const Answer: FC<Props> = ({
  index,
  children,
  isAnswer,
  isSelected,
  hidden,
}) => {
  let background: ComponentProps<typeof Container>["background"] = "default";

  if (isAnswer) {
    background = "success";
  }

  if (isSelected) {
    background = "selected";
  }

  return (
    <Container background={background}>
      <span className={classNames("text-amber-500 mr-2")}>
        {getLetterFromIndex(index)}.
      </span>
      <span
        className={classNames(
          hidden && "opacity-0",
          !hidden && "opacity-100 transition-opacity duration-500"
        )}
      >
        {children}
      </span>
    </Container>
  );
};
