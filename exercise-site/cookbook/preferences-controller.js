import Controller from "../../util/controller.js";


class PreferencesController extends Controller {

	constructor () {
		super();
	}


	async activate () {
		console.log("preferences controller activating.");
		const template = document.querySelector("head > template.preferences");
		const preferencesSection = template.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(preferencesSection);

		const avatarImage = preferencesSection.querySelector("img.avatar");
		const submitButton = preferencesSection.querySelector("button.submit");
		const addPhoneButton = preferencesSection.querySelector("button.add-phone");
		avatarImage.addEventListener("drop", event => this.submitAvatar(event => this.submitAvatar(event.dataTransfer.files[0])));
		submitButton.addEventListener("click", event => this.submitData());
		addPhoneButton.addEventListener("click", event => this.addPhoneInput(null));

		this.displaySessionOwner ();
	}


	deactivate () {
		console.log("preferences controller deactivating.");
	}

	displaySessionOwner () {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");
		preferencesSection.querySelector("img.avatar").src = "/services/people/" + this.sessionOwner.identity + "/avatar?cache-bust=" + Date.now();
		preferencesSection.querySelector("input.identity").value = this.sessionOwner.identity;
		preferencesSection.querySelector("input.email").value = this.sessionOwner.email;
		preferencesSection.querySelector("select.group").value = this.sessionOwner.group;
		preferencesSection.querySelector("input.title").value = this.sessionOwner.name.title;
		preferencesSection.querySelector("input.surname").value = this.sessionOwner.name.family;
		preferencesSection.querySelector("input.forename").value = this.sessionOwner.name.given;
		preferencesSection.querySelector("input.street").value = this.sessionOwner.address.street;
		preferencesSection.querySelector("input.city").value = this.sessionOwner.address.city;
		preferencesSection.querySelector("input.country").value = this.sessionOwner.address.country;
		preferencesSection.querySelector("input.postcode").value = this.sessionOwner.address.postcode;

		const phonesElement = preferencesSection.querySelector("fieldset > div.phones");
		phonesElement.innerHTML = "";
		for (const phone of this.sessionOwner.phones)
			this.addPhoneInput(phone);
	}


	addPhoneInput (phone) {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");
		const phonesElement = preferencesSection.querySelector("fieldset > div.phones");

		const divElement = document.createElement("div");
		phonesElement.append(divElement);

		const phoneElement = document.createElement("input");
		divElement.append(phoneElement);
		phoneElement.className = "phone default";
		phoneElement.type = "tel";
		phoneElement.value = phone;
	}


	async submitData () {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");
		const personClone = window.structuredClone(this.sessionOwner);

		const password = preferencesSection.querySelector("input.password").value.trim() || null;
		personClone.identity = preferencesSection.querySelector("input.identity").value.trim() || null;
		personClone.email = preferencesSection.querySelector("input.email").value.trim() || null;
		personClone.group = preferencesSection.querySelector("select.group").value.trim() || null;
		personClone.name.title = preferencesSection.querySelector("input.title").value.trim() || null;
		personClone.name.family = preferencesSection.querySelector("input.surname").value.trim() || null;
		personClone.name.given = preferencesSection.querySelector("input.forename").value.trim() || null;
		personClone.address.street = preferencesSection.querySelector("input.street").value.trim() || null;
		personClone.address.city = preferencesSection.querySelector("input.city").value.trim() || null;
		personClone.address.country = preferencesSection.querySelector("input.country").value.trim() || null;
		personClone.address.postcode = preferencesSection.querySelector("input.postcode").value.trim() || null;

		personClone.phones.length = 0;
		for (const phoneElement of preferencesSection.querySelectorAll("input.phone")) {
			const phone = phoneElement.value.trim() || null;
			if (phone) personClone.phones.push(phone);
		}

		this.messageElement.value = "";
		try {
			// PUT /services/people
			const json = JSON.stringify(personClone);
			const headers = { "Content-Type": "application/json", "Accept": "text/plain" };
			if (password) headers["X-Set-Password"] = password;

			const response = await fetch("/services/people", { method: "POST", headers: headers, body: json });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.messageElement.value = "ok";

			if (password)
				document.querySelector("header > nav > button.authentication").click();
			else
				for (const key in this.sessionOwner)
					this.sessionOwner[key] = personClone[key];
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}

		this.displaySessioOwner();
	}


	async submitAvatar (dropFile) {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");

		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/people/id/avatar
			const resource = "/services/people/" + this.sessionOwner.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.sessionOwner.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "ok";

			preferencesSection.querySelector("img.avatar").src = "/services/people/" + person.identity + "/avatar?cache-bust=" + Date.now();
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}
}


window.addEventListener("load", event => {
	const controller = new PreferencesController();
	const menuButtons = document.querySelectorAll("header > nav > button");
	const menuButton = Array.from(menuButtons).find(button => button.classList.contains("preferences"));

	for (const button of menuButtons) {
		const active = button.classList.contains("preferences");
		button.addEventListener("click", event => controller.active = active);
	}

	menuButton.addEventListener("click", event => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});
});
