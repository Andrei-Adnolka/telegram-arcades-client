import { FC } from "react";

type Props = {
  score: number;
};

const Score: FC<Props> = ({ score }) => <div>{score}</div>;

export default Score;
