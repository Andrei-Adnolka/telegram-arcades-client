import { FC, memo, useEffect } from "react";

import { FIELD } from "../../constants";

import Cell from "../cell";

import { useAppDispatch } from "../../../../redux/hooks";
import { usePersonData } from "../../../../redux/usePersonData";
import { setRandomShips } from "../../../../redux/rivalSlice";

type Props = {
  isRival: boolean;
  isOnline: boolean;
  sendSocket: (shoot: number) => void;
};

const Field: FC<Props> = ({ isRival, isOnline, sendSocket }) => {
  const { misses, ships, notAllowed } = usePersonData(isRival);
  const dispatch = useAppDispatch();

  const isAbleShoot = false;

  useEffect(() => {
    if (isRival) {
      dispatch(setRandomShips());
    }
  }, []);

  const bgClass = `battleground ${!isAbleShoot && isRival ? "inactive" : ""}`;

  const shootHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!(e.target as HTMLDivElement).id) {
      return;
    }

    const shoot = Number((e.target as HTMLDivElement).id);

    if (isAbleShoot && isRival) {
      const isMissAlready = misses.includes(shoot);

      const isDeadAlready = ships.some((ship) => {
        return ship.woundedCells.includes(shoot);
      });

      const isNotAllowed = notAllowed.includes(shoot);

      if (isDeadAlready || isMissAlready || isNotAllowed) {
        return;
      }

      // if (isOnline) {
      //   sendSocket(shoot);
      // }
    }
  };
  const id = isRival ? "rival" : "user";

  return (
    <div className={bgClass} id={`${id}_field`} onClick={shootHandler}>
      {FIELD.map((_, i) => {
        const key = `${id}_${i}`;
        return (
          <Cell
            key={key}
            id={key}
            coordinate={i}
            ships={ships}
            misses={misses}
            notAllowed={notAllowed}
            isRival={isRival}
          />
        );
      })}
    </div>
  );
};

export default memo(Field);
