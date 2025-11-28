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

        // Получаем валидные ходы с учетом шаха
        const validMoves = this.getValidMoves(fromCell.figure);

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

        // Проверяем необходимость превращения пешки
        let needsPromotion = false;
        if (fromCell.figure instanceof Pawn && fromCell.figure.needsPromotion) {
            needsPromotion = true;
            // По умолчанию превращаем в ферзя, но можно изменить через promotePawn
            this.promotePawn(toIndex, Queen);
        }

        this.moveHistory.push(moveInfo);
        this.moveCount++;

        // Проверяем состояние игры после хода
        const nextPlayer = this.currentPlayer === "white" ? "black" : "white";
        let gameStatus = null;
        
        if (this.isCheckmate(nextPlayer)) {
            gameStatus = { type: "checkmate", winner: this.currentPlayer };
        } else if (this.isStalemate(nextPlayer)) {
            gameStatus = { type: "stalemate", winner: null };
        } else if (this.isInCheck(nextPlayer)) {
            gameStatus = { type: "check", color: nextPlayer };
        }

        this.switchPlayer();

        return { 
            success: true, 
            message: "Ход выполнен", 
            move: moveInfo,
            gameStatus: gameStatus,
            needsPromotion: needsPromotion
        };
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
        return null;
    }

    /**
     * Проверяет, находится ли король указанного цвета под шахом
     * @param {string} color - цвет короля ("white" или "black")
     * @returns {boolean} - true если король под шахом
     */
    isInCheck(color) {
        const kingCell = this.findKing(color);
        if (!kingCell || !kingCell.figure) {
            return false;
        }
        
        // Используем метод короля для проверки шаха
        if (kingCell.figure instanceof King) {
            return kingCell.figure.isInCheck();
        }
        
        return false;
    }

    /**
     * Проверяет, ставит ли ход короля под шах
     * @param {number} fromIndex - индекс начальной клетки
     * @param {number} toIndex - индекс целевой клетки
     * @returns {boolean} - true если ход ставит короля под шах
     */
    wouldMovePutKingInCheck(fromIndex, toIndex) {
        const fromCell = this.getCellByIndex(fromIndex);
        const toCell = this.getCellByIndex(toIndex);
        
        if (!fromCell || !fromCell.figure) {
            return true;
        }
        
        const movingPiece = fromCell.figure;
        const capturedPiece = toCell.figure;
        const originalFromFigure = fromCell.figure;
        const originalToFigure = toCell.figure;
        
        // Временно выполняем ход
        toCell.figure = movingPiece;
        fromCell.figure = null;
        
        // Обновляем координаты фигуры
        const { x: newX, y: newY } = getCoordinates(toIndex);
        movingPiece.cell = toCell;
        movingPiece.index = toIndex;
        movingPiece.x = newX;
        movingPiece.y = newY;
        
        // Проверяем, под шахом ли король после хода
        const inCheck = this.isInCheck(movingPiece.color);
        
        // Откатываем ход
        fromCell.figure = originalFromFigure;
        toCell.figure = originalToFigure;
        const { x: oldX, y: oldY } = getCoordinates(fromIndex);
        movingPiece.cell = fromCell;
        movingPiece.index = fromIndex;
        movingPiece.x = oldX;
        movingPiece.y = oldY;
        
        return inCheck;
    }

    /**
     * Получает все возможные ходы для фигуры с учетом шаха
     * @param {Figure} figure - фигура
     * @returns {Array} - массив валидных ходов
     */
    getValidMoves(figure) {
        const allMoves = figure.setWays();
        const validMoves = new Array(64).fill(0);
        const fromIndex = figure.index;
        
        for (let i = 0; i < 64; i++) {
            if (allMoves[i] > 0) {
                // Проверяем, не ставит ли этот ход короля под шах
                if (!this.wouldMovePutKingInCheck(fromIndex, i)) {
                    validMoves[i] = allMoves[i];
                }
            }
        }
        
        return validMoves;
    }

    /**
     * Проверяет, есть ли у игрока хотя бы один валидный ход
     * @param {string} color - цвет игрока
     * @returns {boolean} - true если есть хотя бы один валидный ход
     */
    hasValidMoves(color) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const cell = this.boardMatrix[x][y];
                if (cell.figure && cell.figure.color === color) {
                    const validMoves = this.getValidMoves(cell.figure);
                    if (validMoves.some(move => move > 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Проверяет, находится ли игрок в мате
     * @param {string} color - цвет игрока
     * @returns {boolean} - true если мат
     */
    isCheckmate(color) {
        if (!this.isInCheck(color)) {
            return false;
        }
        return !this.hasValidMoves(color);
    }

    /**
     * Проверяет, находится ли игрок в пате
     * @param {string} color - цвет игрока
     * @returns {boolean} - true если пат
     */
    isStalemate(color) {
        if (this.isInCheck(color)) {
            return false;
        }
        return !this.hasValidMoves(color);
    }

    /**
     * Превращает пешку в выбранную фигуру
     * @param {number} cellIndex - индекс клетки с пешкой
     * @param {Function} newFigureClass - класс новой фигуры (Queen, Rook, Bishop, Knight)
     * @returns {boolean} - true если превращение успешно
     */
    promotePawn(cellIndex, newFigureClass) {
        const cell = this.getCellByIndex(cellIndex);
        if (!cell || !cell.figure || !(cell.figure instanceof Pawn)) {
            return false;
        }

        const pawn = cell.figure;
        const color = pawn.color;
        const index = pawn.index;

        // Создаем новую фигуру
        const newFigure = new newFigureClass(this, color, cell, index);
        cell.figure = newFigure;

        return true;
    }

    /**
     * Проверяет, нуждается ли пешка в превращении
     * @param {number} cellIndex - индекс клетки
     * @returns {boolean} - true если пешка нуждается в превращении
     */
    needsPromotion(cellIndex) {
        const cell = this.getCellByIndex(cellIndex);
        if (cell && cell.figure && cell.figure instanceof Pawn) {
            return cell.figure.needsPromotion === true;
        }
        return false;
    }

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