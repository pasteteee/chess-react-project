import styles from "./Cell.module.scss";
import { getCoordinatesSum } from "../../utils/additional";
import { Figure } from "../Figure/Figure";
import { useState } from "react";

export const Cell = ({ index, value, pices, validMoves, clickEvent }) => {
    const [isUnderlined, setUnderlined] = useState(false);

    const getMoveType = () => {
        if (validMoves && validMoves[index]) {
            return validMoves[index]; // 1 - обычный ход, 2 - взятие, 3 - специальный ход
        }
        return 0;
    };

    const moveType = getMoveType();

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
            {/* Точка для обычных ходов */}
            {moveType === 1 && <div className={styles.point}></div>}

            {/* Обводка для клеток с взятием */}
            {moveType === 2 && <div className={styles.captureIndicator}></div>}

            {/* Индикатор для специальных ходов */}
            {moveType === 3 && <div className={styles.specialIndicator}></div>}

            {/* Индикатор для рокировки */}
            {moveType === 4 && <div className={styles.specialIndicator}></div>}

            {value.figure && <Figure value={value.figure} pices={pices} />}
        </div>
    );
};
