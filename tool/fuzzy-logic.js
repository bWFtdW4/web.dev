/*
 * This script exports fuzzy logic operations,
 * computing values within range [0, 1].
 */


/*
 * Returns the result of applying the fuzzy NOT operator to the given value.
 * @return the fuzzy inverse
 * @throws {RangeError} if the given values is out of range [0, 1] 
 */
export function fuzzyNot (value) {
	if (value < 0 || value > 1) throw new RangeError();
	return 1 - value;
}


/*
 * Returns the result of applying the fuzzy OR operator to the given values.
 * @return the fuzzy OR result
 * @throws {RangeError} if any of the given values is out of range [0, 1] 
 */
export function fuzzyOr () {
	for (const value of arguments)
		if (value < 0 || value > 1) throw new RangeError();

	const sum = Array.from(arguments).reduce((accu, value) => accu + value, 0);
	return sum / arguments.length;
}


/*
 * Returns the result of applying the fuzzy AND operator to the given values.
 * @return the fuzzy AND result
 * @throws {RangeError} if any of the given values is out of range [0, 1] 
 */
export function fuzzyAnd () {
	for (const value of arguments)
		if (value < 0 || value > 1) throw new RangeError();

	const product = Array.from(arguments).reduce((accu, value) => accu * value, 1);
	return product ** (1 / arguments.length);
}
