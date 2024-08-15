export const getRandomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getShipOrientation = () => !(getRandomNum(0, 1) === 1);

export const getShip = (length: number, isHorizontal: boolean) => {
  let maxIndex = 99;
  let startPosition = 0;

  switch (isHorizontal) {
    case true:
      maxIndex -= length - 1;
      const getStartPosition = () => {
        startPosition = getRandomNum(0, maxIndex);
        if (
          Math.floor(startPosition / 10) !==
          Math.floor((startPosition + length - 1) / 10)
        ) {
          getStartPosition();
        }
        return startPosition;
      };
      startPosition = getStartPosition();
      break;
    case false:
      maxIndex -= (length - 1) * 10;
      startPosition = getRandomNum(0, maxIndex);
  }

  return new Array(length).fill(0).map((_, index) => {
    const i = isHorizontal ? 1 * index : 10 * index;
    return startPosition + i;
  });
};
