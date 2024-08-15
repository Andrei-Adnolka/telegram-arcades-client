import { FC, memo, useEffect } from "react";

import { FIELD } from "../../constants";

import Cell from "../cell";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { usePersonData } from "../../../../redux/usePersonData";
import { setRandomShips } from "../../../../redux/rivalSlice";
import { useUserTurn } from "../../hooks/useUserTurn";
import { selectIsUserShot } from "../../../../redux/gameSlice";

type Props = {
  isRival: boolean;
  isUserBoard?: boolean;
  isOnline: boolean;
  sendSocket?: (shoot: number) => void;
};

const Field: FC<Props> = ({ isRival, isOnline, isUserBoard, sendSocket }) => {
  const { misses, ships, notAllowed } = usePersonData(isRival);
  const isUserShot = useAppSelector(selectIsUserShot);
  const dispatch = useAppDispatch();

  const { userTurn } = useUserTurn();

  useEffect(() => {
    if (isRival && !isOnline) {
      dispatch(setRandomShips());
    }
  }, [isRival, isOnline, dispatch]);

  const bgClass = `battleground ${
    (!isUserShot && isRival) || isUserBoard ? "inactive" : ""
  }`;

  const shootHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!(e.target as HTMLDivElement).id) {
      return;
    }

    const shoot = Number((e.target as HTMLDivElement).id);

    if (isUserShot && isRival) {
      const isMissAlready = misses.includes(shoot);

      const isDeadAlready = ships.some((ship) => {
        return ship.woundedCells.includes(shoot);
      });

      const isNotAllowed = notAllowed.includes(shoot);

      if (isDeadAlready || isMissAlready || isNotAllowed) {
        return;
      }

      if (isOnline) {
        sendSocket?.(shoot);
      }
      userTurn(shoot);
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
