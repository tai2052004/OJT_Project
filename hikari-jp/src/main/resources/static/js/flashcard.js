// let currentIndex = 0;
// const flashcards = document.querySelectorAll(".flashcard");
// const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
// const API_URL = "https://api.wanikani.com/v2/subjects?types=";
// // const JLPT_TO_WK = {
// //     "N5": "1,2,3,4,5,6,7,8,9,10",
// //     "N4": "11,12,13,14,15,16,17,18,19,20",
// //     "N3": "21,22,23,24,25,26,27,28,29,30",
// //     "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
// //     "N1": "51,52,53,54,55,56,57,58,59,60"
// // };
// const JLPT_TO_WK = {
//     "N5-1": "1",
//     "N5-2": "2",
//     "N5-3": "3",
//     "N5-4": "4",
//     "N5-5": "5",
//     "N5-6": "6",
//     "N5-7": "7",
//     "N5-8": "8",
//     "N5-9": "9",
//     "N5-10": "10",
//     "N4": "11,12,13,14,15,16,17,18,19,20",
//     "N3": "21,22,23,24,25,26,27,28,29,30",
//     "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
//     "N1": "51,52,53,54,55,56,57,58,59,60"
// };
//
// let vocabData = [];
// let kanjiData = [];
// let currentType = "vocabulary";
// let selectedLevel = document.querySelector("input[name='level']:checked")?.value;
// let selectedType = document.querySelector("input[name='wordType']:checked")?.value;
//
// document.addEventListener("DOMContentLoaded", function () {
//     const fetchButton = document.getElementById("fetchButton");
//     if (fetchButton) {
//         fetchButton.style.display = "none";
//     }
//
//     const urlParams = new URLSearchParams(window.location.search);
//     const selectedLevel = urlParams.get("level");
//     const wordType = urlParams.get('wordType');
//
//     if (selectedLevel) {
//         let radio = document.querySelector(`input[name="level"][value="${selectedLevel}"]`);
//         if (radio) {
//             radio.checked = true;
//         }
//     }
//     if (wordType) {
//         const wordTypeRadio = document.querySelector(`input[name="wordType"][value="${wordType}"]`);
//         if (wordTypeRadio) wordTypeRadio.checked = true;
//     }
//
//
//     // Thêm event listeners cho radio buttons
//     document.querySelectorAll('input[name="level"]').forEach(radio => {
//         radio.addEventListener('change', fetchData);
//     });
//
//     document.querySelectorAll('input[name="wordType"]').forEach(radio => {
//         radio.addEventListener('change', function() {
//             selectedType = this.value;
//             fetchData();
//         });
//     });
//     document.querySelectorAll('input[name="level"]').forEach(radio => {
//         radio.addEventListener("change", function () {
//             toggleLessonList();
//             fetchData();
//     // fetchData();
// });
//
// // async function fetchData() {
// //     selectedLevel = document.querySelector("input[name='level']:checked")?.value;
// //     if (!selectedLevel || !JLPT_TO_WK[selectedLevel]) {
// //         alert("Vui lòng chọn cấp độ JLPT.");
// //         return;
// //     }
// //
// //     let url = API_URL + selectedType + "&levels=" + JLPT_TO_WK[selectedLevel];
// //     let headers = { "Authorization": "Bearer " + API_KEY };
// //
// //     try {
// //         let response = await fetch(url, { headers });
// //         let data = await response.json();
// //
// //         if (selectedType === "vocabulary") {
// //             vocabData = data.data;
// //             kanjiData = [];
// //         } else {
// //             kanjiData = data.data;
// //             vocabData = [];
// //         }
// //
// //         currentType = selectedType;
// //         currentIndex = 0; // Reset về flashcard đầu tiên
// //         showCurrentFlashcard();
// //     } catch (error) {
// //         console.error("Lỗi khi tải dữ liệu:", error);
// //     }
// // }
//         async function fetchData(level = null) {
//             let selectedLevel = document.querySelector('input[name="level"]:checked')?.value;
//             let finalLevel = level || selectedLevel; // Nếu chọn bài thì dùng bài đó, nếu không thì lấy cấp độ chung
//
//             if (!finalLevel || !JLPT_TO_WK[finalLevel]) {
//                 alert("Vui lòng chọn cấp độ hoặc bài học.");
//                 return;
//             }
//
//             let url = API_URL + selectedType + "&levels=" + JLPT_TO_WK[finalLevel];
//             let headers = { "Authorization": "Bearer " + API_KEY };
//
//             try {
//                 let response = await fetch(url, { headers });
//                 let data = await response.json();
//
//                 if (selectedType === "vocabulary") {
//                     vocabData = data.data;
//                     kanjiData = [];
//                 } else {
//                     kanjiData = data.data;
//                     vocabData = [];
//                 }
//
//                 currentType = selectedType;
//                 currentIndex = 0;
//                 showCurrentFlashcard();
//             } catch (error) {
//                 console.error("Lỗi khi tải dữ liệu:", error);
//             }
//         }
//
// function showCurrentFlashcard() {
//     const flashcardFront = document.querySelector(".flashcard-front");
//     const flashcardBack = document.querySelector(".flashcard-back");
//     const starIcon = document.querySelector(".flashcard i.bi-star-fill");
//
//     let currentData = currentType === "vocabulary" ? vocabData : kanjiData;
//
//     if (currentData.length === 0) {
//         flashcardFront.textContent = "Không có dữ liệu";
//         flashcardBack.textContent = "";
//         return;
//     }
//
//     if (currentIndex >= currentData.length) {
//         currentIndex = 0;
//     }
//
//     const item = currentData[currentIndex];
//
//     // Hiển thị mặt trước (từ/kanji)
//     if (currentType === "vocabulary") {
//         let kanji = item.data.characters;
//         let readings = item.data.readings.map(r => r.reading).join(", ");
//         flashcardFront.textContent = `${kanji} (${readings})`;
//     } else {
//         flashcardFront.textContent = item.data.characters;
//     }
//
//     // Hiển thị mặt sau (nghĩa)
//     if (currentType === "vocabulary") {
//         flashcardBack.textContent = item.data.meanings.map(m => m.meaning).join(", ");
//     } else {
//         flashcardBack.textContent = `Meaning: ${item.data.meanings.map(m => m.meaning).join(", ")}\nReading: ${item.data.readings.map(r => r.reading).join(", ")}`;
//     }
//
//     // Cập nhật trạng thái nút next/prev
//     document.getElementById("prevBtn").disabled = currentIndex === 0;
//     document.getElementById("nextBtn").disabled = currentIndex === currentData.length - 1;
//
//     // Reset trạng thái lật của flashcard
//     const flashcard = document.querySelector(".flashcard");
//     flashcard.classList.remove("flipped");
// }
//
// function flipCard(card) {
//     card.classList.toggle("flipped");
// }
//
// function plusDivs(n) {
//     let currentData = currentType === "vocabulary" ? vocabData : kanjiData;
//     currentIndex = (currentIndex + n + currentData.length) % currentData.length;
//     showCurrentFlashcard();
// }
// function toggleLessonList() {
//     let selectedLevel = document.querySelector('input[name="level"]:checked')?.value;
//     let lessonList = document.getElementById("lessonList");
//     let lessonItems = document.getElementById("lessonItems");
//
//     if (selectedLevel === "N5") {
//         lessonList.style.display = "block";
//         lessonItems.innerHTML = ""; // Xóa danh sách cũ nếu có
//
//         // Tạo danh sách bài học từ Lesson 1 đến 10
//         for (let i = 1; i <= 10; i++) {
//             let lesson = document.createElement("li");
//             lesson.innerHTML = `<button onclick="fetchData('N5-${i}')">Lesson ${i}</button>`;
//             lessonItems.appendChild(lesson);
//         }
//     } else {
//         lessonList.style.display = "none";
//     }
// }
let currentIndex = 0;
let vocabData = [];
let kanjiData = [];
let currentType = "vocabulary";
const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=";

const JLPT_TO_WK = {
// N5 chia theo từng bài (Lesson 1 - 10)
"N5-1": "1", "N5-2": "2", "N5-3": "3", "N5-4": "4", "N5-5": "5",
    "N5-6": "6", "N5-7": "7", "N5-8": "8", "N5-9": "9", "N5-10": "10",

    // N4 chia theo từng bài (Lesson 11 - 20)
    "N4-1": "11", "N4-2": "12", "N4-3": "13", "N4-4": "14", "N4-5": "15",
    "N4-6": "16", "N4-7": "17", "N4-8": "18", "N4-9": "19", "N4-10": "20",

    // N3 chia theo từng bài (Lesson 21 - 30)
    "N3-1": "21", "N3-2": "22", "N3-3": "23", "N3-4": "24", "N3-5": "25",
    "N3-6": "26", "N3-7": "27", "N3-8": "28", "N3-9": "29", "N3-10": "30",

    // N2 chia theo từng bài (Lesson 31 - 50)
    "N2-1": "31", "N2-2": "32", "N2-3": "33", "N2-4": "34", "N2-5": "35",
    "N2-6": "36", "N2-7": "37", "N2-8": "38", "N2-9": "39", "N2-10": "40",
    "N2-11": "41", "N2-12": "42", "N2-13": "43", "N2-14": "44", "N2-15": "45",
    "N2-16": "46", "N2-17": "47", "N2-18": "48", "N2-19": "49", "N2-20": "50",

    // N1 chia theo từng bài (Lesson 51 - 60)
    "N1-1": "51", "N1-2": "52", "N1-3": "53", "N1-4": "54", "N1-5": "55",
    "N1-6": "56", "N1-7": "57", "N1-8": "58", "N1-9": "59", "N1-10": "60"
};

document.addEventListener("DOMContentLoaded", function () {
    const fetchButton = document.getElementById("fetchButton");
    if (fetchButton) {
        fetchButton.style.display = "none";
    }
    // const selection_box = document.getElementById("selection-box");
    // if(selection_box) {
    //     selection_box.style.display="none";
    // }
    // const selection_box1 = document.getElementById("selection-box1");
    // if(selection_box1) {
    //     selection_box1.style.display="none";
    // }

    const urlParams = new URLSearchParams(window.location.search);
    const selectedLevel = urlParams.get("level");
    const wordType = urlParams.get('wordType');

    if (selectedLevel) {
        let radio = document.querySelector(`input[name="level"][value="${selectedLevel}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
    if (wordType) {
        const wordTypeRadio = document.querySelector(`input[name="wordType"][value="${wordType}"]`);
        if (wordTypeRadio) wordTypeRadio.checked = true;
    }
    document.querySelectorAll('input[name="level"]').forEach(radio => {
        radio.addEventListener("change", function () {
            toggleLessonList();
            fetchData();
        });
    });

    document.querySelectorAll('input[name="wordType"]').forEach(radio => {
        radio.addEventListener('change', function () {
            currentType = this.value;
            fetchData();
        });
    });
});

async function fetchData(level = null) {
    let selectedLevel = level || document.querySelector('input[name="level"]:checked')?.value;


    let url = API_URL + currentType + "&levels=" + JLPT_TO_WK[selectedLevel];
    let headers = { "Authorization": "Bearer " + API_KEY };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();

        if (currentType === "vocabulary") {
            vocabData = data.data;
            kanjiData = [];
        } else {
            kanjiData = data.data;
            vocabData = [];
        }

        currentIndex = 0;
        showCurrentFlashcard();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

function showCurrentFlashcard() {
    const flashcardFront = document.querySelector(".flashcard-front");
    const flashcardBack = document.querySelector(".flashcard-back");
    const starIcon = document.querySelector(".flashcard i.bi-star-fill");

    let currentData = currentType === "vocabulary" ? vocabData : kanjiData;

    if (currentData.length === 0) {
        flashcardFront.textContent = "Không có dữ liệu";
        flashcardBack.textContent = "";
        return;
    }

    if (currentIndex >= currentData.length) {
        currentIndex = 0;
    }

    const item = currentData[currentIndex];

    // Hiển thị mặt trước (từ/kanji)
    if (currentType === "vocabulary") {
        let kanji = item.data.characters;
        let readings = item.data.readings.map(r => r.reading).join(", ");
        flashcardFront.textContent = `${kanji} (${readings})`;
    } else {
        flashcardFront.textContent = item.data.characters;
    }

    // Hiển thị mặt sau (nghĩa)
    if (currentType === "vocabulary") {
        flashcardBack.textContent = item.data.meanings.map(m => m.meaning).join(", ");
    } else {
        flashcardBack.textContent = `Meaning: ${item.data.meanings.map(m => m.meaning).join(", ")}\nReading: ${item.data.readings.map(r => r.reading).join(", ")}`;
    }

    // Cập nhật trạng thái nút next/prev
    document.getElementById("prevBtn").disabled = currentIndex === 0;
    document.getElementById("nextBtn").disabled = currentIndex === currentData.length - 1;

    // Reset trạng thái lật của flashcard
    const flashcard = document.querySelector(".flashcard");
    flashcard.classList.remove("flipped");
}

function flipCard(card) {
    card.classList.toggle("flipped");
}

function plusDivs(n) {
    let currentData = currentType === "vocabulary" ? vocabData : kanjiData;
    currentIndex = (currentIndex + n + currentData.length) % currentData.length;
    showCurrentFlashcard();
}

// function toggleLessonList() {
//     let selectedLevel = document.querySelector('input[name="level"]:checked')?.value;
//     let lessonList = document.getElementById("lessonList");
//     let lessonItems = document.getElementById("lessonItems");
//
//     if (["N5", "N4", "N3", "N2", "N1"].includes(selectedLevel)) {
//         lessonList.style.display = "block";
//         lessonItems.innerHTML = ""; // Xóa danh sách cũ nếu có
//
//         let startLesson, endLesson;
//
//         switch (selectedLevel) {
//             case "N5":
//                 startLesson = 1; endLesson = 10;
//                 break;
//             case "N4":
//                 startLesson = 11; endLesson = 20;
//                 break;
//             case "N3":
//                 startLesson = 21; endLesson = 30;
//                 break;
//             case "N2":
//                 startLesson = 31; endLesson = 50;
//                 break;
//             case "N1":
//                 startLesson = 51; endLesson = 60;
//                 break;
//         }
//         const activeLesson = 1
//         // Tạo danh sách bài học
//         for (let i = startLesson; i <= endLesson; i++) {
//             let lesson = document.createElement("li");
//             let isActive = (i - startLesson + 1) === activeLesson; // activeLesson is the current lesson
//             lesson.innerHTML = `<button onclick="fetchData('${selectedLevel}-${i - startLesson + 1}')"
//                          class="${isActive ? 'active' : ''}">
//                          Lesson ${i - startLesson + 1}
//                          </button>`;
//             lessonItems.appendChild(lesson);
//         }
//     } else {
//         lessonList.style.display = "none";
//     }
// }
function toggleLessonList() {
    let selectedLevel = document.querySelector('input[name="level"]:checked')?.value;
    let lessonList = document.getElementById("lessonList");
    let lessonItems = document.getElementById("lessonItems");

    if (["N5", "N4", "N3", "N2", "N1"].includes(selectedLevel)) {
        lessonList.style.display = "block";
        lessonItems.innerHTML = ""; // Clear old list if any

        let startLesson, endLesson;

        switch (selectedLevel) {
            case "N5":
                startLesson = 1; endLesson = 10;
                break;
            case "N4":
                startLesson = 11; endLesson = 20;
                break;
            case "N3":
                startLesson = 21; endLesson = 30;
                break;
            case "N2":
                startLesson = 31; endLesson = 50;
                break;
            case "N1":
                startLesson = 51; endLesson = 60;
                break;
        }

        // Automatically fetch data for Lesson 1 of the selected level
        fetchData(`${selectedLevel}-1`);

        const activeLesson = 1; // Always set active lesson to 1

        // Create lesson list
        for (let i = startLesson; i <= endLesson; i++) {
            let lesson = document.createElement("li");
            let lessonNumber = i - startLesson + 1;
            let isActive = lessonNumber === activeLesson;
            lesson.innerHTML = `<button onclick="fetchData('${selectedLevel}-${lessonNumber}')" 
                         class="${isActive ? 'active' : ''}">
                         Lesson ${lessonNumber}
                         </button>`;
            lessonItems.appendChild(lesson);
        }
    } else {
        lessonList.style.display = "none";
    }
}