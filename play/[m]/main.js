document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu a");
    const contentContainer = document.querySelector(".content");

    menuItems.forEach((menuItem) => {
        menuItem.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent the default link behavior
            const letter = menuItem.getAttribute("data-letter");
            loadContent(letter);
        });
    });

    // Function to load content
    function loadContent(letter) {
        // Use AJAX or fetch to load content based on the letter
        // For example, fetch content/A.html and insert it into contentContainer
        fetch(`content/${letter}.html`)
            .then((response) => response.text())
            .then((data) => {
                contentContainer.innerHTML = data;
            })
            .catch((error) => {
                console.error("Error loading content:", error);
            });
    }
});
