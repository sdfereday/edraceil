export const isOverlapping = (a, b) => {
    // circle vs. circle collision detection
    // TODO: Do we not also need height?
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < a.radius + b.width;
}