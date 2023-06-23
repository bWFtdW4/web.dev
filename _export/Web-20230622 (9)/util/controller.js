/*
 * Semi-abstract controller type.
 * Copyright (c) 2015 Sascha Baumeister
 */
export default class Controller extends EventTarget {
	static #sessionOwner = null;

	#centerArticle;
	#messageElement;
	#active;


	/*
	 * Initializes a new instance.
	 */
	constructor () {
		super();

		this.#centerArticle = document.querySelector("main > article.center");
		this.#messageElement = document.querySelector("footer > output.message");
		this.#active = false;
	}


	/*
	 * Getter for the centerArticle property.
	 */
	get centerArticle () {
		return this.#centerArticle;
	}


	/*
	 * Getter for the messageElement property.
	 */
	get messageElement () {
		return this.#messageElement;
	}


	/*
	 * Getter for the active property.
	 */
	get active () {
		return this.#active;
	}


	/*
	 * Setter for the active property.
	 */
	set active (value) {
		if (typeof value !== "boolean") throw new TypeError(value);
		if (value === this.#active) return;

		this.#active = value;

		if (value) this.activate();
		else this.deactivate();
	}


	/*
	 * Getter for the shared sessionOwner property.
	 */
	get sessionOwner () {
		return Controller.#sessionOwner;
	}


	/*
	 * Setter for the shared sessionOwner property.
	 */
	set sessionOwner (value) {
		if (value != null && typeof value !== "object") throw new TypeError();
		Controller.#sessionOwner = value;
	}


	/*
	 * Activates this controller.
	 * Throws an error by default, and must be overridden.
	 */
	activate () {
		throw new InternalError("method should be overriden!");
	}


	/*
	 * Deactivates this controller.
	 * Does nothing by default, but can optionally be overridden.
	 */
	deactivate () {
	}
}
