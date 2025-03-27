const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=vocabulary&levels=";
const JLPT_TO_WK = {
    "N5": "1,2,3,4,5,6,7,8,9,10",
    "N4": "11,12,13,14,15,16,17,18,19,20",
    "N3": "21,22,23,24,25,26,27,28,29,30",
    "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    "N1": "51,52,53,54,55,56,57,58,59,60"
};

const itemsPerPage = 5;
let currentPage = 1;
let vocabData = [];

document.addEventListener("DOMContentLoaded", function () {
    // Lấy tham số từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedLevel = urlParams.get("level");

    if (selectedLevel) {
        // Tìm radio button có value tương ứng và chọn nó
        let radio = document.querySelector(`input[name="level"][value="${selectedLevel}"]`);
        if (radio) {
            radio.checked = true;

            // Tự động click vào nút lấy từ vựng
            setTimeout(() => {
                document.getElementById("getVocabularyButton").click();
            }, 500); // Delay một chút để đảm bảo DOM đã load
        }
    }
});

async function fetchVocabulary() {
    let selectedLevel = document.querySelector("input[name='level']:checked")?.value;
    if (!selectedLevel || !JLPT_TO_WK[selectedLevel]) {
        alert("Vui lòng chọn cấp độ JLPT.");
        return;
    }

    let url = API_URL + JLPT_TO_WK[selectedLevel];
    let headers = { "Authorization": "Bearer " + API_KEY };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();
        vocabData = data.data;
        currentPage = 1;
        showPage(currentPage);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

function showPage(page) {
    let vocabList = document.getElementById("vocabularySection");
    vocabList.innerHTML = "";

    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedItems = vocabData.slice(start, end);

    paginatedItems.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("word-item");

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
        vocabList.appendChild(div);
    });

    updatePagination();
    updateVisibility();
}

function updatePagination() {
    let totalPages = Math.ceil(vocabData.length / itemsPerPage);
    let paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    // Previous button
    paginationContainer.innerHTML += `<button class="page-button" onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>&#8592;</button>`;

    let startPage, endPage;

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

    // Next button
    paginationContainer.innerHTML += `<button class="page-button" onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>&#8594;</button>`;
}


function gotoPage(page) {
    let totalPages = Math.ceil(vocabData.length / itemsPerPage);
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

    document.querySelectorAll(".reading").forEach(el => {
        el.style.display = showReading ? "inline" : "none";
    });

    document.querySelectorAll(".meaning").forEach(el => {
        el.style.display = showMeaning ? "inline" : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("toggleReading").addEventListener("change", updateVisibility);
    document.getElementById("toggleMeaning").addEventListener("change", updateVisibility);
});