import { Figure } from "../FigureClass.js";

/**
 * Класс, представляющий пешку в шахматах
 * Наследуется от базового класса Figure
 * Пешка имеет особые правила движения: ходит вперед, бьет по диагонали,
 * может делать двойной ход с начальной позиции и взятие на проходе
 */
export class Pawn extends Figure {
    fullName = "Pawn";
    sym = "p";
    weight = 1;
    // Флаг первого хода пешки (для возможности двойного хода)
    isFirstMove = true;
    // Цель для взятия на проходе (если пешка сделала двойной ход)
    enPassantTarget = null;

    /**
     * Метод для расчета возможных ходов пешки
     * @returns {Array} Массив из 64 элементов, где:
     *                  0 - ход невозможен
     *                  1 - можно ходить на пустую клетку
     *                  2 - можно бить вражескую фигуру
     */
    setWays() {
        let array = new Array(64).fill(0);
        const { x, y } = this.cell;

        // Движение вперед на одну клетку
        let newX = x + this.moving; // this.moving определяет направление (1 для белых, -1 для черных)
        if (newX >= 0 && newX < 8) {
            const forwardIndex = newX * 8 + y;
            const forwardCell = this.board.getCellByIndex(forwardIndex);

            // Проверяем, что клетка перед пешкой пуста
            if (forwardCell && forwardCell.figure === null) {
                array[forwardIndex] = 1;

                // Двойной ход с начальной позиции
                if (this.isFirstMove) {
                    newX = x + (2 * this.moving);
                    if (newX >= 0 && newX < 8) {
                        const doubleIndex = newX * 8 + y;
                        const doubleCell = this.board.getCellByIndex(doubleIndex);
                        const intermediateIndex = (x + this.moving) * 8 + y;
                        const intermediateCell = this.board.getCellByIndex(intermediateIndex);

                        // Проверяем, что обе клетки перед пешкой пусты
                        if (doubleCell && doubleCell.figure === null &&
                            intermediateCell && intermediateCell.figure === null) {
                            array[doubleIndex] = 1;
                        }
                    }
                }
            }
        }

        const captureMoves = [
            {dx: this.moving, dy: 1},   // Вперед-вправо
            {dx: this.moving, dy: -1}   // Вперед-влево
        ];

        captureMoves.forEach(move => {
            const newX = x + move.dx;
            const newY = y + move.dy;

            // Проверяем границы доски
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const captureIndex = newX * 8 + newY;
                const targetCell = this.board.getCellByIndex(captureIndex);

                // Проверяем, есть ли вражеская фигура для взятия
                if (targetCell && targetCell.figure && targetCell.figure.color !== this.color) {
                    array[captureIndex] = 2;
                }

                // TODO: Добавить логику для взятия на проходе (en passant)
            }
        });

        return array;
    }

    /**
     * Метод для выполнения хода пешкой
     * @param {number} index - индекс целевой клетки на доске (0-63)
     */
    stepTo(index) {
        const targetCell = this.board.getCellByIndex(index);
        const currentCell = this.cell;

        if (!targetCell) return;

        // Определяем, является ли ход двойным (для взятия на проходе)
        const isDoubleMove = Math.abs(targetCell.x - currentCell.x) === 2;

        // Перемещаем пешку на новую клетку
        targetCell.figure = this;
        currentCell.figure = null;

        // Обновляем координаты пешки
        this.cell = targetCell;
        this.index = index;
        this.x = targetCell.x;
        this.y = targetCell.y;

        // Сбрасываем флаг первого хода
        this.isFirstMove = false;

        // Устанавливаем или сбрасываем цель для взятия на проходе
        if (isDoubleMove) {
            this.setEnPassantTarget();
        } else {
            this.clearEnPassantTarget();
        }

        // TODO: Добавить логику превращения пешки при достижении 8 горизонтали
    }

    /**
     * Устанавливает цель для взятия на проходе после двойного хода
     */
    setEnPassantTarget() {
        const { x, y } = this.cell;
        this.enPassantTarget = (x - this.moving) * 8 + y;
    }

    /**
     * Сбрасывает цель для взятия на проходе
     */
    clearEnPassantTarget() {
        this.enPassantTarget = null;
    }
}