import Controller from "../../../util/controller.js";


class PreferencesController extends Controller {

	constructor () {
		super();
	}


	async activate () {
		console.log("preferences controller activating.");
		const sectionTemplate = document.querySelector("head > template.preferences");
		this.rootSection = sectionTemplate.content.firstElementChild.cloneNode(true);

		while (this.centerArticle.lastElementChild)
			this.centerArticle.lastElementChild.remove();
		this.centerArticle.append(this.rootSection);

		const avatarView = this.rootSection.querySelector("img.avatar");
		const submitButton = this.rootSection.querySelector("button.submit");
		const addPhoneButton = this.rootSection.querySelector("button.add-phone");
		avatarView.addEventListener("drop", event => this.submitAvatar(event.dataTransfer.files[0]));
		addPhoneButton.addEventListener("click", event => this.addPhoneInput(null));
		submitButton.addEventListener("click", event => this.submitSessionOwner());

		this.displaySessionOwner();
	}


	deactivate () {
		console.log("preferences controller deactivating.");
		this.rootSection = null;
	}


	displaySessionOwner () {
		const avatarImage = this.rootSection.querySelector("img.avatar");
		const emailElement = this.rootSection.querySelector("input.email");
		const groupElement = this.rootSection.querySelector("select.group");
		const titleElement = this.rootSection.querySelector("input.title");
		const surnameElement = this.rootSection.querySelector("input.surname");
		const forenameElement = this.rootSection.querySelector("input.forename");
		const streetElement = this.rootSection.querySelector("input.street");
		const cityElement = this.rootSection.querySelector("input.city");
		const countryElement = this.rootSection.querySelector("input.country");
		const postcodeElement = this.rootSection.querySelector("input.postcode");
		const phonesElement = this.rootSection.querySelector("fieldset > div.phones");
		
		avatarImage.src = "/services/people/" + this.sessionOwner.identity + "/avatar?cache-bust=" + Date.now();
		emailElement.value = this.sessionOwner.email;
		groupElement.value = this.sessionOwner.group;
		titleElement.value = this.sessionOwner.name.title;
		surnameElement.value = this.sessionOwner.name.family;
		forenameElement.value = this.sessionOwner.name.given;
		streetElement.value = this.sessionOwner.address.street;
		cityElement.value = this.sessionOwner.address.city;
		countryElement.value = this.sessionOwner.address.country;
		postcodeElement.value = this.sessionOwner.address.postcode;
		while (phonesElement.lastElementChild)
			phonesElement.lastElementChild.remove();
		for (const phone of this.sessionOwner.phones)
			this.addPhoneInput(phone);

		emailElement.addEventListener("input", event => this.validateRootSection());
		surnameElement.addEventListener("input", event => this.validateRootSection());
		forenameElement.addEventListener("input", event => this.validateRootSection());
		streetElement.addEventListener("input", event => this.validateRootSection());
		cityElement.addEventListener("input", event => this.validateRootSection());
		countryElement.addEventListener("input", event => this.validateRootSection());
		postcodeElement.addEventListener("input", event => this.validateRootSection());
	}


	addPhoneInput (phone) {
		const phonesElement = this.rootSection.querySelector("fieldset > div.phones");

		const divElement = document.createElement("div");
		phonesElement.append(divElement);

		const phoneElement = document.createElement("input");
		divElement.append(phoneElement);
		phoneElement.className = "phone default";
		phoneElement.type = "tel";
		phoneElement.value = phone;
	}


	validateRootSection () {
		const inputElements = Array.from(this.rootSection.querySelectorAll('input'));
		const submitButton = this.rootSection.querySelector("button.submit");
		submitButton.disabled = inputElements.some(element => !element.reportValidity());
	}


	async submitSessionOwner () {
		const personClone = window.structuredClone(this.sessionOwner);

		const password = this.rootSection.querySelector("input.password").value.trim() || null;
		personClone.email = this.rootSection.querySelector("input.email").value.trim() || null;
		personClone.group = this.rootSection.querySelector("select.group").value.trim() || null;
		personClone.name.title = this.rootSection.querySelector("input.title").value.trim() || null;
		personClone.name.family = this.rootSection.querySelector("input.surname").value.trim() || null;
		personClone.name.given = this.rootSection.querySelector("input.forename").value.trim() || null;
		personClone.address.street = this.rootSection.querySelector("input.street").value.trim() || null;
		personClone.address.city = this.rootSection.querySelector("input.city").value.trim() || null;
		personClone.address.country = this.rootSection.querySelector("input.country").value.trim() || null;
		personClone.address.postcode = this.rootSection.querySelector("input.postcode").value.trim() || null;

		personClone.phones.length = 0;
		for (const phoneElement of this.rootSection.querySelectorAll("input.phone")) {
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

		this.displaySessionOwner();
	}


	async submitAvatar (dropFile) {
		this.messageElement.value = "";
		try {
			if (!dropFile.type || !dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/people/id/avatar
			const resource = "/services/people/" + this.sessionOwner.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			this.sessionOwner.avatarReference = Number.parseInt(await response.text());
			this.messageElement.value = "ok";

			this.rootSection.querySelector("img.avatar").src = "/services/people/" + this.sessionOwner.identity + "/avatar?cache-bust=" + Date.now();
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
