import Controller from "../../../util/controller.js";


class IngredientTypesController extends Controller {
	#pageOffset;
	#pageSize;


	constructor () {
		super();

		this.#pageOffset = 0;
		this.#pageSize = 5;
	}


	activate () {
		console.log("ingredient types controller activating.");
		const sectionTemplate = document.querySelector("head > template.ingredient-types-view");
		const ingredientTypesSection = sectionTemplate.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(ingredientTypesSection);

		const backwardButton = ingredientTypesSection.querySelector("button.backward");
		const forwardButton = ingredientTypesSection.querySelector("button.forward");
		const createButton = ingredientTypesSection.querySelector("button.create");
		backwardButton.disabled = true;
		backwardButton.addEventListener("click", event => this.displayIngredientTypes(-this.#pageSize));
		forwardButton.addEventListener("click", event => this.displayIngredientTypes(+this.#pageSize));
		createButton.addEventListener("click", event => this.editIngredientType(null));

		this.#pageOffset = 0;
		this.displayIngredientTypes(0);
	}


	deactivate () {
		console.log("ingredient types controller deactivating.");
	}

	async displayIngredientTypes (pageOffset) {
		const ingredientTypesSection = this.centerArticle.querySelector("section.ingredient-types-view");
		this.#pageOffset += pageOffset;

		let ingredientTypes;
		this.messageElement.value = "";
		try {
			// GET /services/ingredient-types
			const parameterization = new URLSearchParams();
			parameterization.set("result-offset", this.#pageOffset);
			parameterization.set("result-size", this.#pageSize);

			const resource = "/services/ingredient-types?" + parameterization;
			const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" }});
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			ingredientTypes = await response.json();

			ingredientTypesSection.querySelector("button.backward").disabled = (this.#pageOffset < this.#pageSize);
			ingredientTypesSection.querySelector("button.forward").disabled = (ingredientTypes.length < this.#pageSize);
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
			return;
		}

		const ingredientTypesElement = ingredientTypesSection.querySelector("tbody");
		while (ingredientTypesElement.lastElementChild)
			ingredientTypesElement.lastElementChild.remove();

		const ingredientTypeRowTemplate = document.querySelector("head > template.ingredient-type-view-row");
		for (const ingredientType of ingredientTypes) {
			const ingredientTypeRow = ingredientTypeRowTemplate.content.firstElementChild.cloneNode(true);
			ingredientTypesElement.append(ingredientTypeRow);
			const avatarView = ingredientTypeRow.querySelector("img.avatar");

			avatarView.src = "/services/ingredient-types/" + ingredientType.identity + "/avatar?cache-bust=" + Date.now();
			ingredientTypeRow.querySelector("input.alias").value = ingredientType.alias;
			ingredientTypeRow.querySelector("input.pescatarian").checked = ingredientType.pescatarian;
			ingredientTypeRow.querySelector("input.lacto-ovo-vegetarian").checked = ingredientType.lactoOvoVegetarian;
			ingredientTypeRow.querySelector("input.lacto-vegetarian").checked = ingredientType.lactoVegetarian;
			ingredientTypeRow.querySelector("input.vegan").checked = ingredientType.vegan;

			avatarView.addEventListener("click", event => this.editIngredientType(ingredientType));
		}
	}


	editIngredientType (ingredientType) {
		const sectionTemplate = document.querySelector("head > template.ingredient-type-editor");
		const ingredientTypeSection = sectionTemplate.content.firstElementChild.cloneNode(true);

		while (!this.centerArticle.lastElementChild.classList.contains("ingredient-types-view"))
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(ingredientTypeSection);

		const submitButton = ingredientTypeSection.querySelector("button.submit");
		const avatarView = ingredientTypeSection.querySelector("img.avatar");
		const pescatarianBox = ingredientTypeSection.querySelector("input.pescatarian");
		const lactoOvoVegetarianBox = ingredientTypeSection.querySelector("input.lacto-ovo-vegetarian");
		const lactoVegetarianBox = ingredientTypeSection.querySelector("input.lacto-vegetarian");
		const veganBox = ingredientTypeSection.querySelector("input.vegan");

		submitButton.addEventListener("click", event => this.submitData(ingredientType));
		pescatarianBox.addEventListener("click", event => this.constraintRestrictions("pescatarian"));
		lactoOvoVegetarianBox.addEventListener("click", event => this.constraintRestrictions("lacto-ovo-vegetarian"));
		lactoVegetarianBox.addEventListener("click", event => this.constraintRestrictions("lacto-vegetarian"));
		veganBox.addEventListener("click", event => this.constraintRestrictions("vegan"));
		ingredientTypeSection.querySelector("button.submit")

		if (ingredientType) {
			avatarView.addEventListener("drop", event => this.submitAvatar(ingredientType, event.dataTransfer.files[0]));

			avatarView.src = "/services/ingredient-types/" + ingredientType.identity + "/avatar";
			ingredientTypeSection.querySelector("input.alias").value = ingredientType.alias;
			ingredientTypeSection.querySelector("textarea.description").value = ingredientType.description;
			pescatarianBox.checked = ingredientType.pescatarian;
			lactoOvoVegetarianBox.checked = ingredientType.lactoOvoVegetarian;
			lactoVegetarianBox.checked = ingredientType.lactoVegetarian;
			veganBox.checked = ingredientType.vegan;
		} else {
			avatarView.src = "/services/documents/1";
		}
	}


	constraintRestrictions (restriction) {
		const ingredientTypeSection = this.centerArticle.querySelector("section.ingredient-type-editor");
		const pescatarianBox = ingredientTypeSection.querySelector("input.pescatarian");
		const lactoOvoVegetarianBox = ingredientTypeSection.querySelector("input.lacto-ovo-vegetarian");
		const lactoVegetarianBox = ingredientTypeSection.querySelector("input.lacto-vegetarian");
		const veganBox = ingredientTypeSection.querySelector("input.vegan");

		switch (restriction) {
			case "pescatarian":
				if (!pescatarianBox.checked) {
					lactoOvoVegetarianBox.checked = false;
					lactoVegetarianBox.checked = false;
					veganBox.checked = false;
				}
				break;
			case "lacto-ovo-vegetarian":
				if (lactoOvoVegetarianBox.checked) {
					pescatarianBox.checked = true;
				} else {
					lactoVegetarianBox.checked = false;
					veganBox.checked = false;
				}
				break;
			case "lacto-vegetarian":
				if (lactoVegetarianBox.checked) {
					pescatarianBox.checked = true;
					lactoOvoVegetarianBox.checked = true;
				} else {
					veganBox.checked = false;
				}
				break;
			case "vegan":
				if (veganBox.checked) {
					lactoVegetarianBox.checked = true;
					lactoOvoVegetarianBox.checked = true;
					pescatarianBox.checked = true;
				}
				break;
			default:
				throw new RangeError();
		}
	}


	async submitData (ingredientType) {
		const ingredientTypeSection = this.centerArticle.querySelector("section.ingredient-type-editor");
		const ingredientTypeClone = ingredientType
			? window.structuredClone(ingredientType)
			: { identity: 0, version: 1 };

		ingredientTypeClone.alias = ingredientTypeSection.querySelector("input.alias").value.trim() || null;
		ingredientTypeClone.description = ingredientTypeSection.querySelector("textarea.description").value.trim() || null;
		ingredientTypeClone.pescatarian = ingredientTypeSection.querySelector("input.pescatarian").checked;
		ingredientTypeClone.lactoOvoVegetarian = ingredientTypeSection.querySelector("input.lacto-ovo-vegetarian").checked;
		ingredientTypeClone.lactoVegetarian = ingredientTypeSection.querySelector("input.lacto-vegetarian").checked;
		ingredientTypeClone.vegan = ingredientTypeSection.querySelector("input.vegan").checked;

		this.messageElement.value = "";
		try {
			// PUT /services/ingredient-types
			const json = JSON.stringify(ingredientTypeClone);
			const headers = { "Content-Type": "application/json", "Accept": "text/plain" };
			const response = await fetch("/services/ingredient-types", { method: "POST", headers: headers, body: json });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.messageElement.value = "ok";

			ingredientTypeSection.remove();
			this.displayIngredientTypes(null);
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}


	async submitAvatar (ingredientType, dropFile) {
		const ingredientTypeSection = this.centerArticle.querySelector("section.ingredient-type-editor");

		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/ingredient-types/id/avatar
			const resource = "/services/ingredient-types/" + ingredientType.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			ingredientType.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "ok";

			ingredientTypeSection.querySelector("img.avatar").src = "/services/ingredient-types/" + ingredientType.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}
}


window.addEventListener("load", event => {
	const controller = new IngredientTypesController();
	const menuButtons = document.querySelectorAll("header > nav > button");
	const menuButton = Array.from(menuButtons).find(button => button.classList.contains("ingredient-type-editor"));

	for (const button of menuButtons) {
		const active = button.classList.contains("ingredient-type-editor");
		button.addEventListener("click", event => controller.active = active);
	}

	menuButton.addEventListener("click", event => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});
});
