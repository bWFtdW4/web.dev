import Controller from "../../util/controller.js";


class RecipeController extends Controller {
	constructor () {
		super();
	}


	async activate () {
		console.log("recipe-query controller activating.");
		const template = document.querySelector("head > template.recipe-query");
		const recipeQuerySection = template.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipeQuerySection);

		const searchButton = recipeQuerySection.querySelector("button.search");
		searchButton.addEventListener("click", event => this.queryRecipes());
	}


	deactivate () {
		console.log("recipe-query controller deactivating.");
	}


	async queryRecipes () {
		const recipeQuerySection = this.centerArticle.querySelector("section.recipe-query");
		const parameterization = new URLSearchParams();
		let value;
		
		value = recipeQuerySection.querySelector("input.title").value || null;
		if (value) parameterization.set("title", value);

		value = recipeQuerySection.querySelector("input.description-fragment").value || null;
		if (value) parameterization.set("description-fragment", value);
		
		value = recipeQuerySection.querySelector("input.instruction-fragment").value || null;
		if (value) parameterization.set("instruction-fragment", value);

		value = recipeQuerySection.querySelector("input.owner-email").value || null;
		if (value) parameterization.set("owner-email", value);

		value = recipeQuerySection.querySelector("select.category").value || null;
		if (value) parameterization.set("category", value);

		value = recipeQuerySection.querySelector("select.restriction").value || null;
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

		let recipes = [];
		this.messageElement.value = "";
		try {
			// GET /services/recipes
			const resource = "/services/recipes" + (parameterization.size === 0 ? "" : "?" + parameterization);
			const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipes = await response.json();
			this.messageElement.value = "ok";
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}

		this.displayRecipes(recipes);
	}


	displayRecipes (recipes) {
		console.log(recipes);
	}


	displayRecipe (recipe) {
		const recipeSection = this.centerArticle.querySelector("section.recipe");
		recipeSection.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();
		recipeSection.querySelector("select.category").value = recipe.category;
		recipeSection.querySelector("input.title").value = recipe.title;
		recipeSection.querySelector("textarea.description").value = recipe.description;
		recipeSection.querySelector("textarea.instruction").value = recipe.instruction;
		recipeSection.querySelector("input.pescatarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.pescatarian, true);
		recipeSection.querySelector("input.lacto-ovo-vegetarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoOvoVegetarian, true);
		recipeSection.querySelector("input.lacto-vegetarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoVegetarian, true);
		recipeSection.querySelector("input.vegan").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.vegan, true);

		const ingredientsElement = recipeSection.querySelector("div.recipe-ingredients tbody");
		ingredientsElement.innerHTML = "";

		const ingredientTemplate = document.querySelector("head > template.recipe-ingredient-row");
		for (const ingredient of recipe.ingredients) {
			const ingredientElement = ingredientTemplate.content.firstElementChild.cloneNode(true);
			ingredientsElement.append(ingredientElement);

			ingredientElement.querySelector("select.unit").value = ingredient.unit;
			ingredientElement.querySelector("input.amount").value = ingredient.amount;
			ingredientElement.querySelector("img.avatar").src = "/services/documents/" + ingredient.avatarReference;
			ingredientElement.querySelector("input.alias").value = ingredient.alias;
			ingredientElement.querySelector("input.pescatarian").checked = ingredient.pescatarian;
			ingredientElement.querySelector("input.lacto-ovo-vegetarian").checked = ingredient.lactoOvoVegetarian;
			ingredientElement.querySelector("input.lacto-vegetarian").checked = ingredient.lactoVegetarian;
			ingredientElement.querySelector("input.vegan").checked = ingredient.vegan;
		}
	}


	async submitAvatar (recipe, dropFile) {
		const recipeSection = this.centerArticle.querySelector("section.recipe");

		this.messageElement.value = "";
		try {
			if (!dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/recipes/id/avatar
			const resource = "/services/recipes/" + recipe.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipe.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "ok";

			recipeSection.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}
}


window.addEventListener("load", event => {
	const controller = new RecipeController();
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
