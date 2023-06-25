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
		
		const showAllButton = recipeEditorSection.querySelector("button.showAllRecipes");
		showAllButton.addEventListener("click", event => this.showAllRecipes());
		
		const showMyButton = recipeEditorSection.querySelector("button.showMyRecipes");
		showMyButton.addEventListener("click", event => this.showMyRecipes());
		
		const addNewRecipe = recipeEditorSection.querySelector("button.addNewRecipe");
		addNewRecipe.addEventListener("click", event => this.addNewRecipe());
		
		
		
	}


	deactivate () {
		console.log("recipe-editor controller deactivating.");
	}


	async showAllRecipes () {
		console.log("showAllRecipes")

		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const parameterization = new URLSearchParams();


		let recipes = [];
		this.messageElement.value = "";
		try {
			// GET /services/recipes
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

	async showMyRecipes () {
		console.log("showMyRecipes");

		const recipeEditorSection = this.centerArticle.querySelector("section.recipe-editor");
		const parameterization = new URLSearchParams();
		let value;	
		
		let recipes = [];
		this.messageElement.value = "";
		try {
			// GET /services/recipes?owner-email=mamun@gmail.com
			
			const resource = "/services/recipes?owner-email=" + this.sessionOwner.email;

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

			//click avatar to show recipe
			recipeRow.querySelector("img.avatar").addEventListener("click", event => this.displayRecipe(recipe), );
			
		}
	}


	displayRecipe (recipe) {
		console.log("opening recipe: " + recipe.title);
		const template = document.querySelector("head > template.recipe-editor-view");
		const recipeViewSection = template.content.firstElementChild.cloneNode(true);
		
		// while (!this.centerArticle.lastElementChild.classList.contains("recipe-view"))
		this.centerArticle.lastElementChild.remove();
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
			//ingredientElement.querySelector("owner-email").value = ;
		}

		// when press "submitRecipeUpdate"  > post > recipeClone;
		const under_submitRecipeUpdateButton = document.querySelector("section.recipe-editor > div > button.submitRecipeUpdate");
		under_submitRecipeUpdateButton.addEventListener("click", event => this.updateRecipeData(recipe));
		
		
	}
	
	//wip > get selected recipe > clone recipe > press "rezept speichern" > post  
	async updateRecipeData(recipe) {
		console.log("__updateRecipeData started");
		console.log("__selected recipe Title is >>>>>" + recipe.title + " id:" + recipe.identity);
		
		const recipeClone = window.structuredClone(recipe);
		console.log("__recipeClone created with id: " + recipeClone.identity);
		
		//add recipeClone avatar update

		recipeClone.identity = recipe.identity;
		recipeClone.title = document.querySelector("section.recipe-editor-view > div.recipe-editor-view input.title").value.trim() || null;
		recipeClone.category = document.querySelector("section.recipe-editor-view > div.recipe-editor-view select.category").value.trim() || null;
		recipeClone.description = document.querySelector("section.recipe-editor-view > div.recipe-editor-view textarea.description").value.trim() || null;
		recipeClone.instruction = document.querySelector("section.recipe-editor-view > div.recipe-editor-view textarea.instruction").value.trim() || null;
		
		console.log("__POST > origial recipe.title: " + recipe.title + " to recipeClone.title: " + recipeClone.title);
		
		this.messageElement.value = "";
		try {
			// PUT /services/recipe
			const json = JSON.stringify(recipeClone);
			console.log("POST this: " + json);
			const headers = { "Content-Type": "application/json", "Accept": "text/plain" };
			
			const resource = "/services/recipes/";
			const response = await fetch(resource, { method: "POST", headers: headers, body: json });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.messageElement.value = "ok";
	
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
		

	}

	async addNewRecipe() {
		console.log("addNewRecipe");
		
		

		const template = document.querySelector("head > template.addNewRecipe");
		const addNewRecipeSection = template.content.firstElementChild.cloneNode(true);
		
		//while (!this.centerArticle.lastElementChild.classList.contains("recipe-editor"))
		//this.centerArticle.lastElementChild.remove();
//!		//clear addNewRecipeSection before adding new one
		while (!this.centerArticle.lastElementChild.classList.contains("addNewRecipe"))
		this.centerArticle.append(addNewRecipeSection);


		let ingredientList = ["tomato", "salt", "pepper"];

//!		//the select "ingredient-list" fill with ingredientList
		const ingredientListSelect = addNewRecipeSection.querySelector("select.ingredient-list");
		ingredientListSelect.innerHTML = "";
		//const ingredientListTemplate = document.querySelector("head > template.addNewRecipe > fieldset.addNewRecipe > selcet.ingredient-list");
		document.querySelector('.ingredient-list');
		for (const ingredient of ingredientList) {
			const ingredientListElement = ingredientListTemplate.content.firstElementChild.cloneNode(true);
			ingredientListSelect.append(ingredientListElement);
			ingredientListElement.value = ingredient.identity;
			ingredientListElement.textContent = ingredient.title;
		}


		

		//const recipeTableBody = addNewRecipeSection.querySelector("table > tbody");
		//const rowTemplate = document.querySelector("head > template.recipe-editor-query-result-row");
	


		/*
		-const template = document.querySelector("head > template.recipe-editor-query-result");
		-const recipeQueryResultSection = template.content.firstElementChild.cloneNode(true);
		
		-while (!this.centerArticle.lastElementChild.classList.contains("recipe-editor"))
		-	this.centerArticle.lastElementChild.remove();
		-this.centerArticle.append(recipeQueryResultSection);

		-const recipeTableBody = recipeQueryResultSection.querySelector("table > tbody");
		-const rowTemplate = document.querySelector("head > template.recipe-editor-query-result-row");
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

			//click avatar to show recipe
			recipeRow.querySelector("img.avatar").addEventListener("click", event => this.displayRecipe(recipe), );
		
		*/

		/*

		const preferencesSection = this.centerArticle.querySelector("section.preferences");
		const phonesElement = preferencesSection.querySelector("fieldset > div.phones");

		const divElement = document.createElement("div");
		phonesElement.append(divElement);

		const phoneElement = document.createElement("input");
		divElement.append(phoneElement);
		phoneElement.className = "phone default";
		phoneElement.type = "tel";
		phoneElement.value = phone;


		// when press "submitRecipeUpdate"  > post > recipeClone;
		const under_submitRecipeUpdateButton = document.querySelector("section.recipe-editor > div > button.submitRecipeUpdate");
		under_submitRecipeUpdateButton.addEventListener("click", event => this.updateRecipeData(recipe));
		
		*/


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
