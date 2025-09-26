import { Figure } from "../FigureClass.js";
import { calculatePointMoves } from "./figureUtils.js";
import { Rook } from "./Rook.js";

// Вспомогательная функция для получения координат из индекса
function getCoordinates(index) {
    const x = Math.floor(index / 8);
    const y = index % 8;
    return { x, y };
}

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
        for (const squareY of squaresBetween.filter(y => y !== 1 && y !== 2)) {
            if (this.isSquareUnderAttack(x, squareY)) {
                return false;
            }
        }

        return true;
    }

    isInCheck() {
        return this.isSquareUnderAttack(this.cell.x, this.cell.y);
    }

    isSquareUnderAttack(x, y) {
        // Здесь должна быть логика проверки, атакована ли клетка
        // Пока возвращаем false для простоты
        // TODO: Реализовать проверку шахов
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