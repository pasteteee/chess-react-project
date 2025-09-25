import styles from "./Cell.module.scss";
import { Figure } from "../Figure/Figure";
import { useEffect, useState } from "react";

export const Cell = ({ index, value, pices, validMoves, clickEvent, prevMove }) => {
    const [isUnderlined, setUnderlined] = useState(false);

    const pointClasses = ['', styles.symple, styles.beat, styles.symple];

    return (
        <div
            onClick={(e) => clickEvent(e, index)}
            onAuxClick={() => setUnderlined((prev) => !prev)}
            className={`${styles.cell} ${isUnderlined && styles.underlined}`}   
            color_type={value.color}
        >
            <div className={`${styles.point} ${pointClasses[validMoves[index]]}`}></div>
            {value.figure && <Figure value={value.figure} pices={pices} prevMove={prevMove}/>}
        </div>
    );
};
