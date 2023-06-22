/*
 * Quasi-abstract supertype for controller classes.
 */
export default class Controller extends Object {
	static #sessionOwner = null;

	#centerArticle;
	#messageElement;

	constructor () {
		super();

		this.#centerArticle = document.querySelector("main > article.center");
		this.#messageElement = document.querySelector("footer > output.message");
	}


	get sessionOwner () {
		return Controller.#sessionOwner;
	}


	set sessionOwner (value) {
		if (value !== null && typeof value !== "object") throw new TypeError();
		Controller.#sessionOwner = value;
	}


	get centerArticle () {
		return this.#centerArticle;
	}


	get messageElement () {
		return this.#messageElement;
	}


	activate () {
		throw new InternalError("method must be overriden!");
	}
}
