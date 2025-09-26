import { Figure } from "../FigureClass.js";
import { calculateLinearMoves } from "./figureUtils.js";

/**
 * Класс, представляющий ладью в шахматах
 * Наследуется от базового класса Figure
 * Ладья ходит по горизонтали и вертикали на любое количество клеток
 */
export class Rook extends Figure {
    fullName = "Rook";
    sym = "r";
    weight = 5;
    // Флаг, указывающий, двигалась ли ладья (нужен для рокировки)
    hasMoved = false;

    /**
     * Метод для расчета возможных ходов ладьи
     * @returns {Array} Массив из 64 элементов, где:
     *                  0 - ход невозможен
     *                  1 - можно ходить на пустую клетку
     *                  2 - можно бить вражескую фигуру
     */
    setWays() {
        const directions = [
            {dx: 1, dy: 0},   // Вправо (увеличение по X)
            {dx: -1, dy: 0},  // Влево (уменьшение по X)
            {dx: 0, dy: 1},   // Вверх (увеличение по Y)
            {dx: 0, dy: -1}   // Вниз (уменьшение по Y)
        ];

        // Используем общую функцию для расчета линейных ходов
        return calculateLinearMoves(this, directions);
    }

    /**
     * Метод для выполнения хода ладьей
     * @param {number} index - индекс целевой клетки на доске (0-63)
     */
    stepTo(index) {
        super.stepTo(index);
        this.hasMoved = true;
    }
}