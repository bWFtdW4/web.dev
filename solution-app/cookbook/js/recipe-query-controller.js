import Controller from "../../../util/controller.js";


class RecipeQueryController extends Controller {
	#pageOffset;
	#pageSize;


	constructor () {
		super();

		this.#pageOffset = 0;
		this.#pageSize = 5;
	}


	activate () {
		console.log("recipe query controller activating.");
		const sectionTemplate = document.querySelector("head > template.recipes-query");
		this.rootSection = sectionTemplate.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(this.rootSection);

		const searchButton = this.rootSection.querySelector("button.search");
		searchButton.addEventListener("click", event => this.queryRecipes());
	}


	deactivate () {
		console.log("recipe query controller deactivating.");
		this.rootSection = null;
	}


	queryRecipes () {
		const parameterization = new URLSearchParams();
		let value;
		
		value = this.rootSection.querySelector("input.title").value || null;
		if (value) parameterization.set("title", value);

		value = this.rootSection.querySelector("input.description-fragment").value || null;
		if (value) parameterization.set("description-fragment", value);
		
		value = this.rootSection.querySelector("input.instruction-fragment").value || null;
		if (value) parameterization.set("instruction-fragment", value);

		value = this.rootSection.querySelector("input.owner-email").value || null;
		if (value) parameterization.set("owner-email", value);

		value = this.rootSection.querySelector("select.category").value || null;
		if (value) parameterization.set("category", value);

		value = this.rootSection.querySelector("select.restriction").value || null;
		switch (value) {
			default:
				break;
			case "PESCATARIAN":
				parameterization.set("pescetarian", "true");
				break;
			case "LACTO-OVO-VEGETARIAN":
				parameterization.set("lacto-ovo-vegetarian", "true");
				break;
			case "LACTO-VEGETARIAN":
				parameterization.set("lacto-vegetarian", "true");
				break;
			case "VEGAN":
				parameterization.set("vegan", "true");
				break;
		}

		const template = document.querySelector("head > template.recipes-view");
		const recipesViewSection = template.content.firstElementChild.cloneNode(true);

		while (!this.centerArticle.lastElementChild.classList.contains("recipes-query"))
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipesViewSection);

		recipesViewSection.querySelector("button.backward").addEventListener("click", event => this.displayRecipes(parameterization, -this.#pageSize));
		recipesViewSection.querySelector("button.forward").addEventListener("click", event => this.displayRecipes(parameterization, +this.#pageSize));
		recipesViewSection.querySelector("button.create").classList.toggle("void");

		this.#pageOffset = 0;
		this.displayRecipes(parameterization, 0);
	}


	async displayRecipes (parameterization, pageOffset) {
		this.#pageOffset += pageOffset;
		parameterization.set("result-offset", this.#pageOffset);
		parameterization.set("result-size", this.#pageSize);

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

		const recipesViewSection = this.centerArticle.querySelector("section.recipes-view");
		recipesViewSection.querySelector("button.backward").disabled = (this.#pageOffset < this.#pageSize);
		recipesViewSection.querySelector("button.forward").disabled = (recipes.length < this.#pageSize);

		const recipeTableBody = recipesViewSection.querySelector("div.table tbody");
		const recipeRowTemplate = document.querySelector("head > template.recipe-view-row");
		for (const recipe of recipes) {
			const recipeRow = recipeRowTemplate.content.firstElementChild.cloneNode(true);
			recipeTableBody.append(recipeRow);

			recipeRow.querySelector("img.avatar").addEventListener("click", event => this.displayRecipe(recipe));

			recipeRow.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar";
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
		recipeEditorSection.querySelector("div.control").classList.toggle("void");

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

		titleElement.readOnly = descriptionElement.readOnly = instructionElement.readOnly = true;
		categoryElement.disabled = pescatarianElement.disabled = lactoOvoVegetarianElement.disabled = lactoVegetarianElement.disabled = veganElement.disabled = true;
		
		avatarImage.src = "/services/recipes/" + recipe.identity + "/avatar";
		categoryElement.value = recipe.category;
		titleElement.value = recipe.title;
		descriptionElement.value = recipe.description;
		instructionElement.value = recipe.instruction;
		pescatarianElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.pescatarian, true);
		lactoOvoVegetarianElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoOvoVegetarian, true);
		lactoVegetarianElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoVegetarian, true);
		veganElement.checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.vegan, true);

		const ingredientsElement = recipeEditorSection.querySelector("div.recipe-ingredients tbody");
		while (ingredientsElement.lastElementChild)
			ingredientsElement.lastElementChild.remove();

		const ingredientEditorTemplate = document.querySelector("head > template.ingredient-editor-row");
		for (const ingredient of recipe.ingredients) {
			const ingredientRowElement = ingredientEditorTemplate.content.firstElementChild.cloneNode(true);
			ingredientsElement.append(ingredientRowElement);

			const avatarImage = ingredientRowElement.querySelector("img.avatar");
			const aliasElement = ingredientRowElement.querySelector("select.alias");
			const amountElement = ingredientRowElement.querySelector("input.amount");
			const unitElement = ingredientRowElement.querySelector("select.unit");
			const aliasOptionElement = document.createElement("option");
			aliasOptionElement.value = ingredient.typeReference;
			aliasOptionElement.innerText = ingredient.alias;
			aliasElement.append(aliasOptionElement);

			avatarImage.src = "/services/documents/" + ingredient.avatarReference;
			amountElement.value = ingredient.amount;
			unitElement.value = ingredient.unit;
			ingredientRowElement.querySelector("input.pescatarian").checked = ingredient.pescatarian;
			ingredientRowElement.querySelector("input.lacto-ovo-vegetarian").checked = ingredient.lactoOvoVegetarian;
			ingredientRowElement.querySelector("input.lacto-vegetarian").checked = ingredient.lactoVegetarian;
			ingredientRowElement.querySelector("input.vegan").checked = ingredient.vegan;

			aliasElement.disabled = unitElement.disabled = amountElement.readOnly = true;
		}

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
}


window.addEventListener("load", event => {
	const controller = new RecipeQueryController();
	const menuButtons = document.querySelectorAll("header > nav > button");
	const menuButton = Array.from(menuButtons).find(button => button.classList.contains("recipe-query"));

	for (const button of menuButtons) {
		const active = button.classList.contains("recipe-query");
		button.addEventListener("click", event => controller.active = active);
	}

	menuButton.addEventListener("click", event => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});
});
