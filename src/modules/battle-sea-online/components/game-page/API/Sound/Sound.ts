const Sound = async (sound: string) => {
  const audio = new Audio();
  audio.src = `${process.env.PUBLIC_URL}/battleship/mp3/${sound}.mp3`;
  await new Promise((r) => setTimeout(r, 200));
  audio?.play?.();
};

export default Sound;
