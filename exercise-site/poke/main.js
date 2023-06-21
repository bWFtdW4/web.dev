const ANIMAL ={
	dexNr: 1,
	nameDe:	"Bisasam",
	nameEn:	"Bulbasaur"
}

window.addEventListener("load", event => {
	const centerArticle = document.querySelector("main > article.center");
	const dexSection = centerArticle.querySelector("section.dex");

	dexSection.querySelector("input.dexNr").value = ANIMAL.dexNr;
	dexSection.querySelector("input.nameDe").value = ANIMAL.nameDe;
	dexSection.querySelector("input.nameEn").value = ANIMAL.nameEn;


});