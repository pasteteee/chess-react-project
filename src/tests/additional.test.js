import { getCoordinates } from '../utils/additional.js';

describe('getCoordinates', () => {
    test('should convert index to coordinates correctly', () => {
        // Угловые случаи
        expect(getCoordinates(0)).toEqual({ x: 0, y: 0 });
        expect(getCoordinates(63)).toEqual({ x: 7, y: 7 });

        // Крайние случаи по горизонтали
        expect(getCoordinates(7)).toEqual({ x: 0, y: 7 });
        expect(getCoordinates(56)).toEqual({ x: 7, y: 0 });

        // Произвольные случаи
        expect(getCoordinates(18)).toEqual({ x: 2, y: 2 });
        expect(getCoordinates(27)).toEqual({ x: 3, y: 3 });
        expect(getCoordinates(35)).toEqual({ x: 4, y: 3 });

        // Переход через строки
        expect(getCoordinates(8)).toEqual({ x: 1, y: 0 });
        expect(getCoordinates(15)).toEqual({ x: 1, y: 7 });
        expect(getCoordinates(16)).toEqual({ x: 2, y: 0 });
    });
});