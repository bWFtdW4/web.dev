import Controller from "../../util/controller.js";


class IngredientTypeEditorController extends Controller {
	
	constructor () {
		super();
	}
	
	
	async activate () {
		console.log("ingredient-type-editor controller activating.");
		const template = document.querySelector("head > template.ingredient-type-editor");
		const ingredientTypeEditorSection = template.content.firstElementChild.cloneNode(true);
		
		while (this.centerArticle.lastElementChild)
		this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(ingredientTypeEditorSection);
		
		const showAllIngredientButton = ingredientTypeEditorSection.querySelector("button.showAllIngredient");
		showAllIngredientButton.addEventListener("click", event => this.getAllIngredient());
		
		const addNewIngredientButton = ingredientTypeEditorSection.querySelector("button.addNewIngredient");
		addNewIngredientButton.addEventListener("click", event => this.addNewIngredient());
		
		/*
		*where tf is the avatar...
		//html > body > main > article.center > div.ingredient-type-editor-result > table > tbody > tr > td > img.avatar
		const avatarImage = document.querySelector("template.ingredient-type-editor-result-row > tr > td > img.avatar");
		const templateForAvatar = document.querySelector("head > template.ingredient-type-editor-result-row ");
		//>copied to editIngredientType
		const avatarSection = templateForAvatar.content.firstElementChild.cloneNode(true);
		const avatarImage = avatarSection.querySelector("img.avatar");
		avatarImage.addEventListener("drop", event => this.submitAvatar(event => this.submitAvatar(event.dataTransfer.files[0])));
		*/
		
	}


	deactivate () {
		console.log("ingredient-type-editor controller deactivating.");
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
		this.displayIngredientTypes(ingredientTypes);
	}


	displayIngredientTypes(ingredientTypes) {
		console.log("displayIngredientTypes");
		console.log("what is in the box :" + ingredientTypes);

		
		const template = document.querySelector("head > template.ingredient-type-editor-result");
		const ingredientTypeQueryResultSection = template.content.firstElementChild.cloneNode(true);
		
		while (!this.centerArticle.lastElementChild.classList.contains("ingredient-type-editor"))
		this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(ingredientTypeQueryResultSection);
		
		const ingredientTypeTableBody = ingredientTypeQueryResultSection.querySelector("table > tbody");
		const rowTemplate = document.querySelector("head > template.ingredient-type-editor-result-row");
		
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
	}

	editIngredientType(ingredientType) {
		console.log("editIngredientType");
		console.log("what is in the box :" + ingredientType + " name: " + ingredientType.alias);

		const template = document.querySelector("head > template.ingredient-type-editor-result");
		const ingredientTypeQueryResultSection = template.content.firstElementChild.cloneNode(true);
		
		while (!this.centerArticle.lastElementChild.classList.contains("ingredient-type-editor"))
		this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(ingredientTypeQueryResultSection);
		
		const ingredientTypeTableBody = ingredientTypeQueryResultSection.querySelector("table > tbody");
		const rowTemplate = document.querySelector("head > template.ingredient-type-editor-result-row");
		
		const ingredientTypesRow = rowTemplate.content.firstElementChild.cloneNode(true);
		ingredientTypeTableBody.append(ingredientTypesRow);
		
		ingredientTypesRow.querySelector("img.avatar").src = "/services/ingredient-types/" + ingredientType.identity + "/avatar?cache-bust=" + Date.now();
		ingredientTypesRow.querySelector("input.alias").value = ingredientType.alias;
		ingredientTypesRow.querySelector("input.description").value = ingredientType.description;
		ingredientTypesRow.querySelector("input.pescatarian").checked = ingredientType.pescatarian;
		ingredientTypesRow.querySelector("input.lacto-ovo-vegetarian").checked = ingredientType.lactoOvoVegetarian;
		ingredientTypesRow.querySelector("input.lacto-vegetarian").checked = ingredientType.lactoVegetarian;
		ingredientTypesRow.querySelector("input.vegan").checked = ingredientType.vegan;

		// when press "saveNewIngredient"  > post > ingredientTypesClone;
		const saveNewIngredient = document.querySelector("section.ingredient-type-editor > button.saveNewIngredient");
		saveNewIngredient.addEventListener("click", event => this.updateIngredientTypeData(ingredientType));
		
		/*
		//send clone to submitAvatar for id?
		submitAvatar(ingredientType);
		*/
		const templateForAvatar = document.querySelector("head > template.ingredient-type-editor-result-row ");
		const avatarSection = templateForAvatar.content.firstElementChild.cloneNode(true);
		const avatarImage = avatarSection.querySelector("img.avatar");
		avatarImage.addEventListener("drop", event => this.submitAvatar(event => this.submitAvatar(event.dataTransfer.files[0])));
		avatarImage.addEventListener("drop", event => this.submitAvatar(event => this.submitAvatar(ingredientType)));
	}

	async updateIngredientTypeData(ingredientType){
		console.log("updateIngredientTypeData");
		console.log("what is in the box :" + ingredientType + " name: " + ingredientType.alias);

		const ingredientTypeClone = window.structuredClone(ingredientType);
		console.log("__ingredientTypeClone created with id: " + ingredientTypeClone.identity);
		
		//add ingredientTypeClone avatar update
		
		/*
		const ingredientElement = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > ");
		const theWay = ingredientElement.querySelector("input.alias").value;
		console.log("this is the way : " + theWay);
		*/

		ingredientTypeClone.identity = ingredientType.identity;
		ingredientTypeClone.alias = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.alias").value.trim() || null;
		ingredientTypeClone.description = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.description").value.trim() || null;
		
		ingredientTypeClone.pescatarian = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.pescatarian").checked || false;
		ingredientTypeClone.lactoOvoVegetarian = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.lacto-ovo-vegetarian").checked || false;
		ingredientTypeClone.lactoVegetarian = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.lacto-vegetarian").checked || false;
		ingredientTypeClone.vegan = document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.vegan").checked || false;
		/*
		*/
		
		console.log("__POST > origial ingredientType.alias: " + ingredientType.alias + " to ingredientTypeClone.alias: " + ingredientTypeClone.alias);
		
		this.messageElement.value = "";
		try {
			// PUT /services/ingredient-types/
			const json = JSON.stringify(ingredientTypeClone);
			console.log("POST this: " + json);
			const headers = { "Content-Type": "application/json", "Accept": "text/plain" };
			
			const resource = "/services/ingredient-types/";
			const response = await fetch(resource, { method: "POST", headers: headers, body: json });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText + " u fed up");
			this.messageElement.value = "ok";
			
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
		
	}
	
	
	async submitAvatar (dropFile, ingredientType) {
		console.log("submit Avatar got the ingr. : " + ingredientType.alias );

		//const preferencesSection = this.centerArticle.querySelector("type-editor-result-row");
		const avatarSection = this.centerArticle.querySelector("type-editor-result-row");


		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/ingredient-types/id/avatar
			const resource = "/services/ingredient-types/" + "4" + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.sessionOwner.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "ok";

			avatarSection.querySelector("img.avatar").src = "/services/ingredient-types/" + person.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}


}


window.addEventListener("load", event => {
	const controller = new IngredientTypeEditorController();
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
