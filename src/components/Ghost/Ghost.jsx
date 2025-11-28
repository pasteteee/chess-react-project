import { useEffect, useState } from "react";
import styles from "./Ghost.module.scss"

export const Ghost = ({imgSrc, dragPosition, isFlipped = false}) => {
  const [moveDir, setMoveDir] = useState(0);
  const [prevCoord, setPrevCoord] = useState(dragPosition);

  useEffect(() => {
      const value = dragPosition.x - prevCoord.x;
      setMoveDir(value / Math.abs(value));
      setPrevCoord(prev => ({...prev, x:dragPosition.x, y:dragPosition.y}));
  }, [dragPosition]);

  // Базовый поворот от движения + поворот от перевернутой доски
  const baseRotation = 15 * moveDir;
  const flipRotation = isFlipped ? 180 : 0;
  const totalRotation = baseRotation + flipRotation;

  return (
    <div
      className={styles.ghost}
      style={{
        left: dragPosition.x,
        top: dragPosition.y,
        zIndex: 1000, 
        transform: `rotate(${totalRotation}deg) scale(1.05) translate(-25%, -25%)`,
      }}
    >
      <img src={imgSrc} />
    </div>
  );
};
