const PERSON = {
	created: 1685517075000,
	identity: 2,
	modified: 1686132291816,
	version: 1,
	email: "guest@cookbook.de",
	group: "USER",
	avatarReference: 1,
	address: {
		city: "Berlin",
		country: "Deutschland",
		postcode: "10557",
		street: "Spreeweg 1"
	},
	name: {
		title: null,
		family: "Guest",
		given: "Any"
	},
	phones: [ "0171/22446688", "0177/123456789"  ],
	recipereferences: []
};


function commitData () {
	const centerArticle = document.querySelector("main > article.center");
	const preferencesSection = centerArticle.querySelector("section.preferences");
	const person = window.structuredClone(PERSON);

	const password = preferencesSection.querySelector("input.password").value.trim() || null;
	person.identity = preferencesSection.querySelector("input.identity").value.trim() || null;
	person.email = preferencesSection.querySelector("input.email").value.trim() || null;
	person.group = preferencesSection.querySelector("select.group").value.trim() || null;
	person.name.title = preferencesSection.querySelector("input.title").value.trim() || null;
	person.name.family = preferencesSection.querySelector("input.surname").value.trim() || null;
	person.name.given = preferencesSection.querySelector("input.forename").value.trim() || null;
	person.address.street = preferencesSection.querySelector("input.street").value.trim() || null;
	person.address.city = preferencesSection.querySelector("input.city").value.trim() || null;
	person.address.country = preferencesSection.querySelector("input.country").value.trim() || null;
	person.address.postcode = preferencesSection.querySelector("input.postcode").value.trim() || null;

	person.phones.length = 0;
	for (const phoneElement of preferencesSection.querySelectorAll("input.phone")) {
		const phone = phoneElement.value.trim() || null;
		if (phone) person.phones.push(phone);
	}

	preferencesSection.querySelector("pre.json").innerText = JSON.stringify(person);
	preferencesSection.querySelector("pre.password").innerText = password;
}


function commitAvatar (dropFile) {
	const centerArticle = document.querySelector("main > article.center");
	const preferencesSection = centerArticle.querySelector("section.preferences");
	if (!dropFile.type.startsWith("image/")) throw new RangeError();

	const preElement = preferencesSection.querySelector("pre.drop-file");
	preElement.innerText = dropFile.name + ": " + dropFile.size;
}


window.addEventListener("load", event => {
	const centerArticle = document.querySelector("main > article.center");
	const preferencesSection = centerArticle.querySelector("section.preferences");

	const commitButton = centerArticle.querySelector("button.submit");
	commitButton.addEventListener("click", event => commitData());

	const avatarImage = preferencesSection.querySelector("img.avatar");
	avatarImage.addEventListener("drop", event => commitAvatar(event.dataTransfer.files[0]));
	avatarImage.src = "/services/people/2/avatar";
	// console.log(avatarImage);

	// const inputElements = preferencesSection.querySelectorAll("input");
	// inputElements[0].value = PERSON.identity + "";
	// inputElements[1].value = PERSON.email;
	// inputElements[3].value = PERSON.name.title;
	
	preferencesSection.querySelector("input.identity").value = PERSON.identity;
	preferencesSection.querySelector("input.email").value = PERSON.email;
	preferencesSection.querySelector("select.group").value = PERSON.group;
	preferencesSection.querySelector("input.title").value = PERSON.name.title;
	preferencesSection.querySelector("input.surname").value = PERSON.name.family;
	preferencesSection.querySelector("input.forename").value = PERSON.name.given;
	preferencesSection.querySelector("input.street").value = PERSON.address.street;
	preferencesSection.querySelector("input.city").value = PERSON.address.city;
	preferencesSection.querySelector("input.country").value = PERSON.address.country;
	preferencesSection.querySelector("input.postcode").value = PERSON.address.postcode;

	const phonesElement = preferencesSection.querySelector("fieldset > div.phones");
	phonesElement.innerHTML = "";

	for (const phone of PERSON.phones) {
		const divElement = document.createElement("div");
		phonesElement.append(divElement);

		const phoneElement = document.createElement("input");
		divElement.append(phoneElement);
		phoneElement.className = "phone default";
		phoneElement.type = "tel";
		phoneElement.value = phone;
	}
});
