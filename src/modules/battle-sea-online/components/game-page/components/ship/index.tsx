import { FC, useEffect, useState } from "react";

import { DECKS } from "./_constants";

import "./index.scss";

type Props = {
  decks: number;
};

const Ship: FC<Props> = ({ decks }) => {
  const [isHorizontal, setHorizonal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const rotateHandler = (
    event: React.MouseEvent<HTMLDivElement>,
    decks: number
  ) => {
    event.preventDefault();
    console.log("rotateHandler", rotateHandler);
    if (decks > 1) {
      setClickCount(clickCount + 1);
      setTimeout(() => {
        setClickCount(0);
      }, 400);
    }
  };

  useEffect(() => {
    if (clickCount === 2) {
      setHorizonal(!isHorizontal);
    }
  }, [clickCount]);

  const getDeckClass = (decks: number) => {
    const { one, two, three, four } = DECKS;
    switch (decks) {
      case 1:
        return one;
      case 2:
        return two;
      case 3:
        return three;
      case 4:
        return four;
      default:
        return "";
    }
  };

  const classList = ["ship", getDeckClass(decks)];

  return (
    <div
      className={`${classList.join(" ")}${isHorizontal ? " horizontal" : ""}`}
      onMouseDown={(event) => rotateHandler(event, decks)}
    >
      {new Array(decks).fill(null).map((_, index) => (
        <div className="ship-cell" key={index}></div>
      ))}
    </div>
  );
};

export default Ship;
