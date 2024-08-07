export const useStatusText = (userShipsLength: number) => {
  let statusText = "The ships are ready! Let's play?";
  const statusClassName = ["sistem_message"];
  const isNotReadyShips = userShipsLength !== 10;

  if (isNotReadyShips) {
    statusText = "Place the ships";
    statusClassName.push("sistem_message_not_ready");
  }
  return { statusText, statusClassName };
};
