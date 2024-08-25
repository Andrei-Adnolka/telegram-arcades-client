import { CellOptions } from "../../../../types";

type Props = {
  type: CellOptions;
  dataName: string;
  className: string;
};

function Cell({ type, dataName, className }: Props) {
  return <div className={`blast-cell ${type} ${className}`} id={dataName} />;
}

export default Cell;
