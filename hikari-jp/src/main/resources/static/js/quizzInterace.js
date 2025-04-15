const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=";
const JLPT_TO_WK = {
    "N5": "1,2,3,4,5,6,7,8,9,10",
    "N4": "11,12,13,14,15,16,17,18,19,20",
    "N3": "21,22,23,24,25,26,27,28,29,30",
    "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    "N1": "51,52,53,54,55,56,57,58,59,60"
};

const JLPT_TO_WK_LIMITED = {
    "N5": "1,2,3,4",
    "N4": "11,12,13",
    "N3": "21,22,23",
    "N2": "",
    "N1": ""
};

const itemsPerPage = 5;
let currentPage = 1;
let filteredData = [];
let vocabData = [];
let kanjiData = [];
let currentType = "vocabulary";
let toggleReading = document.getElementById("toggleReading");
let toggleMeaning = document.getElementById("toggleMeaning");
let initialSearchTerm = null;

// --- INIT ---

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let selectedLevel = urlParams.get("level") || "N5";
    let selectedType = urlParams.get("wordType") || "vocabulary";

    // Check and set level/type radio buttons
    document.querySelector(`input[name='level'][value='${selectedLevel}']`).checked = true;
    document.querySelector(`input[name='wordType'][value='${selectedType}']`).checked = true;

    // Search bar input that will use filter
    document.querySelector(".search-bar.wordSearch").addEventListener("input", filterData);

    // Set search term from URL (if any) con%20c%C3%A1 = con cá // use for get carryover attribute from chat bot
    initialSearchTerm = urlParams.get("search") ? decodeURIComponent(urlParams.get("search")) : null;

    // Attach change events
    document.querySelectorAll("input[name='wordType']").forEach(radio => {
        radio.addEventListener("change", () => {
            initialSearchTerm = null;
            fetchData();
        });
    });

    document.querySelectorAll("input[name='level']").forEach(radio => {
        radio.addEventListener("change", () => {
            initialSearchTerm = null;
            fetchData();
        });
    });

    if (!isPremiumUser) {
        document.querySelectorAll("input[name='level']").forEach(radio => {
            if (radio.value === "N2" || radio.value === "N1") {
                radio.disabled = true;
                radio.title = "Chỉ khả dụng cho người dùng Premium";
                radio.parentElement.addEventListener("click", function (e) {
                    e.preventDefault(); // Prevent selecting the disabled radio
                    alert("Tính năng này chỉ khả dụng cho người dùng Premium.");
                });
            }
        });
    }
    // Trigger fetch
    fetchData();

    // Initial visibility
    updateVisibility();
});

// --- FETCH DATA ---

async function fetchData() {
    let selectedLevel = document.querySelector("input[name='level']:checked")?.value;
    let selectedType = document.querySelector("input[name='wordType']:checked")?.value;

    if (!selectedLevel || !JLPT_TO_WK[selectedLevel]) {
        alert("Vui lòng chọn cấp độ JLPT.");
        return;
    }
    const levelMapping = isPremiumUser ? JLPT_TO_WK : JLPT_TO_WK_LIMITED;
        const url = API_URL + selectedType + "&levels=" + levelMapping[selectedLevel];
    const headers = { "Authorization": "Bearer " + API_KEY };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (selectedType === "vocabulary") {
            vocabData = data.data;
            kanjiData = [];
        } else {
            kanjiData = data.data;
            vocabData = [];
        }

        currentType = selectedType;
        currentPage = 1;

        const searchInput = document.querySelector(".search-bar.wordSearch");

        //  Only set value if initialSearchTerm is provided from URL (first load)
        if (initialSearchTerm !== null) {
            searchInput.value = initialSearchTerm;
            initialSearchTerm = null; // clear it after first use
        }

        //  Otherwise, keep whatever user typed manually — don’t overwrite!


        filteredData = currentType === "vocabulary" ? vocabData : kanjiData;
        showPage(currentPage);
        filterData(); // 🪄 Reapply current search after data changes
        if (initialSearchTerm) {
            filterData();
            initialSearchTerm = null;
        }

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// --- RENDERING ---

function showPage(page) {
    let listContainer = document.getElementById("vocabularySection");
    //Clear data first to prevent showing items from previous pages.
    listContainer.innerHTML = "";
    //use filter if exist else use other
    let currentData = filteredData || (currentType === "vocabulary" ? vocabData : kanjiData);
    //Calculates which items to display based on page and itemsPerPage.
   // Example: If page = 2 and itemsPerPage = 10, start = 10, end = 20 → get items 11–20.
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedItems = currentData.slice(start, end);

    //Loop through each item for the current page.
    paginatedItems.forEach(item => {

        //Create a new <div> for each item and assign it the class word-item.
        let div = document.createElement("div");
        div.classList.add("word-item");

        if (currentType === "vocabulary") {
            let kanji = item.data.characters;
            let readings = item.data.readings.map(r => r.reading).join(", ");
            //Extract the word (kanji/kana) and display kanji, hira as a string
            let readingSpan = document.createElement("span");
            readingSpan.classList.add("reading");
            readingSpan.textContent = `${kanji} (${readings})`;

            //Create a span to display the meaning
            let meaningSpan = document.createElement("span");
            meaningSpan.classList.add("meaning");
            meaningSpan.textContent = item.data.meanings.map(m => m.meaning).join(", ");

            //Create a span to show the English meanings, joined by commas.
            div.appendChild(readingSpan);
            div.appendChild(meaningSpan);
        } else {
            let kanjiText = document.createElement("span");
            kanjiText.textContent = item.data.characters;
            kanjiText.classList.add("reading");

            let meaningReading = document.createElement("span");
            meaningReading.classList.add("meaning");
            meaningReading.textContent = item.data.meanings.map(m => m.meaning).join(", ");
            meaningReading.style.display = "none";

            div.appendChild(kanjiText);
            div.appendChild(meaningReading);

            div.addEventListener("click", () => openKanjiOverlay(item.data));
        }

        listContainer.appendChild(div);
    });

    updatePagination();
    updateVisibility();
}
toggleReading.addEventListener("change",updateVisibility);
toggleMeaning.addEventListener("change",updateVisibility);

function updatePagination() {
    let totalItems;
    if (filteredData){
        totalItems = filteredData.length;
    }
    else if (currentPage === "vocabulary"){
        totalItems = vocabData.length;
    }                                         // const totalItems = filteredData ? filteredData.length : (currentType === "vocabulary" ? vocabData.length : kanjiData.length);
    else if(currentPage ==="kanji"){
        totalItems = kanjiData.length;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.querySelector(".pagination");
    //clear previous data
    paginationContainer.innerHTML = "";

    let startPage, endPage;

    if (currentPage > 1) {
        paginationContainer.innerHTML += `<button class="page-button" onclick="changePage(-1)">&#8592;</button>`;
    }

    if (totalPages <= 7) {
        startPage = 1;
        endPage = totalPages;
    } else if (currentPage <= 4) {
        startPage = 1;
        endPage = 6;
    } else if (currentPage >= totalPages - 3) {
        startPage = totalPages - 5;
        endPage = totalPages;
    } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
    }

    if (startPage > 1) {
        paginationContainer.innerHTML += `<button class="page-button" onclick="gotoPage(1)">1</button>`;
        if (startPage > 2) {
            paginationContainer.innerHTML += `<button class="page-button ellipsis" onclick="gotoPage(${Math.max(1, currentPage - 7)})">...</button>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.innerHTML += `<button class="page-button ${i === currentPage ? "active" : ""}" onclick="gotoPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationContainer.innerHTML += `<button class="page-button ellipsis" onclick="gotoPage(${Math.min(totalPages, currentPage + 7)})">...</button>`;
        }
        paginationContainer.innerHTML += `<button class="page-button" onclick="gotoPage(${totalPages})">${totalPages}</button>`;
    }

    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `<button class="page-button" onclick="changePage(1)">&#8594;</button>`;
    }
}

function gotoPage(page) {
    // Step 1: Determine the total number of items to paginate
    // If there's filtered data (e.g., from search), use its length
    // Otherwise, use the full dataset based on current word type (vocabulary or kanji)
    const totalItems = filteredData
        ? filteredData.length
        : (currentType === "vocabulary" ? vocabData.length : kanjiData.length);

    // Step 2: Calculate how many pages in total are needed
    // Use Math.ceil to round up (e.g., 12 items / 5 per page = 3 pages)
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Step 3: Validate the requested page number
    // Only proceed if the requested page is within valid range
    if (page >= 1 && page <= totalPages) {
        // Update the global current page tracker
        currentPage = page;

        // Display the corresponding items for this page
        showPage(currentPage);
    }
}


function changePage(step) {
    gotoPage(currentPage + step);
}

// --- TOGGLE VISIBILITY ---

function updateVisibility() {
    let showReading = document.getElementById("toggleReading").checked;
    let showMeaning = document.getElementById("toggleMeaning").checked;


    if (showReading && showMeaning) {
        toggleReading.disabled = false;
        toggleMeaning.disabled = false;
    }
    // Nếu chỉ có Reading được chọn, disable Meaning
    else if (showReading || !showMeaning)
    {
        toggleReading.disabled = true;
        toggleMeaning.disabled = false;
    }
    else if (showMeaning || !showReading)
    {
        toggleReading.disabled = false;
        toggleMeaning.disabled = true;
    }
    // Nếu cả hai đều bỏ chọn, có thể chọn lại
    else {
        toggleReading.disabled = false;
        toggleMeaning.disabled = false;
    }


    document.querySelectorAll(".reading").forEach(el => {
        el.style.display = showReading ? "inline" : "none";
    });

    document.querySelectorAll(".meaning").forEach(el => {
        el.style.display = showMeaning ? "inline" : "none";
    });
}

// --- FILTERING ---
async function filterData() {
    const searchTerm = document.querySelector(".search-bar.wordSearch").value.trim().toLowerCase();
    //to check what level the word from
    const selectedLevel = document.querySelector("input[name='level']:checked").value;
    const selectedType = currentType;

    // Helper function to filter a dataset
    function filterItems(data) {
        return data.filter(item => {
            const word = item.data.characters?.toLowerCase() || "";
            const readings = item.data.readings.map(r => r.reading.toLowerCase());
            const meanings = item.data.meanings.map(m => m.meaning.toLowerCase());
            //return the matched word if kanji is in searchTerm or hiragana reading is start With searchTerm
            // or meaning in english start with search term
            return word.includes(searchTerm) ||
                readings.some(r => r.startsWith(searchTerm)) ||
                meanings.some(m => m.startsWith(searchTerm));
        });
    }

    // If the search bar is empty, show only the selected level's data
    if (!searchTerm) {
        filteredData = selectedType === "vocabulary" ? vocabData : kanjiData;
        currentPage = 1;
        showPage(currentPage);
        return;
    }

    // Start with filtering the current dataset
    let localData = selectedType === "vocabulary" ? vocabData : kanjiData;
    let results = filterItems(localData);

    // If result found locally or search is already ongoing, use it
    if (results.length > 0) {
        filteredData = results;
        currentPage = 1;
        showPage(currentPage);
        return;
    }

    // No result in current level — search all levels
    let allLevels = Object.keys(JLPT_TO_WK).filter(level => level !== selectedLevel);
    let globalResults = [];

    for (let level of allLevels) {
        const url = `${API_URL}${selectedType}&levels=${JLPT_TO_WK[level]}`;
        const headers = { "Authorization": "Bearer " + API_KEY };

        try {
            const response = await fetch(url, { headers });
            const data = await response.json();
            const matches = filterItems(data.data);
            if (matches.length > 0) {
                globalResults = globalResults.concat(matches);

                // Update the radio button to match the found level
                document.querySelector(`input[name='level'][value='${level}']`).checked = true;

                // Update main dataset for consistency (used for toggle & pagination)
                if (selectedType === "vocabulary") {
                    vocabData = data.data;
                    kanjiData = [];
                } else {
                    kanjiData = data.data;
                    vocabData = [];
                }

                currentType = selectedType;

                // Stop searching other levels once a match is found (optional for performance)
                break;
            }
        } catch (err) {
            console.error("Failed to fetch level " + level, err);
        }
    }

    filteredData = globalResults.length > 0 ? globalResults : [];
    currentPage = 1;
    showPage(currentPage);

}


// --- OVERLAY ---

function openKanjiOverlay(kanjiData) {
    const overlay = document.getElementById("kanjiOverlay");
    const strokeElement = document.getElementById("strokeOrderImage");
    strokeElement.innerHTML = `<kaki-jun>${kanjiData.characters}</kaki-jun>`;

    const oldDetails = document.getElementById("kanjiDetails");
    if (oldDetails) oldDetails.remove();

    const details = document.createElement("div");
    details.id = "kanjiDetails";
    details.classList.add("kanji-details");

    const onyomi = kanjiData.readings.filter(r => r.type === "onyomi").map(r => r.reading).join(", ") || "None";
    const kunyomi = kanjiData.readings.filter(r => r.type === "kunyomi").map(r => r.reading).join(", ") || "None";
    const meanings = kanjiData.meanings.map(m => m.meaning).join(", ");

    details.innerHTML = `
        <p><strong>Onyomi:</strong> <span style="color: red;">${onyomi}</span></p>
        <p><strong>Kunyomi:</strong> <span style="color: blue;">${kunyomi}</span></p>
        <p><strong>Meanings:</strong> ${meanings}</p>
    `;

    document.querySelector(".kanji-overlay-content").appendChild(details);
    overlay.classList.remove("hidden");
}

function closeKanjiOverlay() {
    document.getElementById("kanjiOverlay").classList.add("hidden");
    document.getElementById("strokeOrderImage").innerHTML = "";
}

// --- MODE SWITCHING ---

function changeMode(mode) {
    const selectedLevel = document.querySelector('input[name="level"]:checked').value;
    const selectedWordType = document.querySelector('input[name="wordType"]:checked').value;

    if (mode === 'flashcard') {
        window.location.href = `/flashcards?level=${selectedLevel}&wordType=${selectedWordType}`;
    }
}
