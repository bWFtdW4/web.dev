import { product, sum, average } from "./extended-math.js";
import { fuzzyNot, fuzzyOr, fuzzyAnd } from "../../util/fuzzy-logic.js";


window.addEventListener("load", event => {
	const centerArticle = document.querySelector("main > article.center");
	const preformattedElement = centerArticle.querySelector("pre");

	preformattedElement.append("Hello World!\n");
	preformattedElement.prepend("Aloha!\n\n");

	const a1 = "2" + "2";
	const a2 = "22";
	const b1 = 22;
	const b2 = 22;
	const c1 = true;
	const c2 = false;
	preformattedElement.append("a1 == b1: " + (a1 == b1) + "\n");
	preformattedElement.append("a1 === b1: " + (a1 === b1) + "\n\n");

	preformattedElement.append("a1 === a2: " + (a1 === a2) + "\n");
	preformattedElement.append("Object.is(a1, a2): " + Object.is(a1, a2) + "\n");
	preformattedElement.append("b1 === b2: " + (b1 === b2) + "\n");
	preformattedElement.append("Object.is(b1, b2): " + Object.is(b1, b2) + "\n\n");

	const array = [ "abc", true, 42 ];
	const map = { "look": "schau", "run": false, "sleep": 42 };
	preformattedElement.append("array: " + array + "\n");
	preformattedElement.append("array: " + JSON.stringify(array) + "\n");
	preformattedElement.append("map: " + JSON.stringify(map) + "\n\n");

	preformattedElement.append("array[1] = '16 tons': " + (array[1] = "16 tons") + "\n");
	preformattedElement.append("array[1]: " + array[1] + "\n");
	preformattedElement.append("map['sleep'] = true: " + (map["sleep"] = true) + "\n");
	preformattedElement.append("map['sleep']: " + map["sleep"] + "\n");

	const x01 = c1 && c2;
	const x02 = c1 && "abc";
	const x03 = c2 && "abc";
	const x04 = c1 || c2;
	const x05 = c1 || "abc";
	const x06 = c2 || "abc";
	const x07 = "abc" || null;
	const x08 = null || "abc";
	const x09 = undefined || "abc";
	const x10 = "" || "abc";
	const x11 = 0 || "abc";
	const x12 = 0.1 || 0.9;
	preformattedElement.append([ x01, x02, x03, x04, x05, x06, x07, x08, x09, x10, x11, x12 ] + "\n\n");

	// for-index
	for (let index = 0; index < array.length; ++index) {
		preformattedElement.append(array[index] + "\n");
	}

	// for-each variant 1
	for (const value of array) {
		preformattedElement.append(value + "\n");
	}

	// for-each variant 2
	for (const key in map) {
		preformattedElement.append(key + ": " + map[key] + "\n");
	}
	preformattedElement.append("\n");

	const functor = (l, r) => l + r;
	preformattedElement.append(functor(3, 4) + "\n\n");

	preformattedElement.append("sum: " + sum(1, 2, null, 4, true, 6, "abc", 8, 9) + "\n");
	preformattedElement.append("product: " + product(1, 2, 3, 4, true, 6, "7", 8, 9) + "\n\n");

	preformattedElement.append("fuzzyNot(0.75): " + fuzzyNot(0.75) + "\n");
	preformattedElement.append("fuzzyOr(0, 0): " + fuzzyOr(0, 0) + "\n");
	preformattedElement.append("fuzzyOr(1, 1): " + fuzzyOr(1, 1) + "\n");
	preformattedElement.append("fuzzyOr(0, 1): " + fuzzyOr(0, 1) + "\n");
	preformattedElement.append("fuzzyOr(0, 0, 0, 1): " + fuzzyOr(0, 0, 0, 1) + "\n");
	preformattedElement.append("fuzzyAnd(0, 0): " + fuzzyAnd(0, 0) + "\n");
	preformattedElement.append("fuzzyAnd(1, 1): " + fuzzyAnd(1, 1) + "\n");
	preformattedElement.append("fuzzyAnd(0, 1): " + fuzzyAnd(0, 1) + "\n");
	preformattedElement.append("fuzzyAnd(0, 1, 1, 1): " + fuzzyAnd(0, 1, 1, 1) + "\n");
	preformattedElement.append("fuzzyAnd(0.1, 0.9, 0.9, 0.9): " + fuzzyAnd(0.1, 0.9, 0.9, 0.9) + "\n");

});
