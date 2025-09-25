import { useEffect, useState, useRef } from "react";
import styles from "./Figure.module.scss";
import { getCoordinates } from "../../utils/additional";

export const Figure = ({value, pices, prevMove}) => {
    const figureImg = useRef();
    const [animCoord, setAnimCoord] = useState({x: 0, y: 0});

    useEffect(() => {
        const x = figureImg.current.x - prevMove.x,
            y = figureImg.current.y - prevMove.y;
        setAnimCoord(prev => ({...prev, x: x, 
            y: y}));
        console.log(animCoord)
    }, [])

    return (
        <div className={styles.figure} draggable>
            <img ref={figureImg}
                src={`/pices/${pices}/${value.color[0]}${value.sym}.png`}
                style={{
                    '--figure-transfer-translate-x': animCoord.x,
                    '--figure-transfer-translate-y': animCoord.y,
                }}
            />
        </div>
    );
};
