// script.js

document.addEventListener("DOMContentLoaded", function() {
    const gbutton = document.getElementById("g-link");
    const rbutton = document.getElementById("r-link");
    const wbutton = document.getElementById("w-link");
    const contentContainer = document.getElementById("content-container");

    gbutton.addEventListener("click", function() {
        loadContent("./g/gantt.html");
    });

    rbutton.addEventListener("click", function() {
        loadContent("./r/finger.html");
    });

    wbutton.addEventListener("click", function() {
        loadContent("./w/trader7.html");
    });

    function loadContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(content => {
                contentContainer.innerHTML = content;
            })
            .catch(error => {
                console.error('Error loading content:', error);
            });
    }
});
