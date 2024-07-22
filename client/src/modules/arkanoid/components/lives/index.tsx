import "./style.scss";

interface Props {
  lives?: number;
}

function LivesBlock({ lives }: Props) {
  return (
    <div className="lives">
      <div className="lives_title">LIVES</div>
      <div className="lives_blocks">
        {Array.from({ length: lives || 0 }).map((block, blockIndex) => {
          return <div key={`${blockIndex}-${block}`} className="cell"></div>;
        })}
      </div>
    </div>
  );
}

export default LivesBlock;
