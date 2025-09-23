import { getCoordinates } from "./additional";

export class Figure {
    constructor(board, color, cell, index) {
        this.board = board;
        this.color = color;
        this.cell = cell; //
        this.index = index; //
        this.moving = color == "white" ? -1 : 1;

        this.x = cell.x;
        this.y = cell.y;
    }

    stepTo(index) {
        const { x, y } = getCoordinates(index);
        const currentCoords = getCoordinates(this.index);

        this.board.boardMatrix[x][y].figure = this;
        this.board.boardMatrix[currentCoords.x][currentCoords.y].figure = null;

        this.cell = this.board.boardMatrix[x][y];
        this.index = index;
    }
}

const checkBarier = (index) => index >= 0 && index < 64;



// array [64] : 0 - nothing,
// 1 - step, 2 - capture, 3 - enPassant, 4 - castle






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

export class Bishop extends Figure {
    fullName = "Bishop";
    sym = "b";
    weight = 3;

    setWays() {
        let array = new Array(64).fill(0);
        const { x, y } = this.cell;

        const directions = [
            {dx: 1, dy: 1},
            {dx: 1, dy: -1},
            {dx: -1, dy: 1},
            {dx: -1, dy: -1}
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
}

export class Queen extends Figure {
    fullName = "Queen";
    sym = "q";
    weight = 9;

    setWays() {
        let array  = new Array(64).fill(0);
        const{ x, y } = this.cell;

        const directions = [
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
            {dx: 0, dy: 1},
            {dx: 0, dy: -1},
            {dx: 1, dy: -1},
            {dx: -1, dy: -1},
            {dx: 1, dy: 1},
            {dx: -1, dy: 1}
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
}

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