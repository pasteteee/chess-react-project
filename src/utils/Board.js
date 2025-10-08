import { getCoordinates } from "./additional";
import { picesValues } from "./constants";
import { Bishop, King, Knight, Pawn, Queen, Rook } from './figures';

export default class BoardModel {
    constructor(pattern) {
        this.boardMatrix = Array(8).fill().map(() => Array(8).fill(null));
        this.currentPlayer = "white";
        this.moveHistory = [];
        this.moveCount = 0;

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const pieceValue = pattern[x][y];
                const pieceType = pieceValue % 7;
                const pieceColor = pieceValue < 7 ? "black" : "white";

                this.boardMatrix[x][y] = new Cell(
                    this,
                    x,
                    y,
                    pieceColor,
                    picesValues.get(pieceType)
                );
            }
        }
    }

    getCellByIndex(n) {
        let { x, y } = getCoordinates(n);
        return this.getCell(x, y);
    }

    getCellByCoord(coord) {
        return this.getCell(coord.x, coord.y);
    }

    getCell(x, y) {
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            return this.boardMatrix[x][y];
        }
        return null;
    }

    isNotFigure(index) {
        const cell = this.getCellByIndex(index);
        return cell && cell.figure == null;
    }

    getAllCells() {
        return this.boardMatrix.flat();
    }

    getCurrentPlayerColor() {
        return this.currentPlayer;
    }

    makeMove(fromIndex, toIndex) {
        const fromCell = this.getCellByIndex(fromIndex);
        const toCell = this.getCellByIndex(toIndex);

        if (!fromCell || !fromCell.figure) {
            return { success: false, message: "Нет фигуры для хода" };
        }

        if (fromCell.figure.color !== this.currentPlayer) {
            return { success: false, message: "Сейчас ход другого игрока" };
        }

        const validMoves = fromCell.figure.setWays();

        if (validMoves[toIndex] === 0) {
            return { success: false, message: "Недопустимый ход" };
        }

        this.clearAllEnPassantTargets();

        const moveInfo = {
            from: fromIndex,
            to: toIndex,
            piece: fromCell.figure.constructor.name,
            color: this.currentPlayer,
            moveNumber: this.moveCount + 1,
            capturedPiece: toCell.figure ? toCell.figure.constructor.name : null
        };

        fromCell.figure.stepTo(toIndex);

        this.moveHistory.push(moveInfo);
        this.moveCount++;

        this.switchPlayer();

        return { success: true, message: "Ход выполнен", move: moveInfo };
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    }

    getCurrentMoveNumber() {
        return this.moveCount;
    }

    findKing(color){
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let cell = this.boardMatrix[x][y];
                if (cell.figure && cell.figure.color === color && cell.figure instanceof King) {
                    return cell;
                }
            }
        }
    }

    // Проверка на мат (базовая реализация)
    //isCheckmate(color) {
        // Реализовать проверку мата
        //return false;
    //}

    // Очистка целей взятия на проходе для всех пешек
    clearAllEnPassantTargets() {
        this.getAllCells().forEach(cell => {
            if (cell.figure && cell.figure.enPassantTarget !== undefined && cell.figure.color === this.currentPlayer) {
                cell.figure.clearEnPassantTarget();
            }
        });
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