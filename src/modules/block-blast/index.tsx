import { FC, memo, ReactNode, useEffect } from "react";
import { Provider } from "react-redux";

import Field from "./components/field";
import UpcomingBlocks from "./components/upcoming-blocks";

import { useBlockBlast } from "./hooks/useBlockBlast";
import { store } from "./redux/store";

import "./style.scss";

const BlockBlastGameUI = () => {
  const { score } = useBlockBlast();
  console.log("score");
  useEffect(() => {
    const root = document.getElementById("root");
    if (root?.style) {
      root.style.backgroundColor = "#4a60a6";
    }
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <>
      <div className="block-blast-score">{score}</div>
      <Field />
      <UpcomingBlocks />
    </>
  );
};

const BlockBlastGame = () => {
  return (
    <Provider store={store}>
      <BlockBlastGameUI />
    </Provider>
  );
};

export default memo(BlockBlastGame);
