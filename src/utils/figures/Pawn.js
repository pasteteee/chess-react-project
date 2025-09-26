import {Figure} from "../FigureClass.js";

export class Pawn extends Figure {
    fullName = "Pawn";
    sym = "p";
    weight = 1;
    isFirstMove = true;
    enPassantTarget = null;

    setWays() {
        let array = new Array(64).fill(0);
        const { x, y } = this.cell;

        let newX = x + this.moving;
        if (newX >= 0 && newX < 8) {
            const forwardIndex = newX * 8 + y;
            const forwardCell = this.board.getCellByIndex(forwardIndex);

            if (forwardCell && forwardCell.figure === null) {
                array[forwardIndex] = 1;

                if (this.isFirstMove) {
                    newX = x + (2 * this.moving);
                    if (newX >= 0 && newX < 8) {
                        const doubleIndex = newX * 8 + y;
                        const doubleCell = this.board.getCellByIndex(doubleIndex);
                        const intermediateIndex = (x + this.moving) * 8 + y;
                        const intermediateCell = this.board.getCellByIndex(intermediateIndex);

                        if (doubleCell && doubleCell.figure === null &&
                            intermediateCell && intermediateCell.figure === null) {
                            array[doubleIndex] = 1;
                        }
                    }
                }
            }
        }

        const captureMoves = [
            {dx: this.moving, dy: 1},
            {dx: this.moving, dy: -1}
        ];

        captureMoves.forEach(move => {
            const newX = x + move.dx;
            const newY = y + move.dy;

            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const captureIndex = newX * 8 + newY;
                const targetCell = this.board.getCellByIndex(captureIndex);

                if (targetCell && targetCell.figure && targetCell.figure.color !== this.color) {
                    array[captureIndex] = 2;
                }
            }
        });

        return array;
    }

    stepTo(index) {
        const targetCell = this.board.getCellByIndex(index);
        const currentCell = this.cell;

        if (!targetCell) return;

        const isDoubleMove = Math.abs(targetCell.x - currentCell.x) === 2;

        targetCell.figure = this;
        currentCell.figure = null;

        this.cell = targetCell;
        this.index = index;
        this.x = targetCell.x;
        this.y = targetCell.y;

        this.isFirstMove = false;

        if (isDoubleMove) {
            this.setEnPassantTarget();
        } else {
            this.clearEnPassantTarget();
        }
    }

    setEnPassantTarget() {
        const { x, y } = this.cell;
        this.enPassantTarget = (x - this.moving) * 8 + y;
    }

    clearEnPassantTarget() {
        this.enPassantTarget = null;
    }
}
