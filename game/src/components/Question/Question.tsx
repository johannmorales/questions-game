import classNames from "classnames";
import { FC, ReactNode } from "react";
import { Container } from "../Container";

type Props = {
  children: ReactNode;
  hidden: boolean;
};

export const Question: FC<Props> = ({ children, hidden }) => {
  return (
    <Container align="center">
      <span
        className={classNames(
          hidden && "opacity-0",
          !hidden && "opacity-100 transition-opacity duration-500"
        )}
      >
        {children}
      </span>{" "}
    </Container>
  );
};
