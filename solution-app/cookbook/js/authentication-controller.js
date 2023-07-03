import Controller from "../../../util/controller.js";
import xhr from "../../../util/xhr.js";


class AuthenticationController extends Controller {

	constructor () {
		super();
	}


	async activate () {
		console.log("authentication controller activating.");
		this.sessionOwner = null;	// logout

		const menuButtons = document.querySelectorAll("header > nav > button");
		for (const menuButton of menuButtons)
			if (!menuButton.classList.contains("authentication"))
				menuButton.disabled = true;

		const sectionTemplate = document.querySelector("head > template.authentication");
		this.rootSection = sectionTemplate.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(this.rootSection);

		const submitButton = this.rootSection.querySelector("button.submit");
		submitButton.addEventListener("click", event => this.authenticate());
		submitButton.disabled = true;

		this.rootSection.querySelector("input.email").addEventListener("input", event => this.validateRootSection());
		this.rootSection.querySelector("input.password").addEventListener("input", event => this.validateRootSection());
	}


	deactivate () {
		console.log("authentication controller deactivating.");
		this.rootSection = null;
	}


	validateRootSection () {
		const loginSection = this.centerArticle.querySelector("section.authentication");
		const inputElements = Array.from(loginSection.querySelectorAll('input'));
		const submitButton = loginSection.querySelector("button.submit");
		submitButton.disabled = inputElements.some(element => !element.reportValidity());
	}


	async authenticate () {
		const email = this.rootSection.querySelector("input.email").value || null;
		const password = this.rootSection.querySelector("input.password").value || null;
		if (!email || !password) {
			this.messageElement.value = "enter email and password!";
		} else {
			this.messageElement.value = "";
			try {
				// GET /services/people/0
				this.sessionOwner = await xhr("/services/people/0", "GET", { "Accept": "application/json" }, null, "json", email, password);
				this.messageElement.value = "ok";

				const menuButtons = document.querySelectorAll("header > nav > button");
				for (const menuButton of menuButtons)
					if (!menuButton.classList.contains("authentication"))
						menuButton.disabled = menuButton.classList.contains("ingredient-type-editor")
							? this.sessionOwner.group !== "ADMIN"
							: false;

				document.querySelector("header > nav > button.preferences").click();
			} catch (error) {
				this.messageElement.value = error.message || "a problem occurred!";
			}
		}
	}
}


window.addEventListener("load", event => {
	const controller = new AuthenticationController();
	const menuButtons = document.querySelectorAll("header > nav > button");
	const menuButton = Array.from(menuButtons).find(button => button.classList.contains("authentication"));

	for (const button of menuButtons) {
		const active = button.classList.contains("authentication");
		button.addEventListener("click", event => controller.active = active);
	}

	menuButton.addEventListener("click", event => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});

	menuButton.click();
});
