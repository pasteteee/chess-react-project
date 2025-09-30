import { useEffect, useState, useRef } from "react";
import styles from "./Figure.module.scss";
import { getCoordinates } from "../../utils/additional";

export const Figure = ({ value, pices, prevMove, isAnimated }) => {
  const figureImg = useRef();
  const ghostRef = useRef();
  const [coord, setCoord] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({x: 0, y: 0})
  const [originalPosition, setOriginalPosition] = useState({ x: 0, y: 0 });

  const startDragging = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const rect = figureImg.current.getBoundingClientRect();
    setOriginalPosition({ x: rect.left, y: rect.top });

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

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
      className={`${styles.figure} ${isAnimated ? styles.isAnimated : ""}`}
      style={{
        "--figure-transfer-translate-x": `${prevMove.x - coord.x}px`,
        "--figure-transfer-translate-y": `${prevMove.y - coord.y}px`,
      }}
      draggable
    >
      <img
        onMouseDown={startDragging}
        ref={figureImg}
        style={{
          opacity: isDragging ? 0.3 : 1
        }}
        src={`/pices/${pices}/${value.color[0]}${value.sym}.png`}
      />

      {isDragging && (
        <div
          ref={ghostRef}
          style={{
            width: `100px`,
            height: `100px`,
            display: 'block',
            position: 'fixed',
            left: dragPosition.x,
            top: dragPosition.y,
            pointerEvents: 'none',
            cursor: 'grabbing',
            padding: '10px',
            zIndex: 1000,
            transform: 'rotate(5deg) scale(1.05) translate(-25%, -25%)',
          }}
        >
          <img
            src={`/pices/${pices}/${value.color[0]}${value.sym}.png`}
          />
        </div>
      )}
    </div>
  );
};
