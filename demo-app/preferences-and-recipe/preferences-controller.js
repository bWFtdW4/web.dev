import Controller from "./controller.js";


class PreferencesController extends Controller {

	constructor () {
		super();
	}


	async activate () {
		const template = document.querySelector("head > template.preferences");
		const preferencesSection = template.content.firstElementChild.cloneNode(true);

		this.centerArticle.innerHTML = "";
		this.centerArticle.append(preferencesSection);
		const avatarImage = preferencesSection.querySelector("img.avatar");
		const commitButton = preferencesSection.querySelector("button.submit");
		const addPhoneButton = preferencesSection.querySelector("button.add-phone");
		addPhoneButton.addEventListener("click", event => this.addPhoneInput(""));

		// GET /services/people/3
		this.messageElement.value = "";
		try {
			const response = await fetch("/services/people/3", { method: "GET", headers: { "Accept": "application/json" }});
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			const person = await response.json();
			this.messageElement.value = "ok";

			commitButton.addEventListener("click", event => this.commitData(person));
			avatarImage.addEventListener("drop", event => this.commitAvatar(person, event.dataTransfer.files[0]));

			this.displayPerson (person);
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}
	}


	displayPerson (person) {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");
		preferencesSection.querySelector("img.avatar").src = "/services/people/" + person.identity + "/avatar?cache-bust=" + Date.now();
		preferencesSection.querySelector("input.identity").value = person.identity;
		preferencesSection.querySelector("input.email").value = person.email;
		preferencesSection.querySelector("select.group").value = person.group;
		preferencesSection.querySelector("input.title").value = person.name.title;
		preferencesSection.querySelector("input.surname").value = person.name.family;
		preferencesSection.querySelector("input.forename").value = person.name.given;
		preferencesSection.querySelector("input.street").value = person.address.street;
		preferencesSection.querySelector("input.city").value = person.address.city;
		preferencesSection.querySelector("input.country").value = person.address.country;
		preferencesSection.querySelector("input.postcode").value = person.address.postcode;

		const phonesElement = preferencesSection.querySelector("fieldset > div.phones");
		phonesElement.innerHTML = "";
		for (const phone of person.phones)
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


	async commitData (person) {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");
		const personClone = window.structuredClone(person);

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

			for (const key in person)
				person[key] = personClone[key];
		} catch (error) {
			this.messageElement.value = error.message || "a problem occurred!";
		}

		this.displayPerson(person);
	}


	async commitAvatar (person, dropFile) {
		const preferencesSection = this.centerArticle.querySelector("section.preferences");

		this.messageElement.value = "";
		try {
			if (!dropFile.type.startsWith("image/")) throw new RangeError("avatar file must be an image!");

			// PUT /services/people/id/avatar
			const resource = "/services/people/" + person.identity + "/avatar";
			const response = await fetch(resource, { method: "PUT", headers: { "Content-Type": dropFile.type, "Accept": "text/plain" }, body: dropFile });
			if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
			person.avatarReference = Number.parseInt(await response.text());
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

	menuButton.addEventListener("click", () => {
		for (const button of menuButtons)
			button.classList.remove("active");
		menuButton.classList.add("active");
	});

	menuButton.addEventListener("click", () => controller.activate());

	menuButton.click();
});
