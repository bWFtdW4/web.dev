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
		addNewIngredientButton.addEventListener("click", event => this.addNewIngredientType());
		
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

	async editIngredientType(ingredientType) {
		console.log("editIngredientType");
		//console.log("what is in the inbox :" + ingredientType + " name: " + ingredientType.alias);

		//display ingredientType in ingredient-type-editor-result-row
		const templateRow = document.querySelector("head > template.ingredient-type-editor-result-row");
		const ingredientTypeRow = templateRow.content.firstElementChild.cloneNode(true);
		const ingredientTypeTableBody = document.querySelector("div.ingredient-type-editor-result tbody");
		if (ingredientType) ingredientTypeTableBody.append(ingredientTypeRow);

		while (!this.centerArticle.lastElementChild.classList.contains("ingredient-type-editor"))
		this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(ingredientTypeRow);

		//if (ingredientType){
			ingredientTypeRow.querySelector("img.avatar").src = "/services/ingredient-types/" + ingredientType.identity + "/avatar?cache-bust=" + Date.now();
			ingredientTypeRow.querySelector("input.alias").value = ingredientType.alias;
			ingredientTypeRow.querySelector("input.description").value = ingredientType.description;
			ingredientTypeRow.querySelector("input.pescatarian").checked = ingredientType.pescatarian;
			ingredientTypeRow.querySelector("input.lacto-ovo-vegetarian").checked = ingredientType.lactoOvoVegetarian;
			ingredientTypeRow.querySelector("input.lacto-vegetarian").checked = ingredientType.lactoVegetarian;
			ingredientTypeRow.querySelector("input.vegan").checked = ingredientType.vegan;	
		//}else{
		//	ingredientTypeRow.querySelector("img.avatar").src = "/services/documents/1?cache-bust=" + Date.now();
		//}

		if (ingredientType) console.log("avatar ID: " + ingredientType.identity);
		console.log("alias: " + ingredientTypeRow.querySelector("input.alias").value);

		//drop event for avatar -> submitAvatar > send dropfile + ingredientType
		const avatarImage = ingredientTypeRow.querySelector("img.avatar");
		avatarImage.addEventListener("drop", event => this.submitAvatar(event.dataTransfer.files[0], ingredientType));

		// when press "saveNewIngredient"  > post > ingredientTypesClone;
		const saveNewIngredient = document.querySelector("section.ingredient-type-editor > button.saveNewIngredient");
		saveNewIngredient.addEventListener("click", event => this.updateIngredientTypeData(ingredientType));

		

	}



	async updateIngredientTypeData(ingredientType){
		console.log("updateIngredientTypeData");
		console.log("what is in the box :" + ingredientType + " name: " + ingredientType.alias);

		//create clone of ingredientType
		const ingredientTypeClone = window.structuredClone(ingredientType);
		console.log("__ingredientTypeClone created with id: " + ingredientTypeClone.identity);
		
		
		//check the path of ingredientType input
		//html > bodv > main > article.center > tr > td > inputalias
		//bad console.log("check1: " + document.querySelector("div.ingredient-type-editor-result tbody input.alias").value || null);
		//bad console.log("check2: " + document.querySelector("div.ingredient-type-editor-result> table > tbody > tr > td > input.alias").value || null);
		//bad console.log("check3: " + document.querySelector("bodv > main > article.center > tr > td > inputalias").value || null);
		//bad console.log("check4: " + document.querySelector("input.alias").value || null);
		
		
		const ingredientElements = document.querySelector("ingredient-type-editor-result-row");
		console.log("+++++++ ingredientElements : " + ingredientElements);
		const ingredientElement = ingredientElements.querySelector("input.alias");
		console.log("+++++++ ingredientElement : " + ingredientElement.value);

		//update ingredientTypeClone with new data
		ingredientTypeClone.identity = ingredientType.identity;
		ingredientTypeClone.alias = document.querySelector("div.ingredient-type-editor-result tbody input.alias").value.trim() || null;
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
		console.log("submitAvatar: " + dropFile);
		console.log("submit Avatar got the ingredientType.alias : " + ingredientType.alias );
		
		//html > body > main > article.center > div.ingredient-type-editor-result > table > tbody > tr > td > img.avatar
		//const preferencesSection = this.centerArticle.querySelector("type-editor-result-row");
		const avatarSection = this.centerArticle.querySelector("type-editor-result-row");
		
		
		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");
			
			// PUT /services/ingredient-types/id/avatar
			const resource = "/services/ingredient-types/" + ingredientType.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			console.log("POST this avatar: " + response);
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.sessionOwner.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "avatar updated";
			
			avatarSection.querySelector("img.avatar").src = "/services/ingredient-types/" + ingredientType.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}


	async addNewIngredientType() {
		console.log("addNewIngredientType");
		
		//display table header same as in editIngredientType
		this.editIngredientType(null);
		
		//display table empty row same as in editIngredientType
		//>done via editIngredientType(null)

		//activate "save recipe" button same as in displayIngredientTypes
		

		//send this ingredientType to updateIngredientTypeData(ingredientType)

	
	
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
