import styles from "./Cell.module.scss";
import { Figure } from "../Figure/Figure";
import { useEffect, useState } from "react";

export const Cell = ({
  index,
  value,
  pices,
  validMoves,
  clickEvent,
  prevMove,
  activeCell,
  mouseDownEvent
}) => {
  const pointClasses = ["", styles.symple, styles.beat, styles.symple];

  const [isUnderlined, setUnderlined] = useState(false);

  return (
    <div
      onClick={(e) => clickEvent(e, index)}
      onMouseDown={(e) => mouseDownEvent(e, index)}
      onAuxClick={() => setUnderlined((prev) => !prev)}
      className={`${styles.cell} ${isUnderlined ? styles.underlined : ""}`}
      color_type={value.color}
    >
      <div
        className={`${styles.point} ${pointClasses[validMoves[index]]}`}
      ></div>
      {value.figure && (
        <Figure
          value={value.figure}
          pices={pices}
          prevMove={prevMove}
          isAnimated={activeCell === index}
        />
      )}
    </div>
  );
};
