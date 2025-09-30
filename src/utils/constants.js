import { Bishop, King, Knight, Pawn, Queen, Rook } from './figures';

export const picesValues = new Map([
    [1, Rook],
    [2, Knight],
    [3, Bishop],
    [4, Queen],
    [5, King],
    [6, Pawn],
    [0, null],
]);

export const defaultBoard = [
    [1, 2, 3, 4, 5, 3, 2, 1],
    [6, 6, 6, 6, 6, 6, 6, 6],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [13, 13, 13, 13, 13, 13, 13, 13],
    [8, 9, 10, 11, 12, 10, 9, 8],
];
