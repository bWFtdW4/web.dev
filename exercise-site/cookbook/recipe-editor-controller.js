import Controller from "../../util/controller.js";


class RecipeEditorController extends Controller {
	
	constructor () {
		super();
	}


	async activate () {
		console.log("recipe-editor controller activating.");
		const template = document.querySelector("head > template.recipe-editor");
		const recipeEditorSection = template.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipeEditorSection);

		//this.editAllRecipes();
		const showAllButton = recipeEditorSection.querySelector("button.editAllRecipes");
		showAllButton.addEventListener("click", event => this.editAllRecipes());

		const showMyButton = recipeEditorSection.querySelector("button.editMyRecipes");
		showMyButton.addEventListener("click", event => this.editMyRecipes());

	}


	deactivate () {
		console.log("recipe-editor controller deactivating.");
	}


	async editAllRecipes () {
		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const parameterization = new URLSearchParams();
		let value;
		
		console.log("editAllRecipes")

		/*
		value = recipeEditorSection.querySelector("input.title").value || null;
		if (value) parameterization.set("title", value);

		value = recipeEditorSection.querySelector("input.description-fragment").value || null;
		if (value) parameterization.set("description-fragment", value);
		
		value = recipeEditorSection.querySelector("input.instruction-fragment").value || null;
		if (value) parameterization.set("instruction-fragment", value);

		value = recipeEditorSection.querySelector("input.owner-email").value || null;
		if (value) parameterization.set("owner-email", value);

		value = recipeEditorSection.querySelector("select.category").value || null;
		if (value) parameterization.set("category", value);

		value = recipeEditorSection.querySelector("select.restriction").value || null;
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

		*/

		let recipes = [];
		this.messageElement.value = "";
		try {
			// GET /services/recipes
			//const resource = "/services/recipes" + (parameterization.size === 0 ? "" : "?" + parameterization);
			const resource = "/services/recipes/";
			const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipes = await response.json();
			this.messageElement.value = "ok";
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}

		this.displayRecipes(recipes);
	}

	async editMyRecipes () {
		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const parameterization = new URLSearchParams();
		let value;
		
		
		//add select SessionOwner.email recipe
		console.log("//add select SessionOwner.email recipe" + this.sessionOwner.email);
		

		let recipes = [];
		this.messageElement.value = "";
		try {
			// GET /services/recipes?owner-email=mamun@gmail.com
			//const resource = "/services/recipes" + (parameterization.size === 0 ? "" : "?" + parameterization);
			
			const resource = "/services/recipes?owner-email=mamun@gmail.com";
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
		const template = document.querySelector("head > template.recipe-editor-query-result");
		const recipeQueryResultSection = template.content.firstElementChild.cloneNode(true);
		
		while (!this.centerArticle.lastElementChild.classList.contains("recipe-editor"))
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipeQueryResultSection);

		const recipeTableBody = recipeQueryResultSection.querySelector("table > tbody");
		const rowTemplate = document.querySelector("head > template.recipe-editor-query-result-row");
		for (const recipe of recipes) {
			const recipeRow = rowTemplate.content.firstElementChild.cloneNode(true);
			recipeTableBody.append(recipeRow);

			recipeRow.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();
			recipeRow.querySelector("input.title").value = recipe.title;
			recipeRow.querySelector("select.category").value = recipe.category;
			recipeRow.querySelector("input.pescatarian").checked = recipe.pescatarian;
			recipeRow.querySelector("input.lacto-ovo-vegetarian").checked = recipe.lactoOvoVegetarian;
			recipeRow.querySelector("input.lacto-vegetarian").checked = recipe.lactoVegetarian;
			recipeRow.querySelector("input.vegan").checked = recipe.vegan;

			recipeRow.querySelector("img.avatar").addEventListener("click", event => this.displayRecipe(recipe));
		}
	}


	displayRecipe (recipe) {
		const template = document.querySelector("head > template.recipe-editor-view");
		const recipeViewSection = template.content.firstElementChild.cloneNode(true);

		// while (!this.centerArticle.lastElementChild.classList.contains("recipe-view"))
		//	this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipeViewSection);

		recipeViewSection.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();
		recipeViewSection.querySelector("select.category").value = recipe.category;
		recipeViewSection.querySelector("input.title").value = recipe.title;
		recipeViewSection.querySelector("textarea.description").value = recipe.description;
		recipeViewSection.querySelector("textarea.instruction").value = recipe.instruction;
		recipeViewSection.querySelector("input.pescatarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.pescatarian, true);
		recipeViewSection.querySelector("input.lacto-ovo-vegetarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoOvoVegetarian, true);
		recipeViewSection.querySelector("input.lacto-vegetarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoVegetarian, true);

		const ingredientsElement = recipeViewSection.querySelector("div.recipe-editor-ingredients tbody");
		ingredientsElement.innerHTML = "";

		const ingredientTemplate = document.querySelector("head > template.recipe-editor-ingredient-row");
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
