import { Rook, Knight, Bishop, Queen, King, Pawn } from '../utils/FigureClass.js';
import { Board } from '../utils/Board.js';
import { getCoordinates } from '../utils/additional.js';

// Mock-объект для клетки
class MockCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.figure = null;
    }
}

// Mock-объект для доски
class MockBoard {
    constructor() {
        this.boardMatrix = this.createEmptyBoard();
    }

    createEmptyBoard() {
        const board = [];
        for (let i = 0; i < 8; i++) {
            board[i] = [];
            for (let j = 0; j < 8; j++) {
                board[i][j] = new MockCell(i, j);
            }
        }
        return board;
    }

    getCellByIndex(index) {
        const { x, y } = getCoordinates(index);
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            return this.boardMatrix[x][y];
        }
        return null;
    }
}

describe('Chess Figures Moves', () => {
    let board;

    beforeEach(() => {
        board = new MockBoard();
    });

    describe('Rook', () => {
        test('should move horizontally and vertically from center', () => {
            const cell = board.getCellByIndex(27); // центр доски (3,3)
            const rook = new Rook(board, 'white', cell, 27);
            cell.figure = rook;

            const moves = rook.setWays();

            // Проверяем горизонтальные ходы
            expect(moves[24]).toBe(1); // влево (3,0)
            expect(moves[31]).toBe(1); // вправо (3,7)

            // Проверяем вертикальные ходы
            expect(moves[3]).toBe(1);  // вверх (0,3)
            expect(moves[51]).toBe(1); // вниз (6,3)
        });

        test('should capture enemy pieces', () => {
            const cell = board.getCellByIndex(27);
            const rook = new Rook(board, 'white', cell, 27);
            cell.figure = rook;

            // Вражеская фигура справа
            const enemyCell = board.getCellByIndex(29);
            const enemy = new Pawn(board, 'black', enemyCell, 29);
            enemyCell.figure = enemy;

            const moves = rook.setWays();

            expect(moves[28]).toBe(1); // клетка перед врагом
            expect(moves[29]).toBe(2); // захват врага
            expect(moves[30]).toBe(0); // за врагом - заблокировано
        });
    });

    describe('Knight', () => {
        test('should move in L-shape from center', () => {
            const cell = board.getCellByIndex(27); // (3,3)
            const knight = new Knight(board, 'white', cell, 27);
            cell.figure = knight;

            const moves = knight.setWays();

            // Все возможные L-образные ходы из (3,3)
            const expectedMoves = [
                10, 12, // (1,2), (1,4)
                17, 21, // (2,1), (2,5)
                33, 37, // (4,1), (4,5)
                42, 44  // (5,2), (5,4)
            ];

            expectedMoves.forEach(index => {
                expect(moves[index]).toBe(1);
            });

            // Проверяем количество доступных ходов
            const availableMoves = moves.filter(move => move > 0).length;
            expect(availableMoves).toBe(8);
        });

        test('should capture enemy knights', () => {
            const cell = board.getCellByIndex(27);
            const knight = new Knight(board, 'white', cell, 27);
            cell.figure = knight;

            // Вражеская фигура на одном из возможных ходов
            const enemyCell = board.getCellByIndex(42);
            const enemy = new Pawn(board, 'black', enemyCell, 42);
            enemyCell.figure = enemy;

            const moves = knight.setWays();

            expect(moves[42]).toBe(2); // захват врага
        });
    });

    describe('Bishop', () => {
        test('should move diagonally from center', () => {
            const cell = board.getCellByIndex(27); // (3,3)
            const bishop = new Bishop(board, 'white', cell, 27);
            cell.figure = bishop;

            const moves = bishop.setWays();

            // Проверяем диагональные направления
            expect(moves[0]).toBe(1);  // верх-лево (0,0)
            expect(moves[9]).toBe(1);  // верх-право (1,1)
            expect(moves[18]).toBe(1); // (2,2)
            expect(moves[36]).toBe(1); // (4,4)
            expect(moves[45]).toBe(1); // (5,5)
            expect(moves[54]).toBe(1); // (6,6)
        });

        test('should be blocked by friendly pieces', () => {
            const cell = board.getCellByIndex(27);
            const bishop = new Bishop(board, 'white', cell, 27);
            cell.figure = bishop;

            // Союзная фигура на диагонали
            const friendlyCell = board.getCellByIndex(36);
            const friendly = new Pawn(board, 'white', friendlyCell, 36);
            friendlyCell.figure = friendly;

            const moves = bishop.setWays();

            expect(moves[36]).toBe(0); // не может ходить на клетку с союзником
            expect(moves[45]).toBe(0); // не может ходить через союзника
        });
    });

    describe('Queen', () => {
        test('should move in all directions', () => {
            const cell = board.getCellByIndex(27); // (3,3)
            const queen = new Queen(board, 'white', cell, 27);
            cell.figure = queen;

            const moves = queen.setWays();

            // Проверяем все направления
            expect(moves[24]).toBe(1); // горизонталь влево (3,0)
            expect(moves[31]).toBe(1); // горизонталь вправо (3,7)
            expect(moves[3]).toBe(1);  // вертикаль вверх (0,3)
            expect(moves[59]).toBe(1); // вертикаль вниз (7,3)
            expect(moves[0]).toBe(1);  // диагональ верх-лево (0,0)
            expect(moves[63]).toBe(1); // диагональ низ-право (7,7)
        });
    });

    describe('King', () => {
        test('should move one square in any direction', () => {
            const cell = board.getCellByIndex(27); // (3,3)
            const king = new King(board, 'white', cell, 27);
            cell.figure = king;

            const moves = king.setWays();

            const expectedMoves = [
                18, 19, 20, // (2,2), (2,3), (2,4)
                26, 28,     // (3,2), (3,4)
                34, 35, 36  // (4,2), (4,3), (4,4)
            ];

            expectedMoves.forEach(index => {
                expect(moves[index]).toBe(1);
            });

            // Не должен ходить дальше одной клетки
            expect(moves[11]).toBe(0); // (1,3) - слишком далеко
            expect(moves[43]).toBe(0); // (5,3) - слишком далеко
        });

        test('should be able to castle when conditions are met', () => {
            // Король на начальной позиции
            const kingCell = board.getCellByIndex(4); // (0,4)
            const king = new King(board, 'white', kingCell, 4);
            kingCell.figure = king;

            // Ладьи на начальных позициях
            const rookKingsideCell = board.getCellByIndex(7); // (0,7)
            const rookKingside = new Rook(board, 'white', rookKingsideCell, 7);
            rookKingsideCell.figure = rookKingside;

            const rookQueensideCell = board.getCellByIndex(0); // (0,0)
            const rookQueenside = new Rook(board, 'white', rookQueensideCell, 0);
            rookQueensideCell.figure = rookQueenside;

            const moves = king.setWays();

            // Проверяем возможность рокировки
            expect(moves[6]).toBe(4); // королевская рокировка (0,6)
            expect(moves[2]).toBe(4); // ферзевая рокировка (0,2)
        });
    });

    describe('Pawn', () => {
        test('white pawn should move forward', () => {
            const cell = board.getCellByIndex(48); // (6,0) - начальная позиция белой пешки
            const pawn = new Pawn(board, 'white', cell, 48);
            cell.figure = pawn;

            const moves = pawn.setWays();

            expect(moves[40]).toBe(1); // один шаг вперед (5,0)
            expect(moves[32]).toBe(1); // два шага на первом ходу (4,0)
        });

        test('black pawn should move downward', () => {
            const cell = board.getCellByIndex(8); // (1,0) - начальная позиция черной пешки
            const pawn = new Pawn(board, 'black', cell, 8);
            cell.figure = pawn;

            const moves = pawn.setWays();

            expect(moves[16]).toBe(1); // один шаг вперед (2,0)
            expect(moves[24]).toBe(1); // два шага на первом ходу (3,0)
        });

        test('pawn should capture diagonally', () => {
            const cell = board.getCellByIndex(35); // (4,3) - белая пешка
            const pawn = new Pawn(board, 'white', cell, 35);
            cell.figure = pawn;
            pawn.isFirstMove = false; // не первый ход

            // Вражеские фигуры по диагонали
            const enemyLeftCell = board.getCellByIndex(26); // (3,2)
            const enemyLeft = new Pawn(board, 'black', enemyLeftCell, 26);
            enemyLeftCell.figure = enemyLeft;

            const enemyRightCell = board.getCellByIndex(28); // (3,4)
            const enemyRight = new Pawn(board, 'black', enemyRightCell, 28);
            enemyRightCell.figure = enemyRight;

            const moves = pawn.setWays();

            expect(moves[26]).toBe(2); // захват слева
            expect(moves[28]).toBe(2); // захват справа
        });
    });

    describe('Figure movement execution', () => {
        test('should update position after move', () => {
            const startCell = board.getCellByIndex(27);
            const knight = new Knight(board, 'white', startCell, 27);
            startCell.figure = knight;

            const targetIndex = 42;
            knight.stepTo(targetIndex);

            expect(knight.index).toBe(targetIndex);
            expect(knight.x).toBe(5);
            expect(knight.y).toBe(2);
            expect(knight.cell).toBe(board.getCellByIndex(targetIndex));
            expect(startCell.figure).toBeNull();
        });

        test('rook should update hasMoved after moving', () => {
            const cell = board.getCellByIndex(0);
            const rook = new Rook(board, 'white', cell, 0);
            cell.figure = rook;

            expect(rook.hasMoved).toBe(false);
            rook.stepTo(3);
            expect(rook.hasMoved).toBe(true);
        });
    });
});