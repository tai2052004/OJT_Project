const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=vocabulary&levels=";

const JLPT_TO_WK = {
    "N5": "1,2,3,4,5,6,7,8,9,10",
    "N4": "11,12,13,14,15,16,17,18,19,20",
    "N3": "21,22,23,24,25,26,27,28,29,30",
    "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    "N1": "51,52,53,54,55,56,57,58,59,60"
};

let vocabularyList = [];
let score = 0;
let totalQuestions = 10;
let currentQuestion = 0;
let userAnswers = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Lấy thông tin từ localStorage
    const level = localStorage.getItem('quizLevel');
    totalQuestions = parseInt(localStorage.getItem('numQuestions'), 10);

    if (!level) {
        alert('No quiz level selected. Redirecting to quiz page.');
        window.location.href = 'Quizz.html';
        return;
    }

    await fetchVocabulary(level);
    updateProgress();
});

async function fetchVocabulary(level) {
    let url = API_URL + JLPT_TO_WK[level];
    let headers = { "Authorization": "Bearer " + API_KEY };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();
        vocabularyList = data.data.map(item => ({
            word: item.data.characters,
            meaning: item.data.meanings.map(m => m.meaning)[0]
        }));

        showQuestion();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function showQuestion() {
    if (currentQuestion >= totalQuestions) {
        endQuiz();
        return;
    }

    let questionData = vocabularyList[Math.floor(Math.random() * vocabularyList.length)];
    let correctAnswer = questionData.meaning;

    let choices = new Set([correctAnswer]);
    while (choices.size < 4) {
        let randomChoice = vocabularyList[Math.floor(Math.random() * vocabularyList.length)].meaning;
        choices.add(randomChoice);
    }

    let shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);


    document.querySelector(".question-content h2").innerText = questionData.word;
    document.querySelector(".question-content p").innerText = "What does this word mean?";

    const optionsGrid = document.querySelector(".options-grid");
    optionsGrid.innerHTML = '';

    shuffledChoices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "option";
        button.textContent = choice;
        button.onclick = function() {
            checkAnswer(choice, correctAnswer);
        };
        optionsGrid.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selected, correct) {
    userAnswers.push({
        question: document.querySelector(".question-content h2").innerText,
        selected,
        correct,
        isCorrect: selected === correct
    });

    if (selected === correct) {
        score++;
    }

    currentQuestion++;
    showQuestion();
}

function updateProgress() {
    document.querySelector(".progress").textContent = `Progress: ${currentQuestion}/${totalQuestions} questions answered`;
    document.querySelector(".question-number ").innerText = `Question ${currentQuestion+1}: `;
}

function endQuiz() {
    // Lưu kết quả vào localStorage để trang kết quả sử dụng
    localStorage.setItem('quizResult', JSON.stringify({
        score,
        totalQuestions,
        userAnswers
    }));

    // Chuyển đến trang kết quả
    window.location.href = '/quizResult';
}