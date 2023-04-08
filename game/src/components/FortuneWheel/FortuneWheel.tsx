import { FC } from "react";
import FortuneWheelImage from "../../assets/fortune-wheel.png";
import "./FortuneWheel.css";

type Props = {
  result: number | null;
};
export const FortuneWheel: FC<Props> = ({ result }) => {
  const animationName = result !== null ? `result-${result}` : undefined;
  console.log("animation name", animationName);
  return (
    <div>
      <img
        key={new Date().getTime()}
        src={FortuneWheelImage}
        alt="fortune-wheel"
        className="wheel"
        style={{ animationName: animationName || "" }}
      />
    </div>
  );
};
