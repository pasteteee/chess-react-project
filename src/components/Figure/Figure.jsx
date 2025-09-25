import { useEffect, useState, useRef } from "react";
import styles from "./Figure.module.scss";
import { getCoordinates } from "../../utils/additional";

export const Figure = ({value, pices, prevMove, isAnimated}) => {
    const figureImg = useRef();
    const [coord, setCoord] = useState({x: 0, y: 0});

    useEffect(() => {
        setCoord(prev => ({...prev, x: figureImg.current.x, y: figureImg.current.y}))
    }, [isAnimated])
    
    return (
        <div className={`${styles.figure} ${isAnimated ? styles.isAnimated : ''}`}  style={{
                    '--figure-transfer-translate-x':  `${prevMove.x - coord.x}px`,
                    '--figure-transfer-translate-y':  `${prevMove.y - coord.y}px`,
                }} draggable>
            <img ref={figureImg}
                src={`/pices/${pices}/${value.color[0]}${value.sym}.png`}
                
            />
        </div>
    );
};
