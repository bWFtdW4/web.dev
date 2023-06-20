/*
 * This script exports extended math operations.
 */


/*
 * Returns the result of multiplying the given arguments to one.
 * @return the product
 */
export function product () {
	let product = 1;

	for (const value of arguments)
		product *= value;

	return product;
}


/*
 * Returns the result of adding the given arguments to zero.
 * @return the sum
 */
export function sum () {
	let sum = 0;

	for (const value of arguments)
		sum += value;

	return sum;
}


/*
 * Returns the result of averaging the given arguments to zero.
 * @return the average
 */
export function average () {
	let sum = 0;

	for (const value of arguments)
		sum += value;

	return sum / arguments.length;
}
