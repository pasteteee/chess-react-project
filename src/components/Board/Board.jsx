import styles from "./Board.module.scss";
import { Cell } from "../Cell/Cell";
import BoardModel from "../../utils/Board";
import { useEffect, useState } from "react";

export const Board = (props) => {
    const [boardStatus] = useState(() => new BoardModel(props.startBoard));
    const [validMoves, setValidMoves] = useState(Array(64).fill(0));
    const [activeCell, setActiveCell] = useState(null);
    const [prevMove, setPrevMove] = useState({x: 0, y: 0});

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

    function callCellAction(e, index) {
        const clickedCell = boardStatus.getCellByIndex(index);

        if (activeCell !== null && validMoves[index] > 0) {
            boardStatus.makeMove(activeCell, index);
            setActiveCell(index);
            ClearValidMoves();
        } else if (clickedCell.figure && clickedCell.figure.color === boardStatus.getCurrentPlayerColor()) {
            if (activeCell === index) {
                ClearValidMoves();
                setPrevMove(prev => ({...prev, x: e.target.x, y: e.target.y}));
                setActiveCell(null);
            } else {
                setPrevMove(prev => ({...prev, x: e.target.x, y: e.target.y}));
                SetValidMovesByPices(clickedCell.figure);
                setActiveCell(index);
            }
        } else {
            ClearValidMoves();
            setActiveCell(null);
            setPrevMove(prev => ({...prev, x: e.target.x, y: e.target.y}));
        }
    }

    return (
        <div className={styles.board} onContextMenu={(e) => e.preventDefault()}>
            {boardStatus.getAllCells().map((cell, ind) => {
                return (
                    <Cell
                        key={`${ind}-cell`}
                        index={ind}
                        pices={props.pices}
                        value={cell}
                        validMoves={validMoves}
                        clickEvent={callCellAction}
                        prevMove={prevMove}
                        activeCell={activeCell}
                    />
                );
            })}
        </div>
    );
};
