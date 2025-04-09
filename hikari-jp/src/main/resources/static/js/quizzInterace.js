const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=";
const JLPT_TO_WK = {
    "N5": "1,2,3,4,5,6,7,8,9,10",
    "N4": "11,12,13,14,15,16,17,18,19,20",
    "N3": "21,22,23,24,25,26,27,28,29,30",
    "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    "N1": "51,52,53,54,55,56,57,58,59,60"
};

const itemsPerPage = 5;
let currentPage = 1;
let filteredData = []; // Added: holds filtered data
let vocabData = [];
let kanjiData = [];
let currentType = "vocabulary"; // Track the current type
let toggleReading = document.getElementById("toggleReading");
let toggleMeaning = document.getElementById("toggleMeaning");
document.addEventListener("DOMContentLoaded", function () {
    // Lấy tham số từ URL
    const urlParams = new URLSearchParams(window.location.search);
    let selectedLevel = urlParams.get("level") || "N5"; // Mặc định là N5 nếu không có trong URL
    // Set default selections
    let selectedType = urlParams.get("wordType") || "vocabulary"; // Mặc định là vocabulary nếu không có trong URL
    // Check the corresponding radio buttons
    document.querySelector(`input[name='level'][value='${selectedLevel}']`).checked = true;
    document.querySelector(`input[name='wordType'][value='${selectedType}']`).checked = true;
    // ADDED: Attach the search event for the search input field
    document.querySelector(".search-bar.wordSearch").addEventListener("input", filterData);

    if (selectedLevel) {
        // Tìm radio button có value tương ứng và chọn nó
        let radio = document.querySelector(`input[name="level"][value="${selectedLevel}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
    // Auto-fetch data with default values
    fetchData();

    // Auto-fetch when clicking Kanji/Vocabulary radio buttons
    document.querySelectorAll("input[name='wordType']").forEach((radio) => {
        radio.addEventListener("change", fetchData);
    });

    // Auto-fetch when clicking JLPT level radio buttons
    document.querySelectorAll("input[name='level']").forEach((radio) => {
        radio.addEventListener("change", fetchData);
    });

    // Update visibility when toggling reading/meaning
    toggleReading.addEventListener("change", updateVisibility);
    toggleMeaning.addEventListener("change", updateVisibility);
    fetchData();
});
// Gán sự kiện `change` cho 2 checkbox
document.getElementById("toggleReading").addEventListener("change", updateVisibility);
document.getElementById("toggleMeaning").addEventListener("change", updateVisibility);

// Gọi lần đầu để cập nhật trạng thái ban đầu
updateVisibility();

async function fetchData() {
    let selectedLevel = document.querySelector("input[name='level']:checked")?.value;
    let selectedType = document.querySelector("input[name='wordType']:checked")?.value;

    if (!selectedLevel || !JLPT_TO_WK[selectedLevel]) {
        alert("Vui lòng chọn cấp độ JLPT.");
        return;
    }

    let url = API_URL + selectedType + "&levels=" + JLPT_TO_WK[selectedLevel];
    let headers = { "Authorization": "Bearer " + API_KEY };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();

        if (selectedType === "vocabulary") {
            vocabData = data.data;
            kanjiData = []; // Clear kanji data
        } else {
            kanjiData = data.data;
            vocabData = []; // Clear vocabulary data
        }

        currentType = selectedType;
        currentPage = 1;
        // ADDED: Reset search input and set filteredData to the full data set.
        document.querySelector(".search-bar.wordSearch").value = "";
        filteredData = (currentType === "vocabulary") ? vocabData : kanjiData;
        showPage(currentPage);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}
function showPage(page) {
    let listContainer = document.getElementById("vocabularySection");
    listContainer.innerHTML = "";
    // ADDED: Use filteredData if it exists; otherwise, use the full data set.
    let currentData = filteredData || ((currentType === "vocabulary") ? vocabData : kanjiData);
    // let currentData = currentType === "vocabulary" ? vocabData : kanjiData;
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedItems = currentData.slice(start, end);

    paginatedItems.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("word-item");

        if (currentType === "vocabulary") {
            let kanji = item.data.characters;

            let readings = item.data.readings.map(r => r.reading).join(", ");

            let readingSpan = document.createElement("span");
            readingSpan.classList.add("reading");
            readingSpan.textContent =  `${kanji} (${readings})`;



            let meaningSpan = document.createElement("span");
            meaningSpan.classList.add("meaning");
            meaningSpan.textContent = item.data.meanings.map(m => m.meaning).join(", ");

            div.appendChild(readingSpan);
            div.appendChild(meaningSpan);
        } else {
            let kanjiText = document.createElement("span");
            kanjiText.textContent = item.data.characters;
            kanjiText.classList.add("reading");

            let meaningReading = document.createElement("span");
            meaningReading.classList.add("meaning");
            meaningReading.textContent = item.data.meanings.map(m => m.meaning).join(", ");
            meaningReading.style.display = "none"; // Hidden initially



            div.appendChild(kanjiText);
            div.appendChild(meaningReading);
            // Attach click event to show overlay
           // console.log();

            div.addEventListener("click", function() {
                openKanjiOverlay(item.data);
            });
        }

        listContainer.appendChild(div);
    });

    updatePagination();
    updateVisibility();
}
toggleReading.addEventListener("change", updateVisibility);
toggleMeaning.addEventListener("change", updateVisibility);

function updatePagination() {
    let totalItems = filteredData ? filteredData.length : ((currentType === "vocabulary") ? vocabData.length : kanjiData.length);
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    let startPage, endPage;

    // Hide "Previous" if on first page
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

    // Hide "Next" if on last page
    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `<button class="page-button" onclick="changePage(1)">&#8594;</button>`;
    }
}


function gotoPage(page) {
    let totalItems = filteredData ? filteredData.length : ((currentType === "vocabulary") ? vocabData.length : kanjiData.length);
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    // let totalPages = Math.ceil((currentType === "vocabulary" ? vocabData.length : kanjiData.length) / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        showPage(currentPage);
    }
}

function changePage(step) {
    gotoPage(currentPage + step);
}

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




function gotoPage(page) {
    let totalItems = filteredData ? filteredData.length : ((currentType === "vocabulary") ? vocabData.length : kanjiData.length);
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        showPage(currentPage);
    }
}
function changePage(step) {
    gotoPage(currentPage + step);
}
/**
 * Filters the current data based on the search input.
 * This checks if the search term matches the beginning of:
 * - the characters for the word
 * - any of the readings
 * - any of the meanings
 */
function filterData() {
    const searchTerm = document.querySelector(".search-bar.wordSearch").value.trim();
    let currentData = (currentType === "vocabulary") ? vocabData : kanjiData;

    if (searchTerm !== "") {
        filteredData = currentData.filter(item => {
            let word = item.data.characters;
            let readings = item.data.readings.map(r => r.reading);
            let meanings = item.data.meanings.map(m => m.meaning);
            return word.startsWith(searchTerm) ||
                readings.some(r => r.startsWith(searchTerm)) ||
                meanings.some(m => m.startsWith(searchTerm));
        });
    } else {
        // If no search term, use the full list
        filteredData = currentData;
    }
    currentPage = 1;
    showPage(currentPage);
}



//auto load with default value

function changeMode(mode) {
    const selectedLevel = document.querySelector('input[name="level"]:checked').value;
    const selectedWordType = document.querySelector('input[name="wordType"]:checked').value;
    if(mode === 'flashcard') {
        window.location.href=`/flashcards?level=${selectedLevel}&wordType=${selectedWordType}`;
    }
}
// overlay writing
function openKanjiOverlay(kanjiData) {
    const overlay = document.getElementById("kanjiOverlay");
    const strokeElement = document.getElementById("strokeOrderImage");

    // Clear previous content from stroke area
    strokeElement.innerHTML = "";

    // Add stroke image using <kaki-jun>
    strokeElement.innerHTML += `<kaki-jun>${kanjiData.characters}</kaki-jun>`;

    // Remove old detail section if exists
    const oldDetails = document.getElementById("kanjiDetails");
    if (oldDetails) {
        oldDetails.remove();
    }

    // Create new details element
    const details = document.createElement("div");
    details.id = "kanjiDetails";
    details.classList.add("kanji-details");

    const onyomi = kanjiData.readings
        .filter(r => r.type === "onyomi")
        .map(r => r.reading)
        .join(", ") || "None";

    const kunyomi = kanjiData.readings
        .filter(r => r.type === "kunyomi")
        .map(r => r.reading)
        .join(", ") || "None";

    const meanings = kanjiData.meanings.map(m => m.meaning).join(", ");

    details.innerHTML = `
    <p><strong>Onyomi:</strong> 
        <span style="color: red;">${onyomi}</span>
    </p>
    <p><strong>Kunyomi:</strong> 
        <span style="color: blue;">${kunyomi}</span>
    </p>
    <p><strong>Meanings:</strong> ${meanings}</p>
`;


    // Append to main overlay content
    const overlayContent = document.querySelector(".kanji-overlay-content");
    overlayContent.appendChild(details);

    overlay.classList.remove("hidden");
}

function closeKanjiOverlay() {
    document.getElementById("kanjiOverlay").classList.add("hidden");
    const strokeElement = document.getElementById("strokeOrderImage");
    strokeElement.innerHTML = "";
}


