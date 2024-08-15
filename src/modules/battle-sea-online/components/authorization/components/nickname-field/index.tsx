import { FC, useEffect, useState } from "react";

import { useTelegram } from "../../../../../../provider/telegram";

import "./style.scss";

type Props = {
  setNickname: (arg: string) => void;
  nickname: string;
};

const NicknameField: FC<Props> = ({ nickname, setNickname }) => {
  const [isShowHint, setIsShowHint] = useState(false);
  const { user } = useTelegram();

  useEffect(() => {
    if (user) {
      setNickname(user.first_name || user.username || "");
    }
    setTimeout(() => {
      setIsShowHint(true);
    }, 5000);
  }, []);

  let hint = "Enter nickname";

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
        Set your nickname
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
