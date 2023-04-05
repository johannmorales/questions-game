import { FC, useMemo, useState } from "react";
import { Container } from "../Container";
import { Bar } from "./Bar";

type Props = {
  data: number[];
};

export const Survey: FC<Props> = ({ data }) => {
  const heights = useMemo(() => {
    const max = Math.max(...data);
    return data.map((voters) => (voters / max) * 100);
  }, [data]);
  const total = useMemo(
    () => data.reduce((prev, next) => prev + next, 0),
    [data]
  );
  const percentages = useMemo(() => {
    return data.map((voters) => (total === 0 ? 0 : (voters / total) * 100));
  }, [total, data]);
  return (
    <Container>
      <div className="h-96 w-72 flex flex-col gap-4 -mb-2">
        <p className="font-bold text-lg">
          ¡Vota enviando un mensaje en el chat que empiece por{" "}
          <span className="text-sky-400">A</span>,{" "}
          <span className="text-sky-400">B</span>,{" "}
          <span className="text-sky-400">C</span> o{" "}
          <span className="text-sky-400">D</span>!
        </p>
        <div className="text-lg text-center my-2">
          <span className="text-purple-500 text-3xl">{total}</span> votos
        </div>
        <div className="flex flex-row justify-between h-full align-bottom items-center flex-grow">
          <Bar index={0} height={heights[0]} percentage={percentages[0]} />
          <Bar index={1} height={heights[1]} percentage={percentages[1]} />
          <Bar index={2} height={heights[2]} percentage={percentages[2]} />
          <Bar index={3} height={heights[3]} percentage={percentages[3]} />
        </div>
      </div>
    </Container>
  );
};
