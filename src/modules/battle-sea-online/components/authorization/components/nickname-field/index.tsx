import { FC, useEffect, useState } from "react";

import { useTelegram } from "../../../../../../provider/telegram";

import "./style.scss";
import { useAppSelector } from "../../../../redux/hooks";
import { selectLang } from "../../../../redux/gameSlice";

type Props = {
  setNickname: (arg: string) => void;
  nickname: string;
};

const l10n = {
  ru: { h: "Введите имя", label: "Введите свое имя" },
  eng: { h: "Enter nickname", label: "" },
};

const NicknameField: FC<Props> = ({ nickname, setNickname }) => {
  const [isShowHint, setIsShowHint] = useState(false);
  const { user } = useTelegram();
  const lang = useAppSelector(selectLang);
  const { h, label } = l10n[lang];

  useEffect(() => {
    const userName =
      localStorage.nickname || user?.first_name || user?.username || "";
    setNickname(userName);
    if (!userName) {
      setTimeout(() => {
        setIsShowHint(true);
      }, 5000);
    }
    // eslint-disable-next-line
  }, [user]);

  let hint = h;

  if (nickname) {
    hint = "";
  }

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.target.value);
    if (isShowHint) {
      setIsShowHint(false);
    }
  };

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor="nickname">
        {label}
      </label>
      <input
        className="text-field__input"
        type="text"
        id="nickname"
        name="nickname"
        value={nickname}
        onChange={onChange}
      />
      {isShowHint ? <div className="text-field__hint">{hint}</div> : null}
    </div>
  );
};

export default NicknameField;
