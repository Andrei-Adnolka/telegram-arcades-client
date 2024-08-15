import { FC } from "react";

import { useAppSelector } from "../../../../redux/hooks";
import { selectShips } from "../../../../redux/userSlice";
import { useStatusText } from "../../hooks/useStatusText";

import "./style.scss";

type Props = {
  isUserReady: boolean;
  isRivalReady: boolean;
  onReady: () => void;
  skipIsUserReady: () => void;
};

export const SystemTextUI: FC<Props> = ({
  isUserReady,
  isRivalReady,
  onReady,
  skipIsUserReady,
}) => {
  const userShips = useAppSelector(selectShips);

  const { statusText, statusClassName } = useStatusText(
    userShips.length,
    isUserReady,
    isRivalReady
  );

  const isShowCancelButton = isUserReady && !isRivalReady;

  return (
    <span className={statusClassName.join(" ")} onClick={onReady}>
      {statusText}
      {isShowCancelButton ? (
        <div
          className="sistem_message__cancel_button"
          onClick={(e) => {
            e.stopPropagation();
            skipIsUserReady();
          }}
        >
          X
        </div>
      ) : null}
      <div className="loader-2" />
    </span>
  );
};
