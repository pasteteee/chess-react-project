/**
 * Утилиты для расчета ходов фигур
 * Убираем дублирование кода для фигур с линейным движением
 */

export const calculateLinearMoves = (figure, directions, maxSteps = 8) => {
    let array = new Array(64).fill(0);
    const { x, y } = figure.cell;

    directions.forEach(dir => {
        for (let i = 1; i <= maxSteps; i++) {
            const newX = x + dir.dx * i;
            const newY = y + dir.dy * i;

            // Проверка выхода за границы доски
            if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;

            const newIndex = newX * 8 + newY;
            const targetCell = figure.board.getCellByIndex(newIndex);

            if (!targetCell) break;

            if (targetCell.figure === null) {
                // Пустая клетка - можно ходить
                array[newIndex] = 1;
            } else if (targetCell.figure.color !== figure.color) {
                // Клетка с вражеской фигурой - можно бить
                array[newIndex] = 2;
                break; // Прерываем движение в этом направлении
            } else {
                // Клетка с своей фигурой - нельзя ходить дальше
                break;
            }
        }
    });

    return array;
};

export const calculatePointMoves = (figure, moves) => {
    let array = new Array(64).fill(0);
    const { x, y } = figure.cell;

    moves.forEach(move => {
        const newX = x + move.dx;
        const newY = y + move.dy;

        // Проверка выхода за границы доски
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            const newIndex = newX * 8 + newY;
            const targetCell = figure.board.getCellByIndex(newIndex);

            if (!targetCell) return;

            if (targetCell.figure === null) {
                // Пустая клетка
                array[newIndex] = 1;
            } else if (targetCell.figure.color !== figure.color) {
                // Вражеская фигура - можно бить
                array[newIndex] = 2;
            }
            // Своя фигура - оставляем 0 (нельзя ходить)
        }
    });

    return array;
};