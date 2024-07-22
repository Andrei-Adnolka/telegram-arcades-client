import { CellOptions } from "../types";

interface Props {
  type: CellOptions;
  dataName: string;
}

function Cell({ type, dataName }: Props) {
  return <div className={`cell ${type}`} data-name={dataName} />;
}

export default Cell;
