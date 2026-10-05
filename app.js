const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const searchInput = document.querySelector("#note-search");
const searchForm = document.querySelector(".search-form");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const noteCards = [...document.querySelectorAll(".note-card")];
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const downloadStatus = document.querySelector("#download-status");
let activeFilter = "all";

const notes = {
    cells: {
        title: "Inside the Cell",
        subject: "Biology",
        subtitle: "A quick guide to cell structure and function",
        sections: [
            ["The big idea", "A cell is the smallest unit of life. Cells take in materials, release energy, respond to their surroundings, and make more cells."],
            ["Cell membrane", "The cell membrane surrounds the cell. It is selectively permeable, so it controls which substances enter and leave. Small molecules may cross by diffusion; water moves by osmosis."],
            ["Nucleus", "The nucleus stores most of a eukaryotic cell's DNA. Genes in DNA hold instructions used to make proteins and regulate cell activity."],
            ["Mitochondria", "Mitochondria are where most aerobic cellular respiration happens. This process transfers energy from glucose into ATP, a form the cell can use."],
            ["Ribosomes", "Ribosomes build proteins by joining amino acids in an order directed by genetic instructions. They can be free in the cytoplasm or attached to the rough endoplasmic reticulum."],
            ["Plant and animal cells", "Both plant and animal cells have a nucleus, membrane, cytoplasm, mitochondria, and ribosomes. Plant cells also have a cellulose cell wall, chloroplasts for photosynthesis, and often a large central vacuole."],
            ["Check your understanding", "1. What makes the cell membrane selectively permeable?\n2. Which organelle releases usable energy from glucose?\n3. Name two structures found in plant cells but not animal cells.\n\nAnswers: The membrane regulates movement in and out; mitochondria; the cell wall and chloroplasts."]
        ]
    },
    algebra: {
        title: "Algebra, Untangled",
        subject: "Mathematics",
        subtitle: "A quick guide to variables and equations",
        sections: [
            ["The big idea", "Algebra uses symbols such as x to stand for unknown or changing values. An equation says that two expressions have the same value."],
            ["Expressions and equations", "An expression combines numbers, variables, and operations. For example, 3x + 2 is an expression. An equation sets expressions equal: 3x + 2 = 14."],
            ["Keep the balance", "An equation behaves like a balanced scale. Whatever operation you use on one side, use on the other side too. This keeps the equality true."],
            ["Solve step by step", "Example: 3x + 2 = 14.\nSubtract 2 from each side: 3x = 12.\nDivide each side by 3: x = 4.\nCheck: 3(4) + 2 = 14, so the solution works."],
            ["Useful inverse operations", "Addition is undone by subtraction. Subtraction is undone by addition. Multiplication is undone by division. Division is undone by multiplication. Undo operations in reverse order to isolate a variable."],
            ["Check your understanding", "1. Solve x + 7 = 12.\n2. Solve 4y = 28.\n3. Solve 2a - 3 = 11.\n\nAnswers: x = 5; y = 7; add 3 to get 2a = 14, then divide by 2, so a = 7."]
        ]
    },
    motion: {
        title: "Motion and Forces",
        subject: "Physics",
        subtitle: "A quick guide to how objects move",
        sections: [
            ["The big idea", "Motion describes how an object's position changes over time. A force is a push or pull that can change an object's motion or shape."],
            ["Speed and velocity", "Average speed is distance divided by time. Its common units are metres per second (m/s). Velocity describes speed in a particular direction, so changing direction also changes velocity."],
            ["Acceleration", "Acceleration is the change in velocity divided by the time taken. It can mean speeding up, slowing down, or changing direction. Its common unit is metres per second squared (m/s^2)."],
            ["Newton's first law", "An object stays at rest, or keeps moving at constant velocity, unless a net external force acts on it. Inertia is an object's resistance to a change in motion."],
            ["Newton's second law", "The net force on an object is its mass multiplied by its acceleration: F = m x a. A greater net force produces more acceleration for the same mass."],
            ["Newton's third law", "When one object exerts a force on another, the second exerts an equal-sized force in the opposite direction on the first. The pair acts on two different objects."],
            ["Check your understanding", "1. A cyclist travels 120 m in 20 s. What is the average speed?\n2. What is the net force on a 3 kg object accelerating at 2 m/s^2?\n\nAnswers: 120 / 20 = 6 m/s; F = 3 x 2 = 6 N."]
        ]
    },
    atoms: {
        title: "Atoms and Elements",
        subject: "Chemistry",
        subtitle: "A quick guide to the building blocks of matter",
        sections: [
            ["The big idea", "All ordinary matter is made of atoms. An element is a pure substance whose atoms all have the same number of protons."],
            ["Inside an atom", "An atom has a tiny central nucleus containing protons and neutrons. Electrons occupy regions around the nucleus called shells or energy levels."],
            ["Subatomic particles", "Protons have a positive charge and a relative mass of about 1. Neutrons have no charge and a relative mass of about 1. Electrons have a negative charge and a much smaller relative mass."],
            ["Atomic number and mass number", "The atomic number equals the number of protons. The mass number equals protons plus neutrons. In an uncharged atom, the number of electrons equals the number of protons."],
            ["Isotopes and ions", "Isotopes are atoms of one element with different numbers of neutrons. An ion is a charged particle formed when an atom or group of atoms gains or loses electrons."],
            ["Reading the periodic table", "Elements are arranged by increasing atomic number. Elements in the same column often have similar chemical properties because their outer electrons are arranged similarly."],
            ["Check your understanding", "1. An atom has 11 protons and 12 neutrons. What are its atomic number and mass number?\n2. What changes when a neutral atom becomes a positive ion?\n\nAnswers: Atomic number 11 and mass number 23; it loses one or more electrons."]
        ]
    },
    essay: {
        title: "Build a Better Essay",
        subject: "Humanities",
        subtitle: "A quick guide to clear, well-supported writing",
        sections: [
            ["The big idea", "An effective essay answers a focused question with a clear claim, supports that claim with relevant evidence, and explains how the evidence fits."],
            ["Start with the question", "Underline the key instruction and topic words in your prompt. Decide what the question is asking you to explain, compare, evaluate, or argue."],
            ["Write a working thesis", "Your thesis is the main claim your essay will support. Make it specific enough to guide the essay and answer the prompt directly. You can refine it as your ideas develop."],
            ["Build a body paragraph", "A useful pattern is: make one point, support it with evidence, explain what the evidence shows, and link back to your main argument. Each paragraph should have a clear purpose."],
            ["Use evidence well", "Choose accurate, relevant examples or quotations. Introduce them in context, cite sources in the format your course requires, and explain their significance in your own words."],
            ["Revise in passes", "First check that your argument answers the prompt and flows logically. Then review paragraph focus and evidence. Finally proofread sentences, spelling, and citations."],
            ["Check your understanding", "1. Can a reader find your main claim in the introduction?\n2. Does each body paragraph explain its evidence?\n3. Have you followed your course's citation rules?\n\nQuick check: If a paragraph cannot be connected to your thesis, reconsider its purpose."]
        ]
    },
    revolution: {
        title: "The Industrial Revolution",
        subject: "Humanities",
        subtitle: "A quick guide to industrial change in Britain",
        sections: [
            ["The big idea", "The Industrial Revolution describes major changes in production, transport, work, and daily life. It began in Britain in the late eighteenth century and developed over the following decades."],
            ["Why Britain?", "Several factors helped industrialization: available coal and iron, investment and trade, growing markets, a stable banking system, and improvements to farming and transport. Historians debate the relative importance of these causes."],
            ["Machines and factories", "New machines increased the amount that could be produced, especially in textiles. Factory production brought workers and machinery together, changing the pace and organization of work."],
            ["Steam and transport", "Improvements to steam power supported factories, mines, and railways. Canals, better roads, and rail lines moved goods and people more quickly, connecting producers with larger markets."],
            ["People and cities", "Many people moved from rural areas to towns in search of work. Fast-growing cities faced crowded housing, pollution, and pressure on sanitation. Working hours and conditions could be difficult, while wages and living standards varied."],
            ["Change over time", "Industrialization brought both new opportunities and serious costs. Laws, labor organizing, and technology gradually changed working conditions, but those changes were uneven across places and groups."],
            ["Check your understanding", "1. Name two factors that helped Britain industrialize.\n2. How did railways affect trade?\n3. Give one benefit and one cost of industrialization.\n\nPossible answers: Access to coal and investment; railways moved goods faster to larger markets; more manufactured goods and jobs, but crowded cities or dangerous work."]
        ]
    }
};

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

function updateCatalog() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    noteCards.forEach((card) => {
        const matchesFilter = activeFilter === "all" || card.dataset.subject === activeFilter;
        const searchableContent = `${card.dataset.search || ""} ${card.textContent || ""}`.toLowerCase();
        const matchesSearch = !query || searchableContent.includes(query);
        const isVisible = matchesFilter && matchesSearch;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    if (resultCount) {
        resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "study guide" : "study guides"}`;
    }
    if (emptyState) emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("is-active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });
        updateCatalog();
    });
});

if (searchInput) searchInput.addEventListener("input", updateCatalog);
if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const notesSection = document.querySelector("#notes");
        if (notesSection) notesSection.scrollIntoView({ behavior: "smooth" });
        updateCatalog();
    });
}

function escapePdfText(text) {
    return text.replace(/[^\x20-\x7e]/g, "-").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapPdfLine(text, maxLength = 88) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const fragments = word.length > maxLength
            ? word.match(new RegExp(`.{1,${maxLength}}`, "g")) || [word]
            : [word];
        fragments.forEach((fragment) => {
            if (line && `${line} ${fragment}`.length > maxLength) {
                lines.push(line);
                line = fragment;
            } else {
                line = line ? `${line} ${fragment}` : fragment;
            }
        });
    });

    if (line) lines.push(line);
    return lines;
}

function makePdf(note) {
    const prepared = [];
    note.sections.forEach(([heading, content]) => {
        prepared.push(heading.toUpperCase(), ...content.split("\n").flatMap(wrapPdfLine), "");
    });

    const bodyPages = [];
    while (prepared.length) bodyPages.push(prepared.splice(0, 42));

    const objects = [];
    const pageReferences = [];
    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

    bodyPages.forEach((lines, pageIndex) => {
        const pageId = 4 + pageIndex * 2;
        const streamId = pageId + 1;
        pageReferences.push(`${pageId} 0 R`);

        const commands = [
            "BT",
            "/F1 20 Tf",
            "54 760 Td",
            `(${escapePdfText(note.title)}) Tj`,
            "/F1 9 Tf",
            "0 -23 Td",
            `(${escapePdfText(`${note.subject} | ${note.subtitle}`)}) Tj`,
            "0 -30 Td",
            "/F1 10 Tf"
        ];
        lines.forEach((line, index) => {
            if (index > 0) commands.push("0 -14 Td");
            commands.push(`(${escapePdfText(line)}) Tj`);
        });
        if (pageIndex === bodyPages.length - 1) {
            commands.push("0 -28 Td", "/F1 8 Tf", "(FreeStudySpace - Free study notes) Tj");
        }
        commands.push("ET");
        const stream = commands.join("\n");

        objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${streamId} 0 R >>`;
        objects[streamId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    });

    objects[2] = `<< /Type /Pages /Kids [${pageReferences.join(" ")}] /Count ${pageReferences.length} >>`;

    let documentText = "%PDF-1.4\n";
    const offsets = [0];
    for (let id = 1; id < objects.length; id += 1) {
        offsets[id] = documentText.length;
        documentText += `${id} 0 obj\n${objects[id]}\nendobj\n`;
    }
    const crossReferenceOffset = documentText.length;
    documentText += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
    for (let id = 1; id < objects.length; id += 1) {
        documentText += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    }
    documentText += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${crossReferenceOffset}\n%%EOF`;
    return new Blob([documentText], { type: "application/pdf" });
}

document.querySelectorAll(".download-button").forEach((button) => {
    button.addEventListener("click", () => {
        const note = notes[button.dataset.note];
        if (!note) {
            if (downloadStatus) downloadStatus.textContent = "Sorry, that study guide is not available.";
            return;
        }

        const originalLabel = "Read & download PDF";
        button.disabled = true;
        button.textContent = "Preparing your PDF...";

        try {
            const pdf = makePdf(note);
            const url = URL.createObjectURL(pdf);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `${button.dataset.note}-study-notes.pdf`;
            document.body.append(downloadLink);
            downloadLink.click();
            downloadLink.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            if (downloadStatus) downloadStatus.textContent = `${note.title} PDF downloaded.`;
        } catch (error) {
            if (downloadStatus) downloadStatus.textContent = "The PDF could not be created. Please try again.";
            console.error("Unable to create study guide PDF.", error);
        } finally {
            button.disabled = false;
            button.innerHTML = `${originalLabel} <span aria-hidden="true">↓</span>`;
        }
    });
});

const resetSearch = document.querySelector(".reset-search");
if (resetSearch) {
    resetSearch.addEventListener("click", () => {
        activeFilter = "all";
        if (searchInput) searchInput.value = "";
        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === "all";
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
        updateCatalog();
        if (searchInput) searchInput.focus();
    });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
updateCatalog();
