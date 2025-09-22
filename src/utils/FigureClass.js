export class Figure {
    constructor(board, color, cell, index) {
        this.board = board;
        this.color = color;
        this.cell = cell; //
        this.index = index; //
        this.moving = color == "white" ? -1 : 1;
    }

    stepTo(index) {
        this.board.boardMathx[index].figure = this;
        this.board.boardMathx[this.index].figure = null;
        this.cell = this.board.boardMathx[index];
        this.index = index;
    }
}

const checkBarier = (index) => index >= 0 && index < 64;

export class Rook extends Figure {
    fullName = "Rook";
    sym = "r";
    weight = 5;

    setWays(array) {
        // array [64] : 0 - nothing,
        // 1 - step, 2 - castle, 3 -
    }
}

export class Knight extends Figure {
    fullName = "Knight";
    sym = "n";
    weight = 3;
}

export class Bishop extends Figure {
    fullName = "Bishop";
    sym = "b";
    weight = 3;
}

export class Queen extends Figure {
    fullName = "Queen";
    sym = "q";
    weight = 9;
}

export class King extends Figure {
    fullName = "King";
    sym = "k";
    weight = -1;

    // Create new function
}

export class Pawn extends Figure {
    fullName = "Pawn";
    sym = "p";
    weight = 1;
    isDoubleMove = false;

    setWays() {
        let array = new Array(64).fill(0);

        let ind = this.index + 8 * this.moving;
        if (checkBarier(ind) && this.board.isNotFigure(ind)) {
            array[ind] = 1;

            ind = this.index + 16 * this.moving;
            array[ind] = checkBarier(ind) && this.board.isNotFigure(ind) && 1;
        }

        // Check for enemy left and right

        // Check for enemy pawn

        return array;
    }
}
