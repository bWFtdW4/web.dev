import Controller from "./controller.js";
import xhr from "../../util/xhr.js";


class AuthenticationController extends Controller {

	constructor () {
		super();
	}


	async activate () {
		this.sessionOwner = null;	// logout

		const menuButtons = document.querySelectorAll("header > nav > button");
		for (const menuButton of menuButtons)
			if (!menuButton.classList.contains("authentication"))
				menuButton.disabled = true;

		const template = document.querySelector("head > template.authentication");
		const authenticationSection = template.content.firstElementChild.cloneNode(true);

		this.centerArticle.innerHTML = "";
		this.centerArticle.append(authenticationSection);
		const submitButton = authenticationSection.querySelector("button.submit");
		submitButton.addEventListener("click", event => this.authenticate());
	}


	async authenticate () {
		const authenticationSection = this.centerArticle.querySelector("section.authentication");
		const email = authenticationSection.querySelector("input.email").value || null;
		const password = authenticationSection.querySelector("input.password").value || null;
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
						menuButton.disabled = false;

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

	menuButton.addEventListener("click", () => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});

	menuButton.addEventListener("click", () => controller.activate());

	menuButton.click();
});
