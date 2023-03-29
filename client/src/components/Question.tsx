import classNames from "classnames";

export const Question: React.FC<{
  index: number;
  value: string;
  revealed: boolean;
}> = ({ index, value, revealed }) => {
  return (
    <div className={classNames("answer", "justify-start md:justify-center")}>
      <span
        className={classNames(
          "transition-opacity duration-500",
          revealed && "opacity-100",
          !revealed && "opacity-0"
        )}
      >
        {value}
      </span>
    </div>
  );
};
