import styles from "./Cell.module.scss";
import { getCoordinatesSum } from "../../utils/additional";
import { Figure } from "../Figure/Figure";
import { useState } from "react";

export const Cell = ({ index, value, pices, validMoves, clickEvent, prevMove }) => {
    const [isUnderlined, setUnderlined] = useState(false);

    return (
        <div
            onClick={() => clickEvent(index)}
            onAuxClick={() => setUnderlined((prev) => !prev)}
            className={`${styles.cell} ${isUnderlined && styles.underlined}`}
            
            color_type={value.color}
        >
            {validMoves[index] > 0 && <div className={styles.point} point-type={validMoves[index]}></div>}
            {value.figure && <Figure value={value.figure} pices={pices} prevMove={prevMove}/>}
        </div>
    );
};
