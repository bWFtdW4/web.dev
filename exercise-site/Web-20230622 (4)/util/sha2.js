
/*
 * Returns the quasi-unique SHA2 hash of the given value.
 * @param bitLength the hash bit length, as one of 256, 384, 512
 * @param value the value, either a Uint8Array or a string
 * @return {Promise} a promise resolving into the corresponding SHA2 hash code as a Uint8Array
 */
export async function sha2HashCode (bitLength, value) {
	if (bitLength !== 256 && bitLength !== 384 && bitLength !== 512) throw new RangeError();
	if (typeof value !== "string" && !(value instanceof Uint8Array)) throw new TypeError();

	const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(value);
	return new Uint8Array(await crypto.subtle.digest("SHA-" + bitLength, bytes));
}


/*
 * Returns the quasi-unique SHA2 hash of the given value.
 * @param bitLength the hash bit length, as one of 256, 384, 512
 * @param value the value, either a Uint8Array or a string
 * @return {Promise} a promise resolving into the hexadecimal text representation
 *			of the corresponding SHA2 hash code as a string
 */
export async function sha2HashText (bitLength, value) {
	const bytes = await sha2HashCode(bitLength, value);
	return Array.from(bytes).map(byte => byte.toString(16).padStart(2, "0")).join("");
}
