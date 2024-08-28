import { useEffect, useState } from "react";

const GameOverUI = () => {
  const [isShowScore, setIsShowScore] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShowScore(true);
    }, 3000);
  }, []);

  if (!isShowScore) {
    return null;
  }

  return <div>Нет свободного места</div>;
};

export default GameOverUI;
