import { getCoordinates } from "./additional";
import { picesValues } from "./constants";

export default class BoardModel {
    constructor(pattern) {
        this.boardMatrix = Array(64).fill(null);
        this.boardMatrix.map((cell, i) => {
            let { x, y } = getCoordinates(i);
            this.boardMatrix[i] = new Cell(
                this,
                x,
                y,
                pattern[x][y] < 7 ? "black" : "white",
                picesValues.get(pattern[x][y] % 7)
            );
        });
    }

    getCellByIndex(n) {
        return this.boardMatrix[n];
    }

    getCellByCoord(coord) {
        return this.boardMatrix[getIndexByCoord(coord)];
    }

    isNotFigure(index) {
        return this.boardMatrix[index].figure == null;
    }
}

export class Cell {
    constructor(board, x, y, color, figure) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.color = (x + y) % 2 ? "black" : "white";
        this.figure = figure ? new figure(board, color, this, x * 8 + y) : null;
    }
}
