import { useEffect, useState } from "react";
import styles from "./Ghost.module.scss"

export const Ghost = ({imgSrc, dragPosition}) => {
  const [moveDir, setMoveDir] = useState(0);
  const [prevCoord, setPrevCoord] = useState(dragPosition);

  useEffect(() => {
      const value = dragPosition.x - prevCoord.x;
      setMoveDir(value / Math.abs(value));
      setPrevCoord(prev => ({...prev, x:dragPosition.x, y:dragPosition.y}));
  }, [dragPosition]);

  return (
    <div
      className={styles.ghost}
      style={{
        left: dragPosition.x,
        top: dragPosition.y,
        zIndex: 1000, 
        transform: `rotate(${15 * moveDir}deg) scale(1.05) translate(-25%, -25%)`,
      }}
    >
      <img src={imgSrc} />
    </div>
  );
};
