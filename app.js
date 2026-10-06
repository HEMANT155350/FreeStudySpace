const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const searchInput = document.querySelector("#note-search");
const searchForm = document.querySelector(".search-form");
const classFilter = document.querySelector("#class-filter");
const boardFilter = document.querySelector("#board-filter");
const subjectFilter = document.querySelector("#subject-filter");
const typeFilter = document.querySelector("#type-filter");
const languageFilter = document.querySelector("#language-filter");
const notesGrid = document.querySelector("#notes-grid");
const resultCount = document.querySelector("#result-count");
const catalogMessage = document.querySelector("#catalog-message");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyDescription = document.querySelector("#empty-description");
const resetButton = document.querySelector(".reset-search");
const pdfDialog = document.querySelector("#pdf-dialog");
const pdfDialogTitle = document.querySelector("#pdf-dialog-title");
const pdfDialogMeta = document.querySelector("#pdf-dialog-meta");
const pdfFrame = document.querySelector("#pdf-frame");
const pdfDownload = document.querySelector("#pdf-download");
const pdfOpenNew = document.querySelector("#pdf-open-new");
const dialogClose = document.querySelector("#dialog-close");

const classSubjects = {
    9: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit", "Information Technology", "Artificial Intelligence"],
    10: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit", "Information Technology", "Artificial Intelligence"],
    11: ["English", "Hindi", "Physics", "Chemistry", "Mathematics", "Biology", "Accountancy", "Business Studies", "Economics", "Computer Science", "Informatics Practices", "History", "Geography", "Political Science", "Sociology", "Psychology", "Physical Education", "Entrepreneurship", "Fine Arts"],
    12: ["English", "Hindi", "Physics", "Chemistry", "Mathematics", "Biology", "Accountancy", "Business Studies", "Economics", "Computer Science", "Informatics Practices", "History", "Geography", "Political Science", "Sociology", "Psychology", "Physical Education", "Entrepreneurship", "Fine Arts"]
};

let resources = [];

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

function isValidResource(resource) {
    return resource
        && typeof resource.id === "string"
        && /^[a-z0-9][a-z0-9-]*$/i.test(resource.id)
        && typeof resource.title === "string"
        && resource.title.trim().length > 0
        && [9, 10, 11, 12].includes(Number(resource.class))
        && typeof resource.board === "string"
        && resource.board.trim().length > 0
        && typeof resource.subject === "string"
        && resource.subject.trim().length > 0
        && ["notes", "practical"].includes(resource.type)
        && typeof resource.language === "string"
        && ["English", "Hindi", "Bilingual"].includes(resource.language)
        && (resource.description === undefined || typeof resource.description === "string")
        && (resource.tags === undefined || (Array.isArray(resource.tags) && resource.tags.every((tag) => typeof tag === "string")))
        && typeof resource.pdf === "string"
        && /^pdfs\/[A-Za-z0-9._/-]+\.pdf$/i.test(resource.pdf)
        && !resource.pdf.split("/").some((segment) => segment === "." || segment === "..");
}

function populateSubjects() {
    if (!subjectFilter) return;
    const selectedClass = Number(classFilter ? classFilter.value : 0);
    const selectedBoard = boardFilter ? boardFilter.value : "";
    const previousSelection = subjectFilter.value;
    const manifestSubjects = resources
        .filter((resource) => (!selectedClass || Number(resource.class) === selectedClass)
            && (!selectedBoard || resource.board === selectedBoard))
        .map((resource) => resource.subject);
    const options = new Set([
        ...(selectedClass ? classSubjects[selectedClass] || [] : Object.values(classSubjects).flat()),
        ...manifestSubjects
    ]);

    subjectFilter.replaceChildren(new Option("All subjects", ""));
    [...options].sort((a, b) => a.localeCompare(b)).forEach((subject) => {
        subjectFilter.add(new Option(subject, subject));
    });
    if ([...subjectFilter.options].some((option) => option.value === previousSelection)) {
        subjectFilter.value = previousSelection;
    }
}

function populateBoards() {
    if (!boardFilter) return;
    const previousSelection = boardFilter.value;
    const boards = [...new Set(resources.map((resource) => resource.board))].sort((a, b) => a.localeCompare(b));
    boardFilter.replaceChildren(new Option("All boards", ""));
    boards.forEach((board) => boardFilter.add(new Option(board, board)));
    if (boards.includes(previousSelection)) boardFilter.value = previousSelection;
}

function makeResourceCard(resource) {
    const card = document.createElement("article");
    card.className = "note-card";

    const art = document.createElement("div");
    art.className = "note-art resource-art";
    art.setAttribute("aria-hidden", "true");
    const artIcon = document.createElement("span");
    artIcon.className = "resource-art-icon";
    artIcon.textContent = resource.type === "practical" ? "⚗" : "✎";
    const artLabel = document.createElement("span");
    artLabel.className = "art-label";
    artLabel.textContent = `CLASS ${resource.class}`;
    art.append(artIcon, artLabel);

    const body = document.createElement("div");
    body.className = "note-card-body";

    const meta = document.createElement("div");
    meta.className = "note-meta";
    const subject = document.createElement("span");
    subject.className = "subject-tag";
    subject.textContent = resource.subject.toUpperCase();
    const board = document.createElement("span");
    board.textContent = resource.board || "STUDY RESOURCE";
    meta.append(subject, board);

    const title = document.createElement("h3");
    title.textContent = resource.title;
    const description = document.createElement("p");
    description.textContent = resource.description || `${resource.subject} ${resource.type === "practical" ? "practical file" : "study notes"} for class ${resource.class}.`;

    const tags = document.createElement("div");
    tags.className = "resource-tags";
    const typeTag = document.createElement("span");
    typeTag.className = `resource-tag${resource.type === "practical" ? " type-practical" : ""}`;
    typeTag.textContent = resource.type === "practical" ? "PRACTICAL FILE" : "CHAPTER NOTES";
    const languageTag = document.createElement("span");
    languageTag.className = "resource-tag";
    languageTag.textContent = resource.language;
    tags.append(typeTag, languageTag);

    const actions = document.createElement("div");
    actions.className = "resource-actions";
    const previewButton = document.createElement("button");
    previewButton.className = "preview-button";
    previewButton.type = "button";
    previewButton.textContent = "Preview";
    previewButton.setAttribute("aria-label", `Preview ${resource.title}`);
    previewButton.addEventListener("click", () => openPreview(resource));

    const downloadLink = document.createElement("a");
    downloadLink.className = "resource-download";
    downloadLink.href = resource.pdf;
    downloadLink.download = resource.pdf.split("/").pop();
    downloadLink.setAttribute("aria-label", `Download ${resource.title} PDF`);
    downloadLink.innerHTML = 'Download <span aria-hidden="true">↓</span>';
    actions.append(previewButton, downloadLink);
    body.append(meta, title, description, tags, actions);
    card.append(art, body);
    return card;
}

function renderResources() {
    if (!notesGrid) return;
    const query = searchInput ? searchInput.value.trim().toLocaleLowerCase() : "";
    const selectedClass = classFilter ? classFilter.value : "";
    const selectedBoard = boardFilter ? boardFilter.value : "";
    const selectedSubject = subjectFilter ? subjectFilter.value : "";
    const selectedType = typeFilter ? typeFilter.value : "";
    const selectedLanguage = languageFilter ? languageFilter.value : "";

    const matchingResources = resources.filter((resource) => {
        const searchableText = [
            resource.title,
            resource.subject,
            `class ${resource.class}`,
            resource.type === "practical" ? "practical practical file" : "notes chapter notes",
            resource.description || "",
            resource.language,
            resource.board || "",
            ...(resource.tags || [])
        ].join(" ").toLocaleLowerCase();

        return (!selectedClass || Number(resource.class) === Number(selectedClass))
            && (!selectedBoard || resource.board === selectedBoard)
            && (!selectedSubject || resource.subject === selectedSubject)
            && (!selectedType || resource.type === selectedType)
            && (!selectedLanguage || resource.language === selectedLanguage)
            && (!query || searchableText.includes(query));
    });

    notesGrid.replaceChildren(...matchingResources.map(makeResourceCard));
    if (resultCount) resultCount.textContent = `${matchingResources.length} ${matchingResources.length === 1 ? "PDF resource" : "PDF resources"}`;
    if (emptyState) emptyState.hidden = matchingResources.length > 0;

    if (matchingResources.length === 0 && emptyTitle && emptyDescription) {
        const hasFilters = Boolean(query || selectedClass || selectedSubject || selectedType || selectedLanguage);
        emptyTitle.textContent = resources.length === 0
            ? "The first PDFs are on their way."
            : hasFilters ? "No PDFs match these filters." : "No PDFs in this selection yet.";
        emptyDescription.textContent = resources.length === 0
            ? "Choose a class, subject, or practical file. New PDFs will appear here as they are added."
            : hasFilters ? "Try a different class, subject, resource type, language, or search term."
                : "New notes and practical files for this class will appear here as they are added.";
    }
}

function openPreview(resource) {
    if (!pdfDialog || !pdfFrame || !pdfDialogTitle || !pdfDownload || !pdfOpenNew) return;
    const pdfUrl = new URL(resource.pdf, window.location.href).href;
    pdfDialogTitle.textContent = resource.title;
    if (pdfDialogMeta) {
        pdfDialogMeta.textContent = `Class ${resource.class} · ${resource.subject} · ${resource.type === "practical" ? "Practical file" : "Chapter notes"} · ${resource.language}`;
    }
    pdfFrame.src = pdfUrl;
    pdfDownload.href = pdfUrl;
    pdfDownload.download = resource.pdf.split("/").pop();
    pdfOpenNew.href = pdfUrl;

    if (typeof pdfDialog.showModal === "function") {
        pdfDialog.showModal();
    } else {
        window.open(pdfUrl, "_blank", "noopener");
    }
}

function closePreview() {
    if (pdfDialog && pdfDialog.open) pdfDialog.close();
}

if (pdfDialog) {
    pdfDialog.addEventListener("close", () => {
        if (pdfFrame) pdfFrame.src = "about:blank";
    });
    pdfDialog.addEventListener("click", (event) => {
        if (event.target === pdfDialog) closePreview();
    });
}
if (dialogClose) dialogClose.addEventListener("click", closePreview);

if (classFilter) {
    classFilter.addEventListener("change", () => {
        populateSubjects();
        renderResources();
    });
}
if (boardFilter) {
    boardFilter.addEventListener("change", () => {
        populateSubjects();
        renderResources();
    });
}
if (subjectFilter) subjectFilter.addEventListener("change", renderResources);
if (typeFilter) typeFilter.addEventListener("change", renderResources);
if (languageFilter) languageFilter.addEventListener("change", renderResources);
if (searchInput) searchInput.addEventListener("input", renderResources);

if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const notesSection = document.querySelector("#notes");
        if (notesSection) notesSection.scrollIntoView({ behavior: "smooth" });
        renderResources();
    });
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        if (classFilter) classFilter.value = "";
        if (boardFilter) boardFilter.value = "";
        if (subjectFilter) subjectFilter.value = "";
        if (typeFilter) typeFilter.value = "";
        if (languageFilter) languageFilter.value = "";
        if (searchInput) searchInput.value = "";
        populateSubjects();
        renderResources();
        if (searchInput) searchInput.focus();
    });
}

async function loadResources() {
    if (catalogMessage) {
        catalogMessage.dataset.state = "loading";
        catalogMessage.textContent = "Loading study resources…";
    }
    try {
        const response = await fetch("notes.json", { cache: "no-cache" });
        if (!response.ok) throw new Error(`Catalogue request failed: HTTP ${response.status}`);
        const catalogue = await response.json();
        if (!catalogue || !Array.isArray(catalogue.resources)) {
            throw new TypeError("The PDF catalogue must contain a resources array.");
        }

        const invalidResources = catalogue.resources.filter((resource) => !isValidResource(resource));
        if (invalidResources.length > 0) {
            throw new TypeError(`${invalidResources.length} catalogue resource(s) have invalid fields or PDF paths.`);
        }
        const ids = new Set();
        resources = catalogue.resources.map((resource) => ({
            ...resource,
            class: Number(resource.class),
            tags: Array.isArray(resource.tags) ? resource.tags : []
        }));
        resources.forEach((resource) => {
            if (ids.has(resource.id)) throw new TypeError(`Duplicate resource id: ${resource.id}`);
            ids.add(resource.id);
        });

        if (catalogMessage) {
            catalogMessage.dataset.state = "ready";
            catalogMessage.textContent = "";
        }
        if (notesGrid) notesGrid.setAttribute("aria-busy", "false");
        populateBoards();
        populateSubjects();
        renderResources();
    } catch (error) {
        if (notesGrid) notesGrid.setAttribute("aria-busy", "false");
        if (catalogMessage) {
            catalogMessage.dataset.state = "error";
            catalogMessage.textContent = "Study resources couldn't be loaded. Check the catalogue and reload the page.";
        }
        if (resultCount) resultCount.textContent = "Catalogue unavailable";
        if (emptyState) emptyState.hidden = false;
        if (emptyTitle) emptyTitle.textContent = "We couldn't load the PDF catalogue.";
        if (emptyDescription) emptyDescription.textContent = "Please try again later, or contact the site owner.";
        console.error("Unable to load the study PDF catalogue.", error);
    }
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
loadResources();