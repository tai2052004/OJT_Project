document.addEventListener("DOMContentLoaded", function () {
    const itemsPerPage = 4; // Number of words per page
    let currentPage = 1;
    const paginationContainer = document.querySelector(".pagination");

    function getActiveWords() {
        const activeSection = document.querySelector(".word-list.active");
        return activeSection ? activeSection.querySelectorAll(".word-item") : [];
    }

    function showPage(page) {
        let words = getActiveWords();
        let totalPages = Math.ceil(words.length / itemsPerPage);

        // Hide all words first
        words.forEach(item => (item.style.display = "none"));

        // Determine the start and end index for the page
        let start = (page - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let visibleWords = Array.from(words).slice(start, end);

        // Display only the words in the current page range
        visibleWords.forEach(word => (word.style.display = "flex"));

        // Remove old empty items before adding new ones
        document.querySelectorAll(".empty-item").forEach(el => el.remove());

        // Fill remaining rows if necessary (to maintain layout height)
        let missingRows = itemsPerPage - visibleWords.length;
        const wordListContainer = document.querySelector(".word-list.active");
        for (let i = 0; i < missingRows; i++) {
            let emptyDiv = document.createElement("div");
            emptyDiv.classList.add("word-item", "empty-item");
            emptyDiv.style.visibility = "hidden";
            wordListContainer.appendChild(emptyDiv);
        }

        updatePagination(totalPages);
    }

    function updatePagination(totalPages) {
        paginationContainer.innerHTML = `<button class="page-button" onclick="changePage(-1)">&#8592;</button>`;

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += `<button class="page-button ${i === currentPage ? "active" : ""}" onclick="gotoPage(${i})">${i}</button>`;
        }

        paginationContainer.innerHTML += `<button class="page-button" onclick="changePage(1)">&#8594;</button>`;
    }

    window.gotoPage = function (page) {
        let words = getActiveWords();
        let totalPages = Math.ceil(words.length / itemsPerPage);

        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            showPage(currentPage);
        }
    };

    window.changePage = function (step) {
        gotoPage(currentPage + step);
    };

    // Handle Section Toggle
    document.querySelectorAll('input[name="wordType"]').forEach(radio => {
        radio.addEventListener("change", function () {
            const vocabularySection = document.getElementById("vocabularySection");
            const grammarSection = document.getElementById("grammarSection");
            const kanjiSection   = document.getElementById("kanjiSection")
            const readingToggleContainer = document.getElementById("readingToggleContainer");
            const vocabularyToggleContainer = document.getElementById("vocabularyToggleContainer")

            if (this.value === "vocabulary") {

                vocabularySection.classList.add("active");
                grammarSection.classList.remove("active");
                kanjiSection.classList.remove("active");
                vocabularyToggleContainer.style.display = "none";
                readingToggleContainer.style.display = "inline"; // Hide "Phiên Âm" checkbox
            } else if(this.value === "grammar")
                 {
                grammarSection.classList.add("active");
                vocabularySection.classList.remove("active");
                vocabularyToggleContainer.style.display = "inline";

                readingToggleContainer.style.display = "none"; // Hide "Phiên Âm" checkbox
            }
            else{
                kanjiSection.classList.add("active");
                grammarSection.classList.remove("active");
                vocabularySection.classList.remove("active");
                vocabularyToggleContainer.style.display = "inline";

                readingToggleContainer.style.display = "inline"; // Show "Phiên Âm" checkbox


            }

            // Reset pagination when switching sections
            currentPage = 1;
            showPage(currentPage);
        });
    });

    // Initial Pagination Setup
    showPage(currentPage);
});



// click button toggle từ vựng

document.addEventListener("DOMContentLoaded", function () {
    const kanjiCheckbox = document.getElementById("toggleKanji");
    const readingCheckbox = document.getElementById("toggleReading");
    const meaningCheckbox = document.getElementById("toggleMeaning");
    const readingToggleContainer = document.getElementById("readingToggleContainer");

    const vocabularySection = document.getElementById("vocabularySection");
    const grammarSection = document.getElementById("grammarSection");
    const kanjiSection   = document.getElementById("kanjiSection")


    function updateVisibility() {
        document.querySelectorAll(".kanji").forEach(el => el.style.display = kanjiCheckbox.checked ? "inline" : "none");
        document.querySelectorAll(".reading").forEach(el => el.style.display = readingCheckbox.checked ? "inline" : "none");
        document.querySelectorAll(".meaning").forEach(el => el.style.display = meaningCheckbox.checked ? "inline" : "none");
    }

    kanjiCheckbox.addEventListener("change", updateVisibility);
    readingCheckbox.addEventListener("change", updateVisibility);
    meaningCheckbox.addEventListener("change", updateVisibility);

    // Word Type Toggle
    document.querySelectorAll('input[name="wordType"]').forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.value === "vocabulary") {
                vocabularySection.classList.add("active");
                grammarSection.classList.remove("active");
                kanjiSection.classList.remove("active");
                readingToggleContainer.style.display = "hide"; // hide Reading checkbox
            } else if (this.value ==="grammar") {
                grammarSection.classList.add("active");
                vocabularySection.classList.remove("active");
                kanjiSection.classList.remove("active");
                readingToggleContainer.style.display = "none"; // Hide Reading checkbox
            }
            else{
                kanjiSection.classList.add("active");
                grammarSection.classList.remove("active");
                vocabularySection.classList.remove("active");
                readingToggleContainer.style.display = "inline"; // Show "Phiên Âm" checkbox


            }
            updateVisibility();
        });
    });

    // Initialize Visibility
    updateVisibility();
});

//pop up window
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("kanjiModal");
    const modalKanji = document.getElementById("modalKanji");
    const modalKunyomi = document.getElementById("modalKunyomi");
    const modalOnyomi = document.getElementById("modalOnyomi");
    const modalStroke = document.getElementById("modalStroke");
    const modalJLPT = document.getElementById("modalJLPT");
    const modalMeaning = document.getElementById("modalMeaning");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close");
    const modalAbx = document.getElementById("modalAbx")

    // Select only word items inside the kanjiSection
    document.querySelectorAll("#kanjiSection .word-item").forEach(item => {
        item.addEventListener("click", function () {
            modal.style.display = "flex";
            modalKanji.textContent = this.dataset.kanji;
            modalKunyomi.textContent = this.dataset.kunyomi;
            modalOnyomi.textContent = this.dataset.onyomi;
            modalStroke.textContent = this.dataset.stroke;
            modalJLPT.textContent = this.dataset.jlpt; 
            modalMeaning.textContent = this.dataset.meaning;
            modalImage.src = this.dataset.image;
            modalAbx.textContent = this.dataset.abx;
            
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});


