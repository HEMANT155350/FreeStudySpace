const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function closeNavigation(returnFocus = false) {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    if (returnFocus) menuToggle.focus();
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            closeNavigation(true);
        }
    });

    document.addEventListener("click", (event) => {
        if (event.target instanceof Node && !navigation.contains(event.target) && !menuToggle.contains(event.target)) {
            closeNavigation();
        }
    });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
