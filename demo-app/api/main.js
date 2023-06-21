
window.addEventListener("load", event => {
	const centerArticle = document.querySelector("main > article.center");
	const preformattedElement = centerArticle.querySelector("pre");

	const value1 = Number.parseFloat("42a");
	const value2 = Number.parseFloat("42.3");
	const value3 = Number.parseInt("42a");
	const value4 = Number.parseInt("42.3");
	const value5 = Math.abs(-16);

	preformattedElement.append(value1 + "\n");
	preformattedElement.append(value2 + "\n");
	preformattedElement.append(value3 + "\n");
	preformattedElement.append(value4 + "\n");
	preformattedElement.append(value5 + "\n\n");

	const object = {x: 42, y: true, z: [1, 2, 3]};
	const json = JSON.stringify(object);
	preformattedElement.append(json + "\n");

	const objectClone = JSON.parse(json);
	preformattedElement.append((object === objectClone) + "\n\n");

	const array = [ -16, +42, 0, -1, +16, -42, +1 ];
	const arrayClone = Array.from(array);
	preformattedElement.append(JSON.stringify(array) + "\n");
	preformattedElement.append(JSON.stringify(arrayClone) + "\n");
	preformattedElement.append(typeof array + "\n");
	preformattedElement.append(typeof arrayClone + "\n");
	preformattedElement.append((array === arrayClone) + "\n\n");

	arrayClone.push(Math.PI);
	arrayClone.push(Math.E);
	preformattedElement.append(JSON.stringify(arrayClone) + "\n");
	
	arrayClone.pop();
	preformattedElement.append(JSON.stringify(arrayClone) + "\n");

	delete arrayClone[arrayClone.length - 1];
	preformattedElement.append(JSON.stringify(arrayClone) + "\n");
	arrayClone.pop();
	preformattedElement.append(JSON.stringify(arrayClone) + "\n");

	arrayClone.sort((left, right) => left == right ? 0 : (left < right ? -1 : +1));
	preformattedElement.append(JSON.stringify(arrayClone) + "\n");

	const cubes = array.map(value => value * value * value);
	preformattedElement.append(JSON.stringify(cubes) + "\n");

	const sum = cubes.reduce((accu, value) => accu + value, 0);
	preformattedElement.append("cubes-total: " + sum + "\n");

	const count = cubes.reduce((accu, value) => value < 0 ? accu + 1 : accu, 0);
	preformattedElement.append("strictly negative cubes: " + count + "\n");

});
