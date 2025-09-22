import styles from "./Board.module.scss";
import { Cell } from "../Cell/Cell";
import BoardModel from "../../utils/Board";
import { useState, useRef } from "react";

export const Board = (props) => {
    const [boardStatus] = useState(() => new BoardModel(props.startBoard));
    const [validMoves, setValidMoves] = useState(Array(64).fill(false));
    const [activeCell, setActiveCell] = useState(0);

    function ClearValidMoves(setValidState) {
        setValidState((prev) => [...prev].map((item) => 0));
    }

    function SetValidMovesByPices(figure) {
        if (figure == null) return;

        let avaibleSteps = figure.setWays();
        setValidMoves((prev) => [...avaibleSteps]);
    }

    function figureStep(index) {
        boardStatus.boardMatrix[activeCell].figure.stepTo(index);
    }

    function callCellAction(index) {
        if (validMoves[index] > 0) figureStep(index);

        ClearValidMoves(setValidMoves);
        SetValidMovesByPices(boardStatus.boardMatrix[index].figure);

        setActiveCell(index);
    }

    return (
        <div className={styles.board} onContextMenu={(e) => e.preventDefault()}>
            {validMoves.map((el, ind) => {
                return (
                    <Cell
                        key={`${ind}-${validMoves[ind]}`}
                        isValid={validMoves[ind]}
                        index={ind}
                        pices={props.pices}
                        value={boardStatus.getCellByIndex(ind)}
                        setValidMoves={setValidMoves}
                        validMoves={validMoves}
                        clickEvent={callCellAction}
                    />
                );
            })}
        </div>
    );
};
