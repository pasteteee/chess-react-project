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
  setDraggingMove,
  isFlipped = false
}) => {
  const pointClasses = ["", styles.symple, styles.beat, styles.check, styles.castle];
  const [isDragging, setIsDragging] = useState(false);
  const [isUnderlined, setUnderlined] = useState(false);

  // Показываем точку только если есть активная клетка и валидный ход
  const showPoint = activeCell !== null && validMoves[index] > 0;

  return (
    <div
      onMouseDown={(e) => clickEvent(e, index)}
      onAuxClick={() => setUnderlined((prev) => !prev)}
      className={`${styles.cell} ${isUnderlined ? styles.underlined : ""}`}
      color_type={value.color}
      data-index={index}
    >
      {showPoint && (
        <div data-index={index}
          className={`${styles.point} ${pointClasses[validMoves[index]]}`}
        ></div>
      )}

      {value.figure && (
        <Figure
          value={value.figure}
          pices={pices}
          prevMove={prevMove}
          isAnimated={activeCell === index}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          index={index}
          setDraggingMove={setDraggingMove}
          isFlipped={isFlipped}
        />
      )}
    </div>
  );
};
