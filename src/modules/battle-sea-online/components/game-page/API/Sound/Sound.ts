const Sound = (sound: string) => {
  const audio = new Audio();
  audio.src = `${process.env.PUBLIC_URL}/battleship/mp3/${sound}.mp3`;
  audio?.play?.();
};

export default Sound;
