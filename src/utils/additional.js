export const createNumArr = (n) => Array(n).fill(false);

export const getCoordinates = (n) => {
    return { x: Math.floor(n / 8), y: n % 8 };
};

export const getIndexByCoord = ({ x, y }) => {
    return x * 8 + y;
};

export const getCoordinatesSum = (n) => {
    const value = getCoordinates(n);
    return value.x + value.y;
};
