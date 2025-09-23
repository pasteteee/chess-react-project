import styles from "./Cell.module.scss";
import { getCoordinatesSum } from "../../utils/additional";
import { Figure } from "../Figure/Figure";
import { useState } from "react";

const cellActiveClasses = [null, styles.point, styles.captureIndicator, styles.specialIndicator, styles.specialIndicator]

export const Cell = ({ index, value, pices, validMoves, clickEvent }) => {
    const [isUnderlined, setUnderlined] = useState(false);

    const getMoveType = () => {
        if (validMoves && validMoves[index]) {
            return validMoves[index]; // 1 - обычный ход, 2 - взятие, 3 - специальный ход
        }
        return 0;
    };

    const moveType = getMoveType();

    console.log('Cell:', index, 'MoveType:', moveType, 'ValidMoves:', validMoves);


    return (
        <div
            onClick={() => clickEvent(index)}
            onAuxClick={() => setUnderlined((prev) => !prev)}
            className={`${styles.cell} ${isUnderlined && styles.underlined} ${
                moveType > 0 && styles.validMove
            } ${moveType === 2 && styles.captureMove} ${moveType === 3 && styles.specialMove}
            ${moveType === 4 && styles.specialMove}`}
            color_type={value.color}
        >
            <div className={cellActiveClasses[moveType]}></div>

            {value.figure && <Figure value={value.figure} pices={pices} />}
        </div>
    );
};
