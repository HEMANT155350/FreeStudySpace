const teacherSearch = document.querySelector("#teacher-search");
const teacherSubject = document.querySelector("#teacher-subject");
const favoritesToggle = document.querySelector("#favorites-toggle");
const teacherGrid = document.querySelector("#teacher-grid");
const teacherCount = document.querySelector("#teacher-count");
const teacherMessage = document.querySelector("#teacher-message");
const teacherEmpty = document.querySelector("#teacher-empty");
const teacherEmptyTitle = document.querySelector("#teacher-empty-title");
const teacherEmptyDescription = document.querySelector("#teacher-empty-description");
const teacherNotes = document.querySelector("#teacher-notes");
const teacherNotesTitle = document.querySelector("#teacher-notes-title");
const teacherNotesDescription = document.querySelector("#teacher-notes-description");
const teacherNotesGrid = document.querySelector("#teacher-notes-grid");
const teacherNotesEmpty = document.querySelector("#teacher-notes-empty");
const teacherNotesEmptyTitle = document.querySelector("#teacher-notes-empty-title");
const teacherNotesEmptyDescription = document.querySelector("#teacher-notes-empty-description");

const favoritesStorageKey = "freestudyspace:favorite-teachers";
let resources = [];
let teachers = [];
let favorites = new Set();
let selectedTeacherKey = "";
let favoritesMode = false;
let storageAvailable = true;

function teacherKey(name) {
    return name.trim().toLocaleLowerCase();
}

function isValidTeacherResource(resource) {
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
        && (resource.teacherName === undefined || typeof resource.teacherName === "string")
        && (resource.tags === undefined || (Array.isArray(resource.tags) && resource.tags.every((tag) => typeof tag === "string")))
        && typeof resource.pdf === "string"
        && /^pdfs\/[A-Za-z0-9._/-]+\.pdf$/i.test(resource.pdf)
        && !resource.pdf.split("/").some((segment) => segment === "." || segment === "..");
}

function loadFavorites() {
    try {
        const saved = JSON.parse(window.localStorage.getItem(favoritesStorageKey) || "[]");
        if (Array.isArray(saved)) {
            favorites = new Set(saved.filter((name) => typeof name === "string").map(teacherKey));
        }
    } catch {
        storageAvailable = false;
    }
}

function saveFavorites() {
    if (!storageAvailable) return;
    try {
        window.localStorage.setItem(favoritesStorageKey, JSON.stringify([...favorites]));
    } catch {
        storageAvailable = false;
        if (teacherMessage) {
            teacherMessage.dataset.state = "error";
            teacherMessage.textContent = "Favorites can't be saved in this browser, but you can still use them until you leave this page.";
        }
    }
}

function buildTeachers() {
    const groups = new Map();
    resources.forEach((resource) => {
        const name = typeof resource.teacherName === "string" ? resource.teacherName.trim() : "";
        if (!name) return;
        const key = teacherKey(name);
        if (!groups.has(key)) groups.set(key, { key, name, resources: [] });
        groups.get(key).resources.push(resource);
    });
    teachers = [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function populateTeacherSubjects() {
    if (!teacherSubject) return;
    const selection = teacherSubject.value;
    const subjects = [...new Set(teachers.flatMap((teacher) =>
        teacher.resources.map((resource) => resource.subject)))]
        .sort((a, b) => a.localeCompare(b));
    teacherSubject.replaceChildren(new Option("All subjects", ""));
    subjects.forEach((subject) => teacherSubject.add(new Option(subject, subject)));
    if (subjects.includes(selection)) teacherSubject.value = selection;
}

function makeTeacherCard(teacher) {
    const card = document.createElement("article");
    card.className = "teacher-card";

    const title = document.createElement("h2");
    title.textContent = teacher.name;

    const summary = document.createElement("p");
    const count = teacher.resources.length;
    summary.textContent = `${count} ${count === 1 ? "note" : "notes"} available`;

    const subjects = document.createElement("div");
    subjects.className = "teacher-subjects";
    [...new Set(teacher.resources.map((resource) => resource.subject))]
        .sort((a, b) => a.localeCompare(b))
        .forEach((subject) => {
            const tag = document.createElement("span");
            tag.textContent = subject;
            subjects.append(tag);
        });

    const actions = document.createElement("div");
    actions.className = "teacher-card-actions";

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "teacher-favorite";
    favoriteButton.type = "button";
    favoriteButton.setAttribute("aria-pressed", String(favorites.has(teacher.key)));
    favoriteButton.setAttribute("aria-label", `${favorites.has(teacher.key) ? "Remove" : "Save"} ${teacher.name} ${favorites.has(teacher.key) ? "from" : "to"} favorites`);
    favoriteButton.textContent = favorites.has(teacher.key) ? "♥ Saved" : "♡ Save";
    favoriteButton.addEventListener("click", () => {
        if (favorites.has(teacher.key)) {
            favorites.delete(teacher.key);
            if (favoritesMode && selectedTeacherKey === teacher.key) selectedTeacherKey = "";
        } else {
            favorites.add(teacher.key);
        }
        saveFavorites();
        renderTeachers();
        renderTeacherNotes();
    });

    const browseButton = document.createElement("button");
    browseButton.className = "teacher-browse";
    browseButton.type = "button";
    browseButton.textContent = "Browse notes";
    browseButton.setAttribute("aria-label", `Browse notes from ${teacher.name}`);
    browseButton.addEventListener("click", () => {
        selectedTeacherKey = teacher.key;
        renderTeacherNotes();
        teacherNotes.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    actions.append(favoriteButton, browseButton);
    card.append(title, summary, subjects, actions);
    return card;
}

function renderTeachers() {
    if (!teacherGrid) return;
    const query = teacherSearch ? teacherSearch.value.trim().toLocaleLowerCase() : "";
    const subject = teacherSubject ? teacherSubject.value : "";
    const matches = teachers.filter((teacher) =>
        (!query || teacher.name.toLocaleLowerCase().includes(query))
        && (!subject || teacher.resources.some((resource) => resource.subject === subject))
        && (!favoritesMode || favorites.has(teacher.key)));

    teacherGrid.replaceChildren(...matches.map(makeTeacherCard));
    teacherGrid.setAttribute("aria-busy", "false");
    if (teacherCount) {
        const noun = matches.length === 1 ? "teacher" : "teachers";
        teacherCount.textContent = `${matches.length} ${noun}${favoritesMode ? " in your favorites" : ""}`;
    }
    if (teacherEmpty) teacherEmpty.hidden = matches.length > 0;
    if (matches.length > 0 || !teacherEmptyTitle || !teacherEmptyDescription) return;

    if (teachers.length === 0) {
        teacherEmptyTitle.textContent = "Teacher notes are coming soon.";
        teacherEmptyDescription.textContent = resources.length
            ? "The notes catalogue has no teacher names yet. Add a teacherName to a resource in notes.json to list it here; existing notes remain available in Browse notes."
            : "No study resources are available yet. New notes will appear here after they are added to the catalogue.";
    } else if (favoritesMode && ![...favorites].some((key) => teachers.some((teacher) => teacher.key === key))) {
        teacherEmptyTitle.textContent = "No favorite teachers yet.";
        teacherEmptyDescription.textContent = "Save a teacher with the heart button and their notes will be collected in your favorites.";
    } else if (query || subject) {
        teacherEmptyTitle.textContent = "No teachers match this search.";
        teacherEmptyDescription.textContent = subject
            ? `No teacher has attributed notes for ${subject}${query ? ` matching “${teacherSearch.value.trim()}”` : ""}. Try another subject or search.`
            : "Try a different teacher name.";
    } else {
        teacherEmptyTitle.textContent = "No favorite teachers match.";
        teacherEmptyDescription.textContent = "Try another search or subject, or save more teachers to your favorites.";
    }
}

function makeNoteCard(resource) {
    const card = document.createElement("article");
    card.className = "note-card";
    const body = document.createElement("div");
    body.className = "note-card-body";

    const meta = document.createElement("div");
    meta.className = "note-meta";
    const subject = document.createElement("span");
    subject.className = "subject-tag";
    subject.textContent = resource.subject.toUpperCase();
    const board = document.createElement("span");
    board.textContent = `${resource.board} · CLASS ${resource.class}`;
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
    const openLink = document.createElement("a");
    openLink.className = "preview-button";
    openLink.href = resource.pdf;
    openLink.target = "_blank";
    openLink.rel = "noopener";
    openLink.textContent = "Open PDF";
    openLink.setAttribute("aria-label", `Open ${resource.title} PDF`);
    const downloadLink = document.createElement("a");
    downloadLink.className = "resource-download";
    downloadLink.href = resource.pdf;
    downloadLink.download = resource.pdf.split("/").pop();
    downloadLink.setAttribute("aria-label", `Download ${resource.title} PDF`);
    downloadLink.innerHTML = 'Download <span aria-hidden="true">↓</span>';
    actions.append(openLink, downloadLink);
    body.append(meta, title, description, tags, actions);
    card.append(body);
    return card;
}

function renderTeacherNotes() {
    if (!teacherNotes || !teacherNotesGrid) return;
    const selectedTeacher = teachers.find((teacher) => teacher.key === selectedTeacherKey);
    const favoriteTeachers = teachers.filter((teacher) => favorites.has(teacher.key));

    if (!favoritesMode && !selectedTeacher) {
        teacherNotes.hidden = true;
        return;
    }

    teacherNotes.hidden = false;
    let displayedTeachers;
    if (selectedTeacher) {
        displayedTeachers = [selectedTeacher];
        teacherNotesTitle.textContent = `Notes from ${selectedTeacher.name}.`;
        teacherNotesDescription.textContent = "Browse or download this teacher's study notes.";
    } else {
        displayedTeachers = favoriteTeachers;
        teacherNotesTitle.textContent = "Notes from your favorites.";
        teacherNotesDescription.textContent = "Browse or download notes shared by all your saved teachers.";
    }

    const noteResources = displayedTeachers.flatMap((teacher) => teacher.resources);
    teacherNotesGrid.replaceChildren(...noteResources.map(makeNoteCard));
    const hasNotes = noteResources.length > 0;
    teacherNotesGrid.hidden = !hasNotes;
    teacherNotesEmpty.hidden = hasNotes;
    if (!hasNotes) {
        teacherNotesEmptyTitle.textContent = selectedTeacher
            ? `No notes from ${selectedTeacher.name} yet.`
            : "No favorite notes to show.";
        teacherNotesEmptyDescription.textContent = selectedTeacher
            ? "This teacher has no notes in the catalogue yet."
            : "Save a teacher who has notes to browse their resources here.";
    }
}

async function loadTeacherResources() {
    try {
        const response = await fetch("notes.json", { cache: "no-cache" });
        if (!response.ok) throw new Error(`Catalogue request failed: HTTP ${response.status}`);
        const catalogue = await response.json();
        if (!catalogue || !Array.isArray(catalogue.resources)
            || catalogue.resources.some((resource) => !isValidTeacherResource(resource))) {
            throw new TypeError("The PDF catalogue contains invalid resources.");
        }
        resources = catalogue.resources;
        loadFavorites();
        buildTeachers();
        populateTeacherSubjects();
        if (teacherMessage) {
            teacherMessage.dataset.state = storageAvailable ? "ready" : "error";
            teacherMessage.textContent = storageAvailable
                ? ""
                : "Favorites can't be saved in this browser, but you can still use them until you leave this page.";
        }
        renderTeachers();
        renderTeacherNotes();
    } catch (error) {
        if (teacherGrid) teacherGrid.setAttribute("aria-busy", "false");
        if (teacherMessage) {
            teacherMessage.dataset.state = "error";
            teacherMessage.textContent = "Teacher notes couldn't be loaded. Check the catalogue and reload the page.";
        }
        if (teacherCount) teacherCount.textContent = "Catalogue unavailable";
        if (teacherEmpty) teacherEmpty.hidden = false;
        if (teacherEmptyTitle) teacherEmptyTitle.textContent = "We couldn't load the notes catalogue.";
        if (teacherEmptyDescription) teacherEmptyDescription.textContent = "Please try again later, or contact the site owner.";
        console.error("Unable to load teacher notes.", error);
    }
}

if (teacherSearch) teacherSearch.addEventListener("input", renderTeachers);
if (teacherSubject) teacherSubject.addEventListener("change", renderTeachers);
if (favoritesToggle) {
    favoritesToggle.addEventListener("click", () => {
        favoritesMode = !favoritesMode;
        selectedTeacherKey = "";
        favoritesToggle.setAttribute("aria-pressed", String(favoritesMode));
        favoritesToggle.textContent = favoritesMode ? "Show all teachers" : "Show favorites";
        renderTeachers();
        renderTeacherNotes();
    });
}

if (teacherGrid || teacherMessage) loadTeacherResources();
