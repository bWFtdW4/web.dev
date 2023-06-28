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
		//addNewRecipe.addEventListener("click", event => this.addNewRecipe());
		addNewRecipe.addEventListener("click", event => this.getAllIngredient());
		

		//drop new avatar > moved to displayRecipe (recipe)
		//html > body > main > artitle.center > section.recipe-editor-view > div.recipe-editor-view > div > img.avatar.vertical-center
		/*
		const templateView = document.querySelector("head > template.recipe-editor-view");
		const recipeEditorViewSection = templateView.content.firstElementChild.cloneNode(true);
		const recipeEditorView = recipeEditorViewSection.querySelector("div.recipe-editor-view");
		*/



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

		//event drop new ingredient avatar + recipe
		const changeAvatar = document.querySelector("article.center > section.recipe-editor-view > div.recipe-editor-view > div > img.avatar");
		changeAvatar.addEventListener("drop", event => console.log("droped avatar"));
		changeAvatar.addEventListener("drop", event => this.submitAvatar(event.dataTransfer.files[0], recipe));

		
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

	async getAllIngredient () {
		console.log("getAllIngredient")

		const ingredientTypeEditorSection = this.centerArticle.querySelector("section.ingredient-type-editor");

		let ingredientTypes = [];
		this.messageElement.value = "";
		try {
			// GET services/ingredient-types
			const resource = "/services/ingredient-types/";
			const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			ingredientTypes = await response.json();
			this.messageElement.value = "ok";
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}

		console.log("what is in the box :" + ingredientTypes);
		this.addNewRecipe(ingredientTypes);
	}


	async addNewRecipe(ingredientTypes) {
		console.log("addNewRecipe");
		
		

		const template = document.querySelector("head > template.addNewRecipe");
		const addNewRecipeSection = template.content.firstElementChild.cloneNode(true);
		
		//while (!this.centerArticle.lastElementChild.classList.contains("recipe-editor"))
		//this.centerArticle.lastElementChild.remove();
//!		//clear addNewRecipeSection before adding new one
		while (!this.centerArticle.lastElementChild.classList.contains("addNewRecipe"))
		this.centerArticle.append(addNewRecipeSection);



		//adding all ingredientTypes to select
		const rowTemplate = document.querySelector("head > template.addNewRecipe > fieldset.addNewRecipe > section > fieldset > table.addNewRecipelngredientRow");
		
		for (const ingredientType of ingredientTypes) {
			const ingredientTypesRow = rowTemplate.content.firstElementChild.cloneNode(true);
			ingredientTypeTableBody.append(ingredientTypesRow);
			
			ingredientTypesRow.querySelector("img.avatar").src = "/services/ingredient-types/" + ingredientType.identity + "/avatar?cache-bust=" + Date.now();
			ingredientTypesRow.querySelector("input.alias").value = ingredientType.alias;
			ingredientTypesRow.querySelector("input.description").value = ingredientType.description;
			ingredientTypesRow.querySelector("input.pescatarian").checked = ingredientType.pescatarian;
			ingredientTypesRow.querySelector("input.lacto-ovo-vegetarian").checked = ingredientType.lactoOvoVegetarian;
			ingredientTypesRow.querySelector("input.lacto-vegetarian").checked = ingredientType.lactoVegetarian;
			ingredientTypesRow.querySelector("input.vegan").checked = ingredientType.vegan;
			
			ingredientTypesRow.querySelector("input.pescatarian").disabled="true";
			ingredientTypesRow.querySelector("input.lacto-ovo-vegetarian").disabled="true";
			ingredientTypesRow.querySelector("input.lacto-vegetarian").disabled="true";
			ingredientTypesRow.querySelector("input.vegan").disabled="true";
			
			//click avatar to show ingredientType
			ingredientTypesRow.querySelector("img.avatar").addEventListener("click", event => this.editIngredientType(ingredientType), );
		}


/*	try to add a dynamic select option list

		let ingredientList = ["tomato", "salt", "pepper"];
		console.log("ingredientList: " + ingredientList);

//!		//the select "ingredient-list" fill with ingredientList
		const ingredientListSelect = addNewRecipeSection.querySelector("select.ingredient-list");
		ingredientListSelect.innerHTML = "";
		
		const ingredientListaddOption = document.querySelector("html > body > main > article.center > fieldset.addNewRecipe > div > select.ingredient-list");
		for (const ingredient of ingredientList) {
			console.log("ingredient: " + ingredient);
			ingredientListaddOption.append(ingredient);
			
			const ingredientListElement = ingredientListaddOption.content.firstElementChild.cloneNode(true);
			ingredientListElement.append(ingredientListElement);
			ingredientListElement.value = ingredient.identity;
			ingredientListElement.textContent = ingredient.title;
			
		}		
*/

		

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

	async submitAvatar(dropFile,recipe){
		console.log("submitAvatar: " + dropFile);
		console.log("submitAvatar got recipe.identity: " + recipe.identity);

		//html > body > main > artitle.center > section.recipe-editor-view > div.recipe-editor-view > div > img.avatar.vertical-center
		const templateView = document.querySelector("head > template.recipe-editor-view");
		const recipeEditorViewSection = templateView.content.firstElementChild.cloneNode(true);
		const recipeEditorView = recipeEditorViewSection.querySelector("div.recipe-editor-view");

		this.messageElement.value = "";
		try {
			console.log("submit dropFile.type: " + dropFile.type);
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/recipes/{identity}/avatar
			const resource = "/services/recipes/" + recipe.identity + "/avatar";
			const response = await fetch(resource, {method: "PUT", headers: {"Content-Type": dropFile.type, "Accept": "text/plain"}, body: dropFile});
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipe.avatarReference = await response.text();
			this.messageElement.value = "avatar updated";

			// update avatar
			const changeAvatar = document.querySelector("article.center > section.recipe-editor-view > div.recipe-editor-view > div > img.avatar");
			changeAvatar.src = "/services/recipes/" + this.recipe.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error || "a problem occurred while updating the avatar";
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
