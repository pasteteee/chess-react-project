import { Figure } from "../FigureClass.js";
import { calculateLinearMoves } from "./figureUtils.js";

/**
 * Класс, представляющий слона в шахматах
 * Наследуется от базового класса Figure
 * Слон ходит по диагонали на любое количество клеток
 * Каждый слон остается на клетках своего цвета всю игру
 */
export class Bishop extends Figure {
    fullName = "Bishop";
    sym = "b";
    weight = 3;

    /**
     * Метод для расчета возможных ходов слона
     * @returns {Array} Массив из 64 элементов, где:
     *                  0 - ход невозможен
     *                  1 - можно ходить на пустую клетку
     *                  2 - можно бить вражескую фигуру
     */
    setWays() {
        const directions = [
            {dx: 1, dy: -1},   // Вправо-вниз
            {dx: -1, dy: -1},  // Влево-вниз
            {dx: 1, dy: 1},    // Вправо-вверх
            {dx: -1, dy: 1}    // Влево-вверх
        ];

        // Используем общую функцию для расчета линейных ходов
        return calculateLinearMoves(this, directions);
    }
}