import {Figure} from "../FigureClass.js";

export class King extends Figure {
    fullName = "King";
    sym = "k";
    weight = -1;
    hasMoved = false;

    setWays() {
        let array = new Array(64).fill(0);
        const{ x, y } = this.cell;

        const kingsMoves = [
            {dx: 1, dy: 1}, {dx: 1, dy: -1},
            {dx: 1, dy: 0}, {dx: 0, dy: -1},
            {dx: 0, dy: 1}, {dx: -1, dy: -1},
            {dx: -1, dy: 0}, {dx: -1, dy: 1}
        ];

        kingsMoves.forEach(move => {
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

        if (!this.hasMoved) {
            if (this.canCastle(7, [5, 6])) {
                array[x * 8 + 6] = 4;
            }

            if (this.canCastle(0, [1, 2, 3])) {
                array[x * 8 + 2] = 4;
            }
        }

        return array;
    }

    canCastle(rookY, squaresBetween) {
        const { x, y } = this.cell;

        const rookCell = this.board.getCellByIndex(x * 8 + rookY);
        if (!rookCell || !rookCell.figure ||
            !(rookCell.figure instanceof Rook) ||
            rookCell.figure.color !== this.color ||
            rookCell.figure.hasMoved) {
            return false;
        }

        for (const squareY of squaresBetween) {
            const cellBetween = this.board.getCellByIndex(x * 8 + squareY);
            if (cellBetween && cellBetween.figure !== null) {
                return false;
            }
        }

        return true;
    }

    stepTo(index) {
        const { x: newX, y: newY } = getCoordinates(index);
        const { x: currentX, y: currentY } = this.cell;

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
            rookStartY = 7;
            rookTargetY = 5;
        } else {
            rookStartY = 0;
            rookTargetY = 3;
        }

        const kingTargetCell = this.board.getCellByIndex(kingTargetIndex);
        kingTargetCell.figure = this;
        this.cell.figure = null;

        this.cell = kingTargetCell;
        this.index = kingTargetIndex;
        this.x = kingX;
        this.y = kingY;

        const rookStartCell = this.board.getCellByIndex(currentX * 8 + rookStartY);
        const rookTargetCell = this.board.getCellByIndex(currentX * 8 + rookTargetY);
        const rook = rookStartCell.figure;

        rookTargetCell.figure = rook;
        rookStartCell.figure = null;

        rook.cell = rookTargetCell;
        rook.index = currentX * 8 + rookTargetY;
        rook.x = currentX;
        rook.y = rookTargetY;
        rook.hasMoved = true;

        this.hasMoved = true;
    }
}