import {Figure} from "../FigureClass.js";

export class Knight extends Figure {
    fullName = "Knight";
    sym = "n";
    weight = 3;

    setWays() {
        let array = new Array(64).fill(0);
        const{ x, y } = this.cell;

        const knightMoves = [
            {dx: 2, dy: 1}, {dx: 2, dy: -1},
            {dx: -2, dy: 1}, {dx: -2, dy: -1},
            {dx: 1, dy: 2}, {dx: 1, dy: -2},
            {dx: -1, dy: 2}, {dx: -1, dy: -2}
        ];

        knightMoves.forEach(move => {
            const newX = x + move.dx;
            const newY = y + move.dy;

            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const newIndex = newX * 8 + newY;
                const targetCell = this.board.getCellByIndex(newIndex);

                if (!targetCell) return;

                if (targetCell.figure === null) {
                    array[newIndex] = 1;
                }
                else if (targetCell.figure && targetCell.figure.color !== this.color) {
                    array[newIndex] = 2;
                }
            }
        });

        return array;
    }
}
