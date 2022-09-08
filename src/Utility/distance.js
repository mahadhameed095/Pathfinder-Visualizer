const euclideanDistance = (target, source) => Math.sqrt(Math.pow(target[0] - source[0], 2) + Math.pow(target[1] - source[1], 2));
const manhattanDistance = (target, source) => Math.abs(target[0] - source[0]) + Math.abs(target[1] - source[1]);

export { euclideanDistance, manhattanDistance};