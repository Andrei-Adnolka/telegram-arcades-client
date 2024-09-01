import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { STORAGE_NAME } from "../../constants";

type Props = {
  text?: string;
};

export default function NewGameUI({ text }: Props) {
  const { removeItem } = useLocalStorage(STORAGE_NAME);

  const handleClick = () => {
    window.location.reload();
    removeItem();
  };

  return (
    <div className="score" onClick={handleClick}>
      {text || "New Game"}
    </div>
  );
}
