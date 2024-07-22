type Props = {
  x: number;
  pipes: { topHeight: number }[];
};

const getStyle = (x: number, i: number) => {
  return {
    position: "absolute",
    left: x + i * 200,
    width: 52,
    transition: "left 300ms",
  } as React.CSSProperties;
};

const Pipe = ({ x, pipes }: Props) => (
  <div style={{ position: "relative" }}>
    {pipes.map(({ topHeight }, i) => (
      <div key={`pipe-${i}`} style={{ position: "relative" }}>
        <div
          style={{
            ...getStyle(x, i),
            top: 0,
            height: topHeight,
            background: `url(/flappy-images/pipe-top.png)`,
            backgroundPosition: "bottom",
          }}
        ></div>
        <div
          style={{
            ...getStyle(x, i),
            top: topHeight + 100,
            height: 512 - topHeight - 100,
            background: `url(/flappy-images/pipe-bottom.png)`,
          }}
        ></div>
      </div>
    ))}
  </div>
);

export default Pipe;
