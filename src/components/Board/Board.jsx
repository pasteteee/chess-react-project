import styles from "./Board.module.scss";
import { Cell } from "../Cell/Cell";
import BoardModel from "../../utils/Board";
import { useState, useRef } from "react";

export const Board = (props) => {
    const [boardStatus] = useState(() => new BoardModel(props.startBoard));
    const [validMoves, setValidMoves] = useState(Array(64).fill(0));
    const [activeCell, setActiveCell] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    function ClearValidMoves() {
        setValidMoves(Array(64).fill(0));
    }

    function SetValidMovesByPices(figure) {
        if (figure == null) {
            ClearValidMoves();
            return;
        }

        let avaibleSteps = figure.setWays();
        setValidMoves([...avaibleSteps]);
    }

    function figureStep(fromIndex, toIndex) {
        const fromCell = boardStatus.getCellByIndex(fromIndex);
        if (fromCell && fromCell.figure) {
            fromCell.figure.stepTo(toIndex);
        }
    }

    function callCellAction(index) {
        const clickedCell = boardStatus.getCellByIndex(index);

        if (activeCell !== null && validMoves[index] > 0) {
            const result = boardStatus.makeMove(activeCell, index);
            if (result.success) {
                setUpdateTrigger(prev => prev + 1);
            }

            ClearValidMoves();
            setActiveCell(null);
            return;
        }

        if (clickedCell.figure && clickedCell.figure.color === boardStatus.getCurrentPlayerColor()) {
            if (activeCell === index) {
                ClearValidMoves();
                setActiveCell(null);
            } else {
                SetValidMovesByPices(clickedCell.figure);
                setActiveCell(index);
            }
        }
        else {
            ClearValidMoves();
            setActiveCell(null);
        }
    }



    return (
        <div className={styles.board} onContextMenu={(e) => e.preventDefault()}>
            {boardStatus.getAllCells().map((cell, ind) => {
                return (
                    <Cell
                        key={`${ind}-${updateTrigger}-${validMoves[ind]}`}
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
