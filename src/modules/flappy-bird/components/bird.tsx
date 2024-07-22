type Props = {
  y: number;
  r: number;
};

const Bird = ({ y, r }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 120,
        width: 38,
        height: 26,
        background: `url(/flappy-images/bird.png)`,
        transform: `rotate(${r}deg)`,
        transition: "transform 100ms, top 300ms",
      }}
    />
  );
};

export default Bird;
