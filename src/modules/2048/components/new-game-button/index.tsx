import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { STORAGE_NAME } from "../../constants";
import "./style.scss";

export default function NewGameUI() {
  const { removeItem } = useLocalStorage(STORAGE_NAME);

  const handleClick = () => {
    window.location.reload();
    removeItem();
  };

  return (
    <div className="score" onClick={handleClick}>
      New Game
    </div>
  );
}
