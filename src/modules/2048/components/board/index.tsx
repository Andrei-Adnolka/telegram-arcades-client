import { useCallback, useContext } from "react";
import { Tile as TileModel } from "../../models/tile";
import Tile from "../tile";
import { GameContext } from "../../context/game-context";
import MobileSwiper, { SwipeInput } from "../mobile-swiper";
import NewGameButton from "../new-game-button";
import { useInitStartGame } from "../../hooks/useInitStartGame";

import "./style.scss";

export default function Board() {
  const { getTiles, moveTiles, isGameOver } = useContext(GameContext);

  useInitStartGame();

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles("move_right");
        } else {
          moveTiles("move_left");
        }
      } else {
        if (deltaY > 0) {
          moveTiles("move_down");
        } else {
          moveTiles("move_up");
        }
      }
    },
    [moveTiles]
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<div className="cell-2048" key={index} />);
    }

    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => (
      <Tile key={`${tile.id}`} {...tile} />
    ));
  };

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div className="board-2048">
        <div className="tiles">{renderTiles()}</div>
        <div className="grid">{renderGrid()}</div>
        <div
          className={`game-over-message ${
            isGameOver ? "game-over-message-show" : ""
          }`}
        >
          <p>Game Over</p>
          <NewGameButton text="try again" />
        </div>
      </div>
    </MobileSwiper>
  );
}
