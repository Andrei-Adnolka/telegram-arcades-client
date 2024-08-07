export const getNewShipLocation = (
  p: number,
  decks: number,
  activeId: number
) => {
  if (typeof p === "number") {
    switch (decks) {
      case 1:
        return [p];
      case 2:
        return activeId === 0 ? [p, p + 10] : [p - 10, p];
      case 3:
        if (activeId === 1) {
          return [p - 10, p, p + 10];
        }
        if (activeId === 2) {
          return [p - 20, p - 10, p];
        }
        return [p, p + 10, p + 20];
      case 4:
        if (activeId === 1) {
          return [p - 10, p, p + 10, p + 20];
        }
        if (activeId === 2) {
          return [p - 20, p - 10, p, p + 10];
        }
        if (activeId === 3) {
          return [p - 30, p - 20, p - 10, p];
        }
        return [p, p + 10, p + 20, p + 30];
      default:
        return [];
    }
  }
  return [];
};
