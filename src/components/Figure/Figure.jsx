import { useEffect, useState, useRef } from "react";
import styles from "./Figure.module.scss";
import { getCoordinates } from "../../utils/additional";
import { Ghost } from "../Ghost/Ghost";

export const Figure = ({ index, value, pices, prevMove, isAnimated, isDragging, setIsDragging, setDraggingMove, isFlipped = false }) => {
  const imgSrc = `/pices/${pices}/${value.color[0]}${value.sym}.png`;

  const figureImg = useRef();

  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({x: 0, y: 0});

  const startDragging = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const rect = figureImg.current.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.width / 2,
      y: e.clientY - rect.height / 2,
    });

    const handleMouseMove = (moveEvent) => {     
      setDragPosition(prev => ({
        ...prev,
        x: moveEvent.clientX - rect.width / 2,
        y: moveEvent.clientY - rect.height / 2,
      }));

    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      setDraggingMove(e.target.attributes["data-index"].nodeValue);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    setCoord((prev) => ({
      ...prev,
      x: figureImg.current.x,
      y: figureImg.current.y,
    }));
  }, [isAnimated]);

  return (
    <div
      className={`${styles.figure} ${isFlipped ? styles.flipped : ""} ${(isAnimated && !isDragging) ? styles.isAnimated : ""}`}
      style={{
        "--figure-transfer-translate-x": `${prevMove.x - coord.x}px`,
        "--figure-transfer-translate-y": `${prevMove.y - coord.y}px`,
        zIndex: isDragging ? 1000 : 1,
      }}
      draggable
      data-index={index}
    >
      <img
        onMouseDown={startDragging}
        ref={figureImg}
        data-index={index}
        style={{
          opacity: isDragging ? 0.3 : 1
        }}
        src={imgSrc}
      />

      {isDragging && <Ghost imgSrc={imgSrc} dragPosition={dragPosition} isFlipped={isFlipped} />}
    </div>
  );
};
