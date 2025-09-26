import { getCoordinates } from "./additional";

export class Figure {
    constructor(board, color, cell, index) {
        this.board = board;
        this.color = color;
        this.cell = cell; //
        this.index = index; //
        this.moving = color === "white" ? -1 : 1;

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
        this.x = this.cell.x;
        this.y = this.cell.y;
    }
}