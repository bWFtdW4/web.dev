import Controller from "../../../util/controller.js";


class RecipeEditorController extends Controller {
	#pageOffset;
	#pageSize;
	#ingredientsTypes;
	
	constructor () {
		super();
		
		this.#pageOffset = 0;
		this.#pageSize = 5;
		this.ingredientsTypes = [];
		
	}
	
	
	async activate () {
		console.log("recipe-editor controller activating.");
		const sectionTemplate = document.querySelector("head > template.recipes-query");
		const recipesQuerySection = sectionTemplate.content.firstElementChild.cloneNode(true);
		
		while (this.centerArticle.lastElementChild)
		this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipesQuerySection);
		
		const searchButton = recipesQuerySection.querySelector("button.search");
		searchButton.addEventListener("click", event => this.queryRecipes());
		
		const newRecipeButton = recipesQuerySection.querySelector("button.create-new-recipe");
		newRecipeButton.addEventListener("click", event => console.log("create-new-recipe button clicked"));
		newRecipeButton.addEventListener("click", event => this.displayRecipe(null));
		
		this.getAllIngredientsTypes();
		this.queryRecipes ();

	}


	deactivate () {
		console.log("recipe-editor controller deactivating.");
	}

	hideSearch(){
		const recipesQuerySection = this.centerArticle.querySelector("section.recipes-query");
		recipesQuerySection.querySelector("input.title").style.display = "none";
		recipesQuerySection.querySelector("input.description-fragment").style.display = "none";
		recipesQuerySection.querySelector("input.instruction-fragment").style.display = "none";
		recipesQuerySection.querySelector("input.owner-email").style.display = "none";
		recipesQuerySection.querySelector("select.category").style.display = "none";
		recipesQuerySection.querySelector("select.restriction").style.display = "none";
		recipesQuerySection.querySelector("button.search").style.display = "none";

		recipesQuerySection.querySelector("label.q-title").style.display = "none";
		recipesQuerySection.querySelector("label.q-description-fragment").style.display = "none";
		recipesQuerySection.querySelector("label.q-instruction-fragment").style.display = "none";
		recipesQuerySection.querySelector("label.q-owner-email").style.display = "none";
		recipesQuerySection.querySelector("label.q-category").style.display = "none";
		recipesQuerySection.querySelector("label.q-restriction").style.display = "none";

	}


	async queryRecipes () {
		this.hideSearch();
		const recipesQuerySection = this.centerArticle.querySelector("section.recipes-query");
		const parameterization = new URLSearchParams();
		let value;
		
		value = recipesQuerySection.querySelector("input.title").value || null;
		if (value) parameterization.set("title", value);

		value = recipesQuerySection.querySelector("input.description-fragment").value || null;
		if (value) parameterization.set("description-fragment", value);
		
		value = recipesQuerySection.querySelector("input.instruction-fragment").value || null;
		if (value) parameterization.set("instruction-fragment", value);

		value = recipesQuerySection.querySelector("input.owner-email").value || null;
		if (value) parameterization.set("owner-email", value);

		value = recipesQuerySection.querySelector("select.category").value || null;
		if (value) parameterization.set("category", value);

		value = recipesQuerySection.querySelector("select.restriction").value || null;
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
		if (recipe) console.log("displaying recipe: " + recipe.title);
		const template = document.querySelector("head > template.recipe-view");
		const recipeViewSection = template.content.firstElementChild.cloneNode(true);

		while (!this.centerArticle.lastElementChild.classList.contains("recipes-view"))
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(recipeViewSection);

		//add add-new-ingredient button event
		//recipeViewSection.querySelector("button.add-new-ingredient").addEventListener("click", event => console.log("add-new-ingredient pressed"));
		//recipeViewSection.querySelector("button.add-new-ingredient").addEventListener("click", event => this.addIngredient (recipe, 	));
		recipeViewSection.querySelector("button.add-new-ingredient").addEventListener("click", event => this.displayIngredientsTypes);
		

		//submitData (recipe)
		recipeViewSection.querySelector("button.save-recipe-changes").addEventListener("click", event => console.log("2-save-recipe-changes button clicked"));
		recipeViewSection.querySelector("button.save-recipe-changes").addEventListener("click", event => this.submitData(recipe));
		
		//change input readonly attribute to false
		recipeViewSection.querySelector("input.title").readOnly = false;
		recipeViewSection.querySelector("textarea.description").readOnly = false;
		recipeViewSection.querySelector("textarea.instruction").readOnly = false;
		recipeViewSection.querySelector("select.category").disabled = false;

		//check if recipe is null
		if (recipe){
			console.log("recipe is not null");

			//avatar drop event > submitData (recipe)
			recipeViewSection.querySelector("img.avatar").addEventListener("click", event => {console.log("avatar clicked" + recipe.title ), this.submitAvatar(recipe)});
			recipeViewSection.querySelector("img.avatar").addEventListener("drop", event => {console.log("avatar dropped" + recipe.title ), this.submitAvatar(recipe, event.dataTransfer.files[0])});

			recipeViewSection.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar";
			recipeViewSection.querySelector("select.category").value = recipe.category;
			recipeViewSection.querySelector("input.title").value = recipe.title;
			recipeViewSection.querySelector("textarea.description").value = recipe.description;
			recipeViewSection.querySelector("textarea.instruction").value = recipe.instruction;
			recipeViewSection.querySelector("input.pescatarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.pescatarian, true);
			recipeViewSection.querySelector("input.lacto-ovo-vegetarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoOvoVegetarian, true);
			recipeViewSection.querySelector("input.lacto-vegetarian").checked = recipe.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoVegetarian, true);

			const ingredientsElement = recipeViewSection.querySelector("div.recipe-ingredients tbody");
			while (ingredientsElement.lastElementChild)
				ingredientsElement.lastElementChild.remove();

			const ingredientViewTemplate = document.querySelector("head > template.recipe-ingredient-view");
			for (const ingredient of recipe.ingredients) {
				const ingredientElement = ingredientViewTemplate.content.firstElementChild.cloneNode(true);
				ingredientsElement.append(ingredientElement);

				ingredientElement.querySelector("select.unit").value = ingredient.unit;
				ingredientElement.querySelector("input.amount").value = ingredient.amount;
				ingredientElement.querySelector("img.avatar").src = "/services/documents/" + ingredient.avatarReference;
				
				ingredientElement.querySelector("input.alias").value = ingredient.alias;
				//change from input to select
				//ingredientElement.querySelector("select.alias").value = ingredient.alias;

				ingredientElement.querySelector("input.pescatarian").checked = ingredient.pescatarian;
				ingredientElement.querySelector("input.lacto-ovo-vegetarian").checked = ingredient.lactoOvoVegetarian;
				ingredientElement.querySelector("input.lacto-vegetarian").checked = ingredient.lactoVegetarian;
				ingredientElement.querySelector("input.vegan").checked = ingredient.vegan;

				//mouseover event for avatar
				ingredientElement.querySelector("img.avatar").addEventListener("mouseover", event => console.log("mouseover avatar" + ingredient.alias));
				//when mouseover avatar, change avatar to a different one
				ingredientElement.querySelector("img.avatar").addEventListener("mouseover", event => ingredientElement.querySelector("img.avatar").src = "/services/documents/111");
				//mouseout event for avatar
				ingredientElement.querySelector("img.avatar").addEventListener("mouseout", event => console.log("mouseout avatar" + ingredient.alias));
				//when mouseout avatar, change avatar back to original one
				ingredientElement.querySelector("img.avatar").addEventListener("mouseout", event => ingredientElement.querySelector("img.avatar").src = "/services/documents/" + ingredient.avatarReference);
				//when avatar clicked remove from list
				ingredientElement.querySelector("img.avatar").addEventListener("click", event => console.log("removing : " + ingredient.alias));
				ingredientElement.querySelector("img.avatar").addEventListener("click", event => ingredientElement.remove());
			}

			

		}else{
			console.log("recipe is null");

			//avatar = default avatar
			recipeViewSection.querySelector("img.avatar").src = "/services/documents/1";
		}

		//TODO: checkbox automaticly checked according to ingredienttype
	


		//check if recipe is null > assign owner
		if (recipe){
			this.messageElement.value = "";
			try {
				// GET /services/people/id
				const resource = "/services/people/" + recipe.ownerReference;
				const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
				if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
				const owner = await response.json();
				this.messageElement.value = "ok";

				recipeViewSection.querySelector("input.owner-email").value = owner.email;
			} catch (error) {
				this.messageElement.value = error.message || "a problem occurred!";
			}
		}else{
			//assign session owner to recipe
			recipeViewSection.querySelector("input.owner-email").value = this.sessionOwner.email;
		}

	


	
	}


	addIngredient (recipe, ingredient){
		console.log("++addIngredient (recipe) starting...");
		
		//get the template of ingredient row > clone it
		const ingredientViewTemplate = document.querySelector("template.recipe-ingredient-view");
		const ingredientElement = ingredientViewTemplate.content.firstElementChild.cloneNode(true);
		//get the this.centerArticle of table body > append the clone
		const ingredientsTable = this.centerArticle.querySelector("div.recipe-ingredients tbody");
		ingredientsTable.append(ingredientElement);

		//unlock elements
		ingredientElement.querySelector("input.amount").readOnly = false;
		ingredientElement.querySelector("select.unit").disabled = false;

		//set default avatar
		ingredientElement.querySelector("img.avatar").src = "/services/documents/1";

		//mouseover event for avatar
		ingredientElement.querySelector("img.avatar").addEventListener("mouseover", event => console.log("mouseover avatar" + ingredient.typeReference));
		ingredientElement.querySelector("img.avatar").addEventListener("mouseover", event => ingredientElement.querySelector("img.avatar").src = "/services/documents/111");
		ingredientElement.querySelector("img.avatar").addEventListener("mouseout", event => console.log("mouseout avatar" + ingredient.alias));
		ingredientElement.querySelector("img.avatar").addEventListener("mouseout", event => ingredientElement.querySelector("img.avatar").src = "/services/documents/" + ingredient.avatarReference);
		ingredientElement.querySelector("img.avatar").addEventListener("click", event => console.log("removing : " + ingredient.alias));
		ingredientElement.querySelector("img.avatar").addEventListener("click", event => ingredientElement.remove());
	}

	async getAllIngredientsTypes() {
		console.log("getAllIngredients () starting...");

		try {
			// GET /services/ingredient-types
			const resource = "/services/ingredient-types";
			const response = await fetch(resource, { method: "GET", headers: { "Accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.#ingredientsTypes = await response.json();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
			return;
		}

		console.log("getAllIngredients () finished..." + this.#ingredientsTypes.length);
	}


	async displayIngredientsTypes () {
		console.log("displayIngredientsTypes () starting...");

		//get the template of ingredient row > clone it
		const ingredientViewTemplate = document.querySelector("template.recipe-ingredient-view");
		const ingredientElement = ingredientViewTemplate.content.firstElementChild.cloneNode(true);
		//get the this.centerArticle of table body > append the clone
		const ingredientsTable = this.centerArticle.querySelector("div.recipe-ingredients tbody");
		ingredientsTable.append(ingredientElement);

		//unlock elements

	}




	constraintRestrictions (restriction) {

		//TODO: how to connected?

	}


	async submitData (recipe){
		if(recipe){
			console.log("submitData (recipe): " + recipe.title);
			const json = JSON.stringify(recipe);
			console.log("sending: " + json);
		}else{
			console.log("uppps recipe is null or not completed");
		}

		//TODO: create clone

		//TODO: assign new version number

		//TODO: assign new values to input

		//TODO:  PUT /services/recipes/id

	}

	async submitAvatar (recipe, dropFile){
		console.log("submitAvatar (recipe, dropFile): " + recipe.title);
		const recipeViewSection = this.centerArticle.querySelector("section.recipe-view");
		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/recipes/id/avatar
			const resource = "/services/recipes/" + recipe.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			recipe.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "avatar changed";

			recipeViewSection.querySelector("img.avatar").src = "/services/recipes/" + recipe.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
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
