export const Question: React.FC<{
  index: number;
  value: string;
  revealed: boolean;
}> = ({ index, value, revealed }) => {
  return (
    <div className="answer">
      <span className="number">{index + 1}. </span>
      {revealed && value}
    </div>
  );
};
