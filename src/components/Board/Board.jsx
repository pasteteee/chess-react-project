import styles from "./Board.module.scss";
import { Cell } from "../Cell/Cell";
import BoardModel from "../../utils/Board";
import { useState } from "react";

export const Board = (props) => {
    const [boardStatus] = useState(() => new BoardModel(props.startBoard));
    const [validMoves, setValidMoves] = useState(Array(64).fill(0));
    const [activeCell, setActiveCell] = useState(null);

    function ClearValidMoves() {
        setValidMoves((...prev) => prev.map(() => 0));
    }

    function SetValidMovesByPices(figure) {
        if (figure == null) {
            ClearValidMoves();
            return;
        }

        let avaibleSteps = figure.setWays();
        setValidMoves((...prev) => [...avaibleSteps]);
    }

    function callCellAction(index) {
        const clickedCell = boardStatus.getCellByIndex(index);

        if (activeCell !== null && validMoves[index] > 0) {
            const result = boardStatus.makeMove(activeCell, index);
            ClearValidMoves();
            setActiveCell(null);
        } else if (clickedCell.figure && clickedCell.figure.color === boardStatus.getCurrentPlayerColor()) {
            if (activeCell === index) {
                ClearValidMoves();
                setActiveCell(null);
            } else {
                SetValidMovesByPices(clickedCell.figure);
                setActiveCell(index);
            }
        } else {
            ClearValidMoves();
            setActiveCell(null);
        }
    }

    return (
        <div className={styles.board} onContextMenu={(e) => e.preventDefault()}>
            {boardStatus.getAllCells().map((cell, ind) => {
                return (
                    <Cell
                        key={`${ind}-${validMoves[ind]}`}
                        index={ind}
                        pices={props.pices}
                        value={cell}
                        validMoves={validMoves}
                        clickEvent={callCellAction}
                    />
                );
            })}
        </div>
    );
};
