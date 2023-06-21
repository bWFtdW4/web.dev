/*
 * This script exports the Thing class.
 */

export default class Thing extends Object {
	static #myPrivateClassVariable = 16;
	static myPublicClassVariable = 42;
	
	#myPrivateInstanceVariable;
	myPublicInstanceVariable;


	constructor (value) {
		super();

		this.#myPrivateInstanceVariable = value;
		this.myPublicInstanceVariable = "Test";
	}


	toString () {
		return "(" + this.#myPrivateInstanceVariable + ", " + this.myPublicInstanceVariable + ")";
	}


	static createPublicSynchronousThing (value) {
		return this.#createPrivateSynchronousThing(value);
	}


	static async createPublicAsynchronousThing (value) {
		// return new Thing(value);
		return this.#createPrivateSynchronousThing(value);
	}


	static #createPrivateSynchronousThing (value) {
		return new Thing(value);
	}


	get myPrivateInstanceVariable () {
		return this.#myPrivateInstanceVariable;
	}


	set myPrivateInstanceVariable (value) {
		if (value == null) throw new RangeError();
		if (typeof value !== "string") throw new TypeError();

		this.#myPrivateInstanceVariable = value;
	}
}
