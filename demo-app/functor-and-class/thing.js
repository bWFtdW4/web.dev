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

		this.#myPrivateInstanceVariable = "Test";
		this.myPublicInstanceVariable = value;
	}


	toString () {
		return "(" + this.#myPrivateInstanceVariable + ", " + this.myPublicInstanceVariable + ")";
	}


	static createPublicSynchronousThing (value) {
		return new Thing(value);
	}


	static async createPublicAsynchronousThing (value) {
		return new Thing(value);
	}
}
