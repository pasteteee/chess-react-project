import { Figure } from "../FigureClass.js";
import { calculatePointMoves } from "./figureUtils.js";
import { Rook } from "./Rook.js";
import { Pawn } from "./Pawn.js";
import { getCoordinates } from "../additional.js";

export class King extends Figure {
    fullName = "King";
    sym = "k";
    weight = -1;
    hasMoved = false;

    setWays() {
        const kingMoves = [
            {dx: 1, dy: 1}, {dx: 1, dy: -1},
            {dx: 1, dy: 0}, {dx: 0, dy: -1},
            {dx: 0, dy: 1}, {dx: -1, dy: -1},
            {dx: -1, dy: 0}, {dx: -1, dy: 1}
        ];

        // Используем утилиту для базовых ходов короля
        let array = calculatePointMoves(this, kingMoves);

        // Проверка атакованы ли клетки на которые может походить король
        for (let i = 0; i < array.length; i++) {
            const { x, y } = getCoordinates(i);
            if(array[i] === 1 && this.isSquareUnderAttack(x, y, this.color)) {
                array[i] = 0;
            }
        }

        // Добавляем рокировку, если король не двигался
        if (!this.hasMoved && !this.isInCheck()) {
            // Короткая рокировка (вправо)
            if (this.canCastle(7, [5, 6])) {
                const { x } = this.cell;
                array[x * 8 + 6] = 4; // 4 - специальный код для рокировки
            }

            // Длинная рокировка (влево)
            if (this.canCastle(0, [1, 2, 3])) {
                const { x } = this.cell;
                array[x * 8 + 2] = 4; // 4 - специальный код для рокировки
            }
        }

        return array;
    }

    canCastle(rookY, squaresBetween) {
        const { x, y } = this.cell;

        // Проверяем, что ладья существует и не двигалась
        const rookCell = this.board.getCellByIndex(x * 8 + rookY);
        if (!rookCell || !rookCell.figure ||
            !(rookCell.figure instanceof Rook) ||
            rookCell.figure.color !== this.color ||
            rookCell.figure.hasMoved) {
            return false;
        }

        // Проверяем, что клетки между королем и ладьей пусты
        for (const squareY of squaresBetween) {
            const cellBetween = this.board.getCellByIndex(x * 8 + squareY);
            if (cellBetween && cellBetween.figure !== null) {
                return false;
            }
        }

        // Проверяем, что король не проходит через шах
        // Проверяем все клетки между королем и ладьей, включая целевую клетку короля
        for (const squareY of squaresBetween) {
            if (this.isSquareUnderAttack(x, squareY, this.color)) {
                return false;
            }
        }

        return true;
    }

    isInCheck() {
        // Используем текущую позицию короля напрямую
        return this.isSquareUnderAttack(this.cell.x, this.cell.y, this.color);
    }

    isSquareUnderAttack(x, y, defenderColor) {
        const attackerColor = defenderColor === "white" ? "black" : "white";

        // Проверяем атаки от всех фигур, включая короля
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = this.board.boardMatrix[i][j];
                if (cell.figure && cell.figure.color === attackerColor) {
                    // Для короля проверяем только соседние клетки (короли не могут быть рядом)
                    if (cell.figure instanceof King) {
                        const dx = Math.abs(i - x);
                        const dy = Math.abs(j - y);
                        if ((dx === 1 && dy <= 1) || (dx === 0 && dy === 1) || (dx === 1 && dy === 0)) {
                            return true;
                        }
                    } else if (cell.figure instanceof Pawn) {
                        // Пешки атакуют по диагонали вперед
                        // Для белой пешки (moving = -1): атакует клетки (x-1, y-1) и (x-1, y+1)
                        // Для черной пешки (moving = 1): атакует клетки (x+1, y-1) и (x+1, y+1)
                        const pawn = cell.figure;
                        const pawnX = i;
                        const pawnY = j;
                        const attackX = pawnX + pawn.moving; // Направление атаки пешки
                        
                        // Проверяем, находится ли целевая клетка на диагонали перед пешкой
                        if (attackX === x && Math.abs(pawnY - y) === 1) {
                            return true;
                        }
                    } else {
                        // Для остальных фигур используем setWays
                        const moves = cell.figure.setWays();
                        const targetIndex = x * 8 + y;

                        if (moves[targetIndex] === 2 || moves[targetIndex] === 1) { // 2 - код для атаки, 1 - код для хода
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    stepTo(index) {
        const { x: newX, y: newY } = getCoordinates(index);
        const { x: currentX, y: currentY } = this.cell;

        // Проверяем, это рокировка или обычный ход
        if (Math.abs(newY - currentY) === 2 && newX === currentX) {
            this.performCastle(index);
        } else {
            super.stepTo(index);
            this.hasMoved = true;
        }
    }

    performCastle(kingTargetIndex) {
        const { x: kingX, y: kingY } = getCoordinates(kingTargetIndex);
        const { x: currentX, y: currentY } = this.cell;

        const isKingside = kingY > currentY;

        let rookStartY, rookTargetY;

        if (isKingside) {
            // Короткая рокировка
            rookStartY = 7;
            rookTargetY = 5;
        } else {
            // Длинная рокировка
            rookStartY = 0;
            rookTargetY = 3;
        }

        // Перемещаем короля
        const kingTargetCell = this.board.getCellByIndex(kingTargetIndex);
        kingTargetCell.figure = this;
        this.cell.figure = null;

        this.cell = kingTargetCell;
        this.index = kingTargetIndex;
        this.x = kingX;
        this.y = kingY;

        // Перемещаем ладью
        const rookStartCell = this.board.getCellByIndex(currentX * 8 + rookStartY);
        const rookTargetCell = this.board.getCellByIndex(currentX * 8 + rookTargetY);
        const rook = rookStartCell.figure;

        if (rook && rook instanceof Rook) {
            rookTargetCell.figure = rook;
            rookStartCell.figure = null;

            rook.cell = rookTargetCell;
            rook.index = currentX * 8 + rookTargetY;
            rook.x = currentX;
            rook.y = rookTargetY;
            rook.hasMoved = true;
        }

        this.hasMoved = true;

        // Обновляем состояние доски
        if (this.board.onMoveComplete) {
            this.board.onMoveComplete();
        }
    }
}