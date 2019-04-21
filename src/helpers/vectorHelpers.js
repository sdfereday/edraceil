export const normalize = (point, scale) => {
    var norm = Math.sqrt(point.x * point.x + point.y * point.y);
    if (norm != 0) { // as3 return 0,0 for a point of zero length
        point.x = scale * point.x / norm;
        point.y = scale * point.y / norm;
    }
    return {
        nx: point.x,
        ny: point.y
    };
}