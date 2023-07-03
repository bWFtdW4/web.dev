import Controller from "../../../util/controller.js";


class RecipeEditorController extends Controller {
	#ingredientTypes;
	#pageOffset;
	#pageSize;


	constructor () {
		super();

		this.#pageOffset = 0;
		this.#pageSize = 5;
		this.#ingredientTypes = [];
	}


	async activate () {
		console.log("recipe editor controller activating.");
		const sectionTemplate = document.querySelector("head > template.recipes-view");
		this.rootSection = sectionTemplate.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(this.rootSection);

		this.rootSection.querySelector("button.backward").addEventListener("click", event => this.displayRecipes(-this.#pageSize));
		this.rootSection.querySelector("button.forward").addEventListener("click", event => this.displayRecipes(+this.#pageSize));
		this.rootSection.querySelector("button.create").addEventListener("click", event => this.displayRecipe(null));
		this.displayRecipes(0);

		this.messageElement.value = "";
		try {
			// GET /services/ingredient-types
			const response = await fetch("/services/ingredient-types", { method: "GET", headers: { "Accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.#ingredientTypes = await response.json();
			this.messageElement.value = "ok";
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}


	deactivate () {
		console.log("recipe editor controller deactivating.");
	}


	async displayRecipes (pageOffset) {
		this.#pageOffset += pageOffset;
		
		const parameterization = new URLSearchParams();
		parameterization.set("result-offset", this.#pageOffset);
		parameterization.set("result-size", this.#pageSize);
		if (this.sessionOwner.group !== "ADMIN")
			parameterization.set("owner-email", this.sessionOwner.email);

		let recipes;
		this.messageElement.value = "";
		try {
			// GET /services/recipes
			const resource = "/services/recipes?" + parameterization;
			const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipes = await response.json();
			this.messageElement.value = "ok";
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
			return;
		}

		while (this.centerArticle.lastElementChild !== this.rootSection)
			this.centerArticle.lastElementChild.remove();

		this.rootSection.querySelector("button.backward").disabled = (this.#pageOffset < this.#pageSize);
		this.rootSection.querySelector("button.forward").disabled = (recipes.length < this.#pageSize);

		const recipeTableBody = this.rootSection.querySelector("div.table tbody");
		while (recipeTableBody.lastElementChild)
			recipeTableBody.lastElementChild.remove();

		const recipeRowTemplate = document.querySelector("head > template.recipe-view-row");
		for (const recipe of recipes) {
			const recipeRow = recipeRowTemplate.content.firstElementChild.cloneNode(true);
			recipeTableBody.append(recipeRow);

			const avatarImage = recipeRow.querySelector("img.avatar");
			avatarImage.addEventListener("click", event => this.displayRecipe(recipe));
			avatarImage.src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();

			recipeRow.querySelector("input.title").value = recipe.title;
			recipeRow.querySelector("select.category").value = recipe.category;
			recipeRow.querySelector("input.pescatarian").checked = recipe.pescatarian;
			recipeRow.querySelector("input.lacto-ovo-vegetarian").checked = recipe.lactoOvoVegetarian;
			recipeRow.querySelector("input.lacto-vegetarian").checked = recipe.lactoVegetarian;
			recipeRow.querySelector("input.vegan").checked = recipe.vegan;
		}
	}


	async displayRecipe (recipe) {
		const template = document.querySelector("head > template.recipe-editor");
		const recipeEditorSection = template.content.firstElementChild.cloneNode(true);

		while (!this.centerArticle.lastElementChild.classList.contains("recipes-view"))
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipeEditorSection);

		const avatarImage = recipeEditorSection.querySelector("img.avatar");
		const categoryElement = recipeEditorSection.querySelector("select.category");
		const titleElement = recipeEditorSection.querySelector("input.title");
		const ownerEmailElement = recipeEditorSection.querySelector("input.owner-email");
		const descriptionElement = recipeEditorSection.querySelector("textarea.description");
		const instructionElement = recipeEditorSection.querySelector("textarea.instruction");
		const pescatarianElement = recipeEditorSection.querySelector("input.pescatarian");
		const lactoOvoVegetarianElement = recipeEditorSection.querySelector("input.lacto-ovo-vegetarian");
		const lactoVegetarianElement = recipeEditorSection.querySelector("input.lacto-vegetarian");
		const veganElement = recipeEditorSection.querySelector("input.vegan");
		const createButton = recipeEditorSection.querySelector("div.control button.create");
		const submitButton = recipeEditorSection.querySelector("div.control button.submit");

		titleElement.addEventListener("input", event => this.validateEditorSection());
		createButton.addEventListener("click", event => this.addIngredient(recipe, null));
		submitButton.addEventListener("click", event => this.submitRecipe(recipe));
		submitButton.disabled = !recipe;

		if (recipe)
			avatarImage.addEventListener("drop", event => this.submitAvatar(recipe, event.dataTransfer.files[0]));
		else
			recipe = { identity: 0, version: 1, ownerReference: this.sessionOwner.identity, avatarReference: 1, ingredients: [] };

		avatarImage.src = "/services/documents/" + recipe.avatarReference;
		categoryElement.value = recipe.category || "MAIN_COURSE";
		titleElement.value = recipe.title || "";
		descriptionElement.value = recipe.description || "";
		instructionElement.value = recipe.instruction || "";
		pescatarianElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.pescatarian, true);
		lactoOvoVegetarianElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoOvoVegetarian, true);
		lactoVegetarianElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoVegetarian, true);
		veganElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.vegan, true);

		const ingredientsElement = recipeEditorSection.querySelector("div.recipe-ingredients tbody");
		while (ingredientsElement.lastElementChild)
			ingredientsElement.lastElementChild.remove();

		const ingredientEditorTemplate = document.querySelector("head > template.ingredient-editor-row");
		const ingredients = recipe.ingredients;
		recipe.ingredients = [];
		for (const ingredient of ingredients)
			this.addIngredient(recipe, ingredient);

		if (recipe.ownerReference) {
			if (recipe.ownerReference === this.sessionOwner.identity) {
				ownerEmailElement.value = this.sessionOwner.email;
			} else {
				this.messageElement.value = "";
				try {
					// GET /services/people/id
					const resource = "/services/people/" + recipe.ownerReference;
					const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
					if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
					const person = await response.json();
					this.messageElement.value = "ok";

					ownerEmailElement.value = person.email;
				} catch (error) {
					this.messageElement.value = error.message || "a problem occurred!";
				}
			}
		}
	}


	modifyIngredient (ingredientRowElement, ingredient) {
		const ingredientTypeReference = Number.parseInt(ingredientRowElement.querySelector("select.alias").value);

		const ingredientType = this.#ingredientTypes.find(type => type.identity == ingredientTypeReference);
		ingredientRowElement.querySelector("img.avatar").src = "/services/ingredient-types/" + ingredientType.identity + "/avatar";
		ingredientRowElement.querySelector("input.pescatarian").checked = ingredientType.pescatarian;
		ingredientRowElement.querySelector("input.lacto-ovo-vegetarian").checked = ingredientType.lactoOvoVegetarian;
		ingredientRowElement.querySelector("input.lacto-vegetarian").checked = ingredientType.lactoVegetarian;
		ingredientRowElement.querySelector("input.vegan").checked = ingredientType.vegan;

		ingredient.typeReference = ingredientType.identity;
		ingredient.amount = Number.parseFloat(ingredientRowElement.querySelector("input.amount").value);
		ingredient.unit = ingredientRowElement.querySelector("select.unit").value;
	}


	addIngredient (recipe, ingredient) {
		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const ingredientsElement = recipeEditorSection.querySelector("div.table tbody");

		const ingredientEditorTemplate = document.querySelector("head > template.ingredient-editor-row");
		const ingredientRowElement = ingredientEditorTemplate.content.firstElementChild.cloneNode(true);
		ingredientsElement.append(ingredientRowElement);

		const avatarImage = ingredientRowElement.querySelector("img.avatar");
		const aliasElement = ingredientRowElement.querySelector("select.alias");
		const amountElement = ingredientRowElement.querySelector("input.amount");
		const unitElement = ingredientRowElement.querySelector("select.unit");
		this.#initializeIngredientAliasElement(aliasElement);

		if (!ingredient) ingredient = { identity: 0, version: 1, typeReference: this.#ingredientTypes[0].identity, avatarIdentity: 1, amount: 1, unit: "LITRE" };
		recipe.ingredients.push(ingredient);

		avatarImage.addEventListener("click", event => this.removeIngredient(ingredientRowElement, recipe, ingredient));
		avatarImage.addEventListener("mouseover", event => avatarImage.src = "image/red-cross.png");
		avatarImage.addEventListener("mouseout", event => avatarImage.src = "/services/ingredient-types/" + ingredient.typeReference + "/avatar");
		aliasElement.addEventListener("change", event => this.modifyIngredient(ingredientRowElement, ingredient));
		unitElement.addEventListener("change", event => this.modifyIngredient(ingredientRowElement, ingredient));
		amountElement.addEventListener("change", event => this.modifyIngredient(ingredientRowElement, ingredient));
		amountElement.addEventListener("input", event => this.validateEditorSection());

		aliasElement.value = ingredient.typeReference;
		amountElement.value = ingredient.amount;
		unitElement.value = ingredient.unit;
		this.modifyIngredient(ingredientRowElement, ingredient);
	}


	removeIngredient (ingredientRowElement, recipe, ingredient) {
		recipe.ingredients = recipe.ingredients.filter(element => element !== ingredient);
		ingredientRowElement.remove();
	}


	validateEditorSection () {
		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const inputElements = Array.from(recipeEditorSection.querySelectorAll('input'));
		const submitButton = recipeEditorSection.querySelector("button.submit");
		const amountElements = Array.from(recipeEditorSection.querySelectorAll("div.table tbody tr input.amount"));

		const left = inputElements.some(element => !element.reportValidity());
		const right = amountElements.some(element => Number.parseFloat(element.value) <= 0);
		submitButton.disabled = left || right; 
	}


	async submitRecipe (recipe) {
		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const recipeDivision = recipeEditorSection.querySelector("div.recipe");

		const illustrations = recipe.illustrations;
		const ingredients = recipe.ingredients;
		for (const ingredient of ingredients) {
			delete ingredient.alias;
			delete ingredient.description;
			delete ingredient.pescatarian;
			delete ingredient.lactoOvoVegetarian;
			delete ingredient.lactoVegetarian;
			delete ingredient.vegan;
		}

		recipe.ingredients = [];
		recipe.illustrations = [];
		recipe.title = recipeDivision.querySelector("input.title").value.trim() || null;
		recipe.category = recipeDivision.querySelector("select.category").value;
		recipe.description = recipeDivision.querySelector("textarea.description").value.trim() || null;
		recipe.instruction = recipeDivision.querySelector("textarea.instruction").value.trim() || null;
		delete recipe.pescatarian;
		delete recipe.lactoOvoVegetarian;
		delete recipe.lactoVegetarian;
		delete recipe.vegan;

		this.messageElement.value = "";
		try {
			let body, resource, response;

			// POST /services/recipes
			body = JSON.stringify(recipe);
			resource = "/services/recipes";
			response = await fetch(resource, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "text/plain" }, body: body });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipe.identity = Number.parseInt(await response.text());

			// PUT /services/recipes/id/ingredients
			body = JSON.stringify(ingredients);
			resource = "/services/recipes/" + recipe.identity + "/ingredients"
			response = await fetch(resource, { method: "PUT", headers: { "Content-Type": "text/plain", "Accept": "text/plain" }, body: body });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.messageElement.value = "ok";
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}

		this.#pageOffset = 0;
		this.displayRecipes(0);
	}


	async submitAvatar (recipe, dropFile) {
		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");

		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/recipes/id/avatar
			const resource = "/services/recipes/" + recipe.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipe.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "ok";

			recipeEditorSection.querySelector("div.recipe img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}


	#initializeIngredientAliasElement (aliasElement) {
		for (const ingredientType of this.#ingredientTypes) {
			const optionElement = document.createElement("option");
			optionElement.value = ingredientType.identity;
			optionElement.innerText = ingredientType.alias;
			aliasElement.append(optionElement);
		}
	}
}


window.addEventListener("load", event => {
	const controller = new RecipeEditorController();
	const menuButtons = document.querySelectorAll("header > nav > button");
	const menuButton = Array.from(menuButtons).find(button => button.classList.contains("recipe-editor"));

	for (const button of menuButtons) {
		const active = button.classList.contains("recipe-editor");
		button.addEventListener("click", event => controller.active = active);
	}

	menuButton.addEventListener("click", event => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});
});
