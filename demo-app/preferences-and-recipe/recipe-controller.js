const RECIPE = {
	created: 1685517075000,
	identity: 36,
	modified: 1685517075000,
	version: 1,
	category: "MAIN_COURSE",
	title: 	"Spaghetti Bolognese",
	description: "Spaghetti mit Hackfleischsosse",
	instruction: "Spaghetti ca. 8-10min in Salzwasser kochen bis sie al-dente sind. Hackfleisch zusammen mit den gehackten Zwiebeln anbraten, Gewuerze, Tomatenmark sowie passierte Tomaten zugeben, alles gut vermengen, danach abschmecken.",
	avatarReference: 1,
	ingredients: [
		{
			created: 1685517075000,
			identity: 39,
			modified: 1685517075000,
			version: 1,
			amount: 250,
			unit: "GRAM",
			alias: "Hackfleisch (gemischt)",
			description: "Rinder- und Schweinehackfleisch gemischt",
			pescatarian: true,
			lactoOvoVegetarian: false,
			lactoVegetarian: false,
			vegan: false,
			avatarReference: 1
		},
		{
			created: 1685517075000,
			identity: 43,
			modified: 1685517075000,
			version: 1,
			amount: 1,
			unit: "TEASPOON",
			alias: "Pfeffer (Pulver)",
			description: "Gemahlener Pfeffer",
			pescatarian: true,
			lactoOvoVegetarian: true,
			lactoVegetarian: true,
			vegan: true,
			avatarReference: 1
		}
	],
	illustrations: []
};


class RecipeController extends Object {
	#centerArticle;

	constructor () {
		super();

		this.#centerArticle = document.querySelector("main > article.center");
	}


	get centerArticle () {
		return this.#centerArticle;
	}


	activate () {
		const template = document.querySelector("head > template.recipe");
		const recipeSection = template.content.firstElementChild.cloneNode(true);

		this.#centerArticle.innerHTML = "";
		this.#centerArticle.append(recipeSection);

		const avatarImage = recipeSection.querySelector("img.avatar");
		avatarImage.addEventListener("drop", event => this.commitAvatar(event.dataTransfer.files[0]));

		avatarImage.src = "/services/recipes/" + RECIPE.identity + "/avatar";
		recipeSection.querySelector("select.category").value = RECIPE.category;
		recipeSection.querySelector("input.title").value = RECIPE.title;
		recipeSection.querySelector("textarea.description").value = RECIPE.description;
		recipeSection.querySelector("textarea.instruction").value = RECIPE.instruction;
		recipeSection.querySelector("input.pescatarian").checked = RECIPE.ingredients.reduce((accu, ingredient) => accu && ingredient.pescatarian, true);
		recipeSection.querySelector("input.lacto-ovo-vegetarian").checked = RECIPE.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoOvoVegetarian, true);
		recipeSection.querySelector("input.lacto-vegetarian").checked = RECIPE.ingredients.reduce((accu, ingredient) => accu && ingredient.lactoVegetarian, true);
		recipeSection.querySelector("input.vegan").checked = RECIPE.ingredients.reduce((accu, ingredient) => accu && ingredient.vegan, true);

		const ingredientsElement = recipeSection.querySelector("div.recipe-ingredients tbody");
		ingredientsElement.innerHTML = "";

		const ingredientTemplate = document.querySelector("head > template.recipe-ingredient-row");
		for (const ingredient of RECIPE.ingredients) {
			const ingredientElement = ingredientTemplate.content.firstElementChild.cloneNode(true);
			ingredientsElement.append(ingredientElement);

			ingredientElement.querySelector("select.unit").value = ingredient.unit;
			ingredientElement.querySelector("input.amount").value = ingredient.amount;
			ingredientElement.querySelector("img.avatar").src = "/services/documents/" + RECIPE.avatarReference;
			ingredientElement.querySelector("input.alias").value = ingredient.alias;
			ingredientElement.querySelector("input.pescatarian").checked = ingredient.pescatarian;
			ingredientElement.querySelector("input.lacto-ovo-vegetarian").checked = ingredient.lactoOvoVegetarian;
			ingredientElement.querySelector("input.lacto-vegetarian").checked = ingredient.lactoVegetarian;
			ingredientElement.querySelector("input.vegan").checked = ingredient.vegan;
		}
	}


	commitAvatar (dropFile) {
		const recipeSection = this.centerArticle.querySelector("section.recipe");
		if (!dropFile.type.startsWith("image/")) throw new RangeError();

		console.log(dropFile);
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
