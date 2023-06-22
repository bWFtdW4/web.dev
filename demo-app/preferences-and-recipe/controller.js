/*
 * Quasi-abstract supertype for controller classes.
 */
export default class Controller extends Object {
	#centerArticle;
	#messageElement;

	constructor () {
		super();

		this.#centerArticle = document.querySelector("main > article.center");
		this.#messageElement = document.querySelector("footer > output.message");
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
