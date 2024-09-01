import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import { STORAGE_NAME } from "../../constants";

type Props = {
  text?: string;
};

export default function NewGameUI({ text }: Props) {
  const { removeItem } = useLocalStorage(STORAGE_NAME);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    window.location.reload();
    removeItem();
  };

  return (
    <div className="score new-game" onClick={handleClick}>
      {text || "New Game"}
    </div>
  );
}
