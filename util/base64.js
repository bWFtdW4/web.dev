
/**
 * Returns the result of base64-encoding the given text, after
 * converting it into an intermediate UTF-8 representation.
 * @param text {string} the text
 * @return {string} the base64-encoding of the given text
 */
export function encodeBase64 (text) {
	const bytes = new TextEncoder().encode(text);

	let utf8Text = "";
	for (const byte of bytes)
		utf8Text += String.fromCharCode(byte);

	return window.btoa(utf8Text);
}


/**
 * Returns the result of base64-decoding the given text, after
 * converting it from an intermediate UTF-8 representation.
 * @param text {string} the base64-encoded text
 * @return {string} the base64-decoding of the given text
 */
export function decodeBase64 (text) {
	const utf8Text = window.atob(text);

	const bytes = new Uint8Array(utf8Text.length);
	for (let index = 0; index < utf8Text.length; ++index)
		bytes[index] = utf8Text.charCodeAt(index);

	return new TextDecoder().decode(bytes);
}
