/*
 * This script exports asynchronous demo operations.
 */
export async function asyncNameA (a, b, c) { return a + b + c; }
export const asyncNameB = async function (a, b, c) { return a + b + c; };
export const asyncNameC = async (a, b, c) => { return a + b + c; };
export const asyncNameD = async (a, b, c) => a + b + c;

export function quasiAsyncNameE (a, b, c) {
	return new Promise((resolve, reject) => {
		if (a == null || b == null || c == null)
			reject(new RangeError());
		else
			resolve(a + b + c);
	});
}