import { CellOptions } from "../types";

interface Props {
  type: CellOptions;
  dataName: string;
}

function Cell({ type, dataName }: Props) {
  return <div className={`brick-cell ${type}`} data-name={dataName} />;
}

export default Cell;
