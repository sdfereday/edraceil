export const distance = (a, b) => {
    const _a = a.x - b.x;
    const _b = a.y - b.y;

    return Math.sqrt(_a * _a + _b * _b);
}