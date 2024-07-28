import { FC } from "react";

type Props = {
  onReady: () => void;
  onRandomShips: () => void;
  canShoot: boolean;
  shipsReady: boolean;
};

const ActionsInfo: FC<Props> = ({
  onReady,
  onRandomShips,
  canShoot,
  shipsReady,
}) => {
  if (!shipsReady) {
    return (
      <>
        <button onClick={onReady}>SHIPS READY</button>
        <button onClick={onRandomShips}>Random</button>
      </>
    );
  }
  return <div>{canShoot ? <p>you shoot</p> : <p>the opponent shoots</p>}</div>;
};

export default ActionsInfo;
