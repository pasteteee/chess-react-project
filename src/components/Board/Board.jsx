import styles from "./Board.module.scss";
import { Cell } from "../Cell/Cell";
import BoardModel from "../../utils/Board";
import { useEffect, useState } from "react";

export const Board = (props) => {
    const [boardStatus] = useState(() => new BoardModel(props.startBoard));
    const [validMoves, setValidMoves] = useState(Array(64).fill(0));
    const [activeCell, setActiveCell] = useState(null);
    const [prevMove, setPrevMove] = useState({x: 0, y: 0});
    const [draggingMove, setDraggingMove] = useState(null);
    const isFlipped = props.isFlipped || false;

    useEffect(() => {
        if (draggingMove !== null)
            callCellAction({}, draggingMove)
    }, [draggingMove])

    function ClearValidMoves() {
        setValidMoves((...prev) => prev.map(() => 0));
    }

    function SetValidMovesByPices(figure) {
        if (figure == null) {
            ClearValidMoves();
            return;
        }

        // Используем getValidMoves для учета шаха
        let avaibleSteps = boardStatus.getValidMoves(figure);
        setValidMoves((...prev) => [...avaibleSteps]);
    }

    function callCellAction(e, index) {
        // Преобразуем индекс обратно, если доска перевернута
        const actualIndex = isFlipped ? (63 - index) : index;
        const clickedCell = boardStatus.getCellByIndex(actualIndex);

        // Преобразуем activeCell в реальный индекс для логики
        const actualActiveCell = activeCell !== null ? (isFlipped ? (63 - activeCell) : activeCell) : null;
        
        if (actualActiveCell !== null && validMoves[actualIndex] > 0) {
            const result = boardStatus.makeMove(actualActiveCell, actualIndex);
            
            if (result.success) {
                // Обрабатываем статус игры (шах, мат, пат)
                if (result.gameStatus) {
                    if (result.gameStatus.type === "checkmate") {
                        alert(`Мат! Победил ${result.gameStatus.winner === "white" ? "белый" : "черный"} игрок!`);
                    } else if (result.gameStatus.type === "stalemate") {
                        alert("Пат! Ничья!");
                    }
                    // Шах можно визуально отобразить через UI, но не обязательно показывать alert
                }
                
                setActiveCell(null);
                ClearValidMoves();
            } else {
                // Ход не удался - можно добавить визуальное отображение ошибки
                // Пока просто не выполняем действие
            }
        } else if (clickedCell && clickedCell.figure && clickedCell.figure.color === boardStatus.getCurrentPlayerColor()) {
            let el = e.target;
            try {
                if (el === e.currentTarget && el.children && el.children[1] && el.children[1].children && el.children[1].children[0]) {
                    el = el.children[1].children[0];
                }
                if (el && el.x !== undefined && el.y !== undefined) {
                    setPrevMove(prev => ({...prev, x: el.x, y: el.y}));
                } else {
                    setPrevMove({x: 0, y: 0});
                }
            } catch (error) {
                setPrevMove({x: 0, y: 0});    
            }
            SetValidMovesByPices(clickedCell.figure);
            // Сохраняем displayIndex для отображения
            setActiveCell(index);
        } else {
            ClearValidMoves();
            setActiveCell(null);
        }
    }

    // Переворачиваем индексы клеток для отображения, если доска перевернута
    const getDisplayIndex = (index) => {
        if (!isFlipped) return index;
        // Переворачиваем доску: индекс 0 становится 63, 1 становится 62, и т.д.
        return 63 - index;
    };

    return (
        <div 
            className={`${styles.board} ${isFlipped ? styles.flipped : ''}`} 
            onContextMenu={(e) => e.preventDefault()}
        >
            {boardStatus.getAllCells().map((cell, ind) => {
                const displayIndex = getDisplayIndex(ind);
                // Создаем массив validMoves для отображения: переворачиваем индексы
                const displayValidMoves = isFlipped 
                    ? validMoves.map((_, idx) => validMoves[63 - idx])
                    : validMoves;
                
                return (
                    <Cell
                        key={`${ind}-cell`}
                        index={displayIndex}
                        pices={props.pices}
                        value={cell}
                        validMoves={displayValidMoves}
                        clickEvent={callCellAction}
                        prevMove={prevMove}
                        activeCell={activeCell}
                        setDraggingMove={setDraggingMove}
                        isFlipped={isFlipped}
                    />
                );
            })}
        </div>
    );
};
