export const useStatusText = (
  userShipsLength: number,
  isUserReady: boolean,
  isRivalReady: boolean
) => {
  let statusText = "The ships are ready! Let's play?";
  const statusClassName = ["sistem_message"];
  const isNotReadyShips = userShipsLength !== 10;

  if (isNotReadyShips) {
    statusText = "Place the ships";
    statusClassName.push("sistem_message__not_ready");
  } else if (isUserReady && !isRivalReady) {
    statusText = "Waiting the Rival";
    statusClassName.push("sistem_message__not_rival_ready");
  }

  return { statusText, statusClassName };
};
