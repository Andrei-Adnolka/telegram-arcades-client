import { FC, MouseEventHandler, useCallback } from "react";

import "./style.scss";
import { STORAGE_NAME } from "../../constants";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";

const RotateSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 9C0 13.97 4.03 18 9 18C11.39 18 13.68 17.06 15.4 15.4L13.9 13.9C12.63 15.25 10.86 16 9 16C2.76 16 -0.36 8.46 4.05 4.05C8.46 -0.36 16 2.77 16 9H13L17 13H17.1L21 9H18C18 4.03 13.97 0 9 0C4.03 0 0 4.03 0 9Z"
      fill="CurrentColor"
    />
  </svg>
);
type Props = {
  isShowText?: boolean;
};
export const ReloadButton: FC<Props> = ({ isShowText = false }) => {
  const { removeItem } = useLocalStorage(STORAGE_NAME);

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      window.location.reload();
      removeItem();
    },
    [removeItem]
  );

  return (
    <div className="blast-reload-button" onClick={handleClick}>
      {RotateSvg} {isShowText ? "Перезапустить" : ""}
    </div>
  );
};
