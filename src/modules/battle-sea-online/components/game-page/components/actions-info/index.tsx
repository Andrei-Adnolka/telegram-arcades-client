import { FC } from "react";

type Props = {
  ready: () => void;
  canShoot: boolean;
  shipsReady: boolean;
};

const ActionsInfo: FC<Props> = ({ ready, canShoot, shipsReady }) => {
  if (!shipsReady) {
    return <button onClick={ready}>SHIPS READY</button>;
  }
  return <div>{canShoot ? <p>you shoot</p> : <p>the opponent shoots</p>}</div>;
};

export default ActionsInfo;
