import { FC, ReactNode } from "react";
import { Container } from "../Container";

type Props = {
  children: ReactNode;
  hidden: boolean;
};

export const Question: FC<Props> = ({ children, hidden }) => {
  return <Container align="center"> {children} </Container>;
};
