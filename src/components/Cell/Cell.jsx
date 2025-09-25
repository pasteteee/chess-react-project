import styles from "./Cell.module.scss";
import { getCoordinatesSum } from "../../utils/additional";
import { Figure } from "../Figure/Figure";
import { useState } from "react";

const cellActiveClasses = [null, styles.point, styles.captureIndicator, styles.specialIndicator, styles.specialIndicator]

export const Cell = ({ index, value, pices, validMoves, clickEvent }) => {
    const [isUnderlined, setUnderlined] = useState(false);

    return (
        <div
            onClick={() => clickEvent(index)}
            onAuxClick={() => setUnderlined((prev) => !prev)}
            className={`${styles.cell} ${isUnderlined && styles.underlined}`}
            
            color_type={value.color}
        >
            <div className={cellActiveClasses[validMoves[index]]}></div>

            {value.figure && <Figure value={value.figure} pices={pices} />}
        </div>
    );
};
