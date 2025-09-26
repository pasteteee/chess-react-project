import {Figure} from "../FigureClass.js";

export class Rook extends Figure {
    fullName = "Rook";
    sym = "r";
    weight = 5;
    hasMoved = false;

    setWays() {
        let array  = new Array(64).fill(0);
        const{ x, y } = this.cell;

        const directions = [
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
            {dx: 0, dy: 1},
            {dx: 0, dy: -1}
        ];

        directions.forEach(dir => {
            for (let i = 1; i < 8; i++) {
                const newX = x + dir.dx * i;
                const newY = y + dir.dy * i;

                if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;

                const newIndex = newX * 8 + newY;
                const targetCell = this.board.getCellByIndex(newIndex);

                if (!targetCell) break;

                if (targetCell.figure === null) {
                    array[newIndex] = 1;
                } else if (targetCell.figure.color !== this.color) {
                    array[newIndex] = 2;
                    break;
                } else {
                    break;
                }
            }
        });

        return array;
    }

    stepTo(index) {
        super.stepTo(index);
        this.hasMoved = true;
    }
}