/*
 * Semi-abstract controller type.
 * Copyright (c) 2015 Sascha Baumeister
 */
export default class Controller extends EventTarget {
	static #sessionOwner = null;

	#active;


	/*
	 * Initializes a new instance.
	 */
	constructor () {
		super();

		this.#active = false;
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
	 */
	activate () {
		throw new InternalError("method should be overriden!");
	}


	/*
	 * Deactivates this controller.
	 */
	deactivate () {
	}


	/*
	 * Displays the given object in the footer's message area,
	 * or resets it if none is given.
	 * @param error {Object} the optional error or string, or null
	 */
	static displayMessage (object) {
		const output = document.querySelector("footer output.message");
		if (object) {
			console.error(object);
			output.value = object instanceof Error ? object.message : "" + object;
		} else {
			output.value = "";
		}
	}
}
