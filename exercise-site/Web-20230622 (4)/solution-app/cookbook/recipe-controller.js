import Controller from "./controller.js";


class RecipeController extends Controller {
	constructor () {
		super();
	}


	async activate () {
		const template = document.querySelector("head > template.recipe");
		const recipeSection = template.content.firstElementChild.cloneNode(true);

		this.centerArticle.innerHTML = "";
		this.centerArticle.append(recipeSection);
		const avatarImage = recipeSection.querySelector("img.avatar");

		// GET /services/recipes/36
		this.messageElement.value = "";
		try {
			const response = await fetch("/services/recipes/36", { method: "GET", headers: { "Accept": "application/json" }});
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			const recipe = await response.json();
			this.messageElement.value = "ok";

			avatarImage.addEventListener("drop", event => this.commitAvatar(recipe, event.dataTransfer.files[0]));
	
			this.displayRecipe(recipe);
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
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


	async commitAvatar (recipe, dropFile) {
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
	const menuButton = Array.from(menuButtons).find(button => button.classList.contains("recipe"));

	menuButton.addEventListener("click", () => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});

	menuButton.addEventListener("click", () => controller.activate());
});
