/*
 * This script exports synchronous demo operations.
 */
export function syncNameA (a, b, c) { return a + b + c; }
export const syncNameB = function (a, b, c) { return a + b + c; };
export const syncNameC = (a, b, c) => { return a + b + c; };
export const syncNameD = (a, b, c) => a + b + c;
