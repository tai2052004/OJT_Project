let totalTime = 60 * 60; // 60 phút = 3600 giây
let timeLeft = totalTime;
let timerInterval = null;
let countdownElement = document.getElementById("time");
let startButton = document.querySelector('.start-button');
let secondBody = document.querySelector('.second-body');
let levelContent = document.querySelectorAll('.level-content');
let subjectContent = document.querySelectorAll('.subject-content');
let topicNum = document.querySelectorAll('.topic-num');
let answers = document.querySelectorAll('.answer');
let num = document.querySelectorAll('.num');
let levelContentInput = document.getElementById("level_test");
let subjectTestInput = document.getElementById("subject_test");
let topicTestInput = document.getElementById("topic_test");

document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () =>
    {
        if (testNavigate())
        {
            secondBody.style.display = "block";
            document.querySelectorAll('.num-active').forEach(el => el.classList.remove('num-active'));
            if (subjectTestInput.value.includes("たんご"))
            {
                fetchVocabulary();
            }
            // Clear interval cũ nếu có
            if (timerInterval) clearInterval(timerInterval);
            // Gán interval mới vào biến
            timerInterval = setInterval(updateCountdown, 1000);
        }
    });
    levelContent.forEach(lv => lv.addEventListener('click',() =>
    {
        levelContent.forEach(l => l.classList.remove('num-active'));
        lv.classList.add('num-active');
        levelContentInput.value = lv.textContent;
    }));
    subjectContent.forEach(sc => sc.addEventListener('click',() =>
    {
        subjectContent.forEach(s => s.classList.remove('num-active'));
        sc.classList.add('num-active');
        subjectTestInput.value = sc.textContent;
    }));
    topicNum.forEach(tn => tn.addEventListener('click',() =>
    {
        topicNum.forEach(t => t.classList.remove('num-active'));
        tn.classList.add('num-active');
        topicTestInput.value = tn.textContent;
    }));

    answers.forEach(answer => {
        answer.addEventListener('click', function () {
            let question = this.closest('.question-content');
            question.querySelectorAll('.answer').forEach(ans => ans.classList.remove('choose-answer'));
            num.forEach(n =>
            {
                if ( n.id.includes(question.classList[1]))
                {
                    n.classList.add('complete');
                }
            })
            this.classList.add('choose-answer');
        });
    });
    let observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    document.body.classList.add("scrolled-past-question-num");
                } else {
                    document.body.classList.remove("scrolled-past-question-num");
                }
            });
        },
        { threshold: 0.1 }
    );

    let target = document.querySelector(".question-num");
    if (target) observer.observe(target);

    // 🛠️ Hiệu ứng cũ vẫn giữ nguyên
    let elements = document.querySelectorAll(".animate-on-scroll");
    let observer2 = new IntersectionObserver(
        function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach(element => observer2.observe(element));
});

function updateCountdown() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;


    if (timeLeft > 0) {
        timeLeft--;
    } else {
        countdownElement.textContent = "Hết giờ!";
    }
}

const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=kanji&levels=";

let kanjiList = [];
let vocabularyList = [];
let questions = [];
let userAnswers = {};
const totalQuestions = 20;


const JLPT_TO_WK = {
    "N5": "1,2,3,4,5,6,7,8,9,10",
    "N4": "11,12,13,14,15,16,17,18,19,20",
    "N3": "21,22,23,24,25,26,27,28,29,30",
    "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    "N1": "51,52,53,54,55,56,57,58,59,60"
};

function testNavigate() {
    let jlptLevel = levelContentInput.value;
    let jlptSubject = subjectTestInput.value;
    let jlptTopic = topicTestInput.value;
    let levels = JLPT_TO_WK[jlptLevel];

    if (!levels) {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: 'warning',
            title: 'Please choose test level.',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    }

    if (!jlptSubject) {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: 'warning',
            title: 'Please choose what you want to test.',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    }

    if (!jlptTopic) {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: 'warning',
            title: 'Please choose test topic.',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    }

    return true;
}


// Lấy dữ liệu từ API
async function fetchVocabulary() {

    kanjiList = [];
    vocabularyList = [];

    await fetchData("kanji");
    await fetchData("vocabulary");

    generateQuestions();
}

async function fetchData(type) {
    let url = API_URL + type + "&levels=" + JLPT_TO_WK[levelContentInput.value];
    let headers = { "Authorization": "Bearer " + API_KEY };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();

        if (type === "kanji") {
            kanjiList = data.data.map(item => ({
                word: item.data.characters,
                meaning: item.data.meanings.map(m => m.meaning)[0]
            }));
        } else if (type === "vocabulary") {
            vocabularyList = data.data.map(item => ({
                word: item.data.readings.find(r => r.primary).reading, // Lấy Hiragana
                meaning: item.data.meanings.map(m => m.meaning)[0]
            }));
        }
    } catch (error) {
        console.error(`Lỗi khi tải dữ liệu ${type}:`, error);
    }
}

function generateQuestions() {
    questions = [];
    userAnswers = {};

    let selectedKanji = kanjiList.sort(() => 0.5 - Math.random()).slice(0, 10);
    let selectedVocab = vocabularyList.sort(() => 0.5 - Math.random()).slice(0, 10);

    let selectedWords = [...selectedKanji, ...selectedVocab];

    selectedWords.forEach((q, index) => {
        let correctAnswer = q.meaning;
        let choices = new Set([correctAnswer]);

        while (choices.size < 4) {
            let randomChoice = vocabularyList.concat(kanjiList)
                .filter(item => item.meaning !== correctAnswer)
                [Math.floor(Math.random() * (kanjiList.length + vocabularyList.length))].meaning;
            choices.add(randomChoice);
        }

        questions.push({
            word: q.word,
            correctAnswer,
            choices: Array.from(choices).sort(() => Math.random() - 0.5)
        });
    });

    startQuiz();
}

function startQuiz() {
    document.getElementById("quiz-container").classList.remove("hidden");
    showQuestions();
}

function showQuestions() {
    let quizHTML = questions.map((q, index) => `
        <div class="question">
            <p class="question-name"><b>Question ${index + 1}:</b> 「${q.word}」 means ?</p>
            <div class="answer-container">
                ${q.choices.map(choice => `
                    <div class="answer" onclick="selectAnswer(${index}, this, '${choice}')">
                        ${choice}
                    </div>
                `).join('')}
            </div>
            <p id="result-${index}" class="result-text hidden"></p>
        </div>
    `).join('');

    document.querySelector(".fixed-head").insertAdjacentHTML("afterend", quizHTML);
    document.getElementById("quiz-score").innerHTML = "";
}


function submitQuiz() {
    let score = 0;
    if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
        return; // Nếu bấm Cancel thì dừng hàm
    }

    let fixedHead = document.querySelector(".fixed-head");
    if (fixedHead) {
        // Lấy phần tử cha của fixedHead
        let parent = fixedHead.parentNode;

        // Di chuyển từng phần tử con ra ngoài
        while (fixedHead.firstChild) {
            parent.insertBefore(fixedHead.firstChild, fixedHead);
        }

        // Xóa fixedHead
        fixedHead.remove();
    }
    clearInterval(timerInterval);
    questions.forEach((q, index) => {
        let userAnswer = userAnswers[index];
        let correct = q.correctAnswer;
        document.querySelectorAll('.result-text').forEach(rt => rt.classList.remove('hidden'));
        let resultElement = document.getElementById(`result-${index}`);

        if (userAnswer === correct) {
            score++;
            resultElement.innerHTML = `<span class="correct ">✅ Đúng!</span>`;
        } else {
            resultElement.innerHTML = `<span class="wrong ">❌ Sai! Đáp án đúng là: <b>${correct}</b></span>`;
        }
    });

    Swal.fire({
        title: 'Kết quả bài thi',
        html: `<h3 style="color: #007bff;">Số câu đúng: ${score}/${totalQuestions}</h3>`,
        icon: 'success',
        confirmButtonText: 'OK',
    });
    document.getElementById("submit-answer-button").innerHTML = `🎯 Tổng điểm: ${score}/${totalQuestions}`;
}
function selectAnswer(questionIndex, element, selectedAnswer) {
    // Loại bỏ class 'selected' khỏi tất cả đáp án của câu hỏi này
    element.parentElement.querySelectorAll('.answer').forEach(a => a.classList.remove('selected'));

    // Thêm class 'selected' cho đáp án được chọn
    element.classList.add('selected');

    // Lưu đáp án vào userAnswers
    userAnswers[questionIndex] = selectedAnswer;
}

document.getElementById("toggleQuestions").addEventListener("click", function () {
    const container = document.querySelector(".question_num");
    // Nếu đang ẩn thì mở rộng lên bằng scrollHeight, ngược lại thu lại
    if (!container.style.height || container.style.height === "0px") {
        container.style.height = container.scrollHeight + "px";
    } else {
        container.style.height = "0px";
    }
});

