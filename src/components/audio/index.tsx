import { useState, MouseEvent, useEffect } from "react";
import { SoundOn } from "../../svg/sound-on";
import { SoundOff } from "../../svg/sound-off";

const Sound = new Audio("./music.mp3");

export function AudioComponent() {
  const [isPlay, setIsPlay] = useState(true);

  useEffect(() => {
    Sound.load();
    Sound.play();
    Sound.loop = true;
  }, []);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isPlay ? Sound.pause() : Sound.play();
    setIsPlay((prev) => !prev);
  };

  return (
    <div onClick={handleClick} className="audio_svg">
      {isPlay ? <SoundOn /> : <SoundOff />}
    </div>
  );
}
