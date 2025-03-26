let totalTime = 60 * 60; // 60 phút = 3600 giây
let timeLeft = totalTime;
let progressBar = document.getElementById("progress-bar");
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

            }
            setInterval(updateCountdown, 1000);
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
});

function updateCountdown() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Cập nhật thanh progress
    let progressPercentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = progressPercentage + "%";

    if (timeLeft > 0) {
        timeLeft--;

    } else {
        countdownElement.textContent = "Hết giờ!";
        progressBar.style.width = "0%";
    }
}

const API_KEY = "ca3a574a-9e5d-4e86-872f-c7d81efe7245";
const API_URL = "https://api.wanikani.com/v2/subjects?types=kanji&levels=";
let vocabularyList = [];
let questions = [];
let userAnswers = {};
let totalQuestions = 10;


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
    let jlptLevel = document.getElementById("jlpt-level").value;
    totalQuestions = parseInt(document.getElementById("question-count").value, 10);

    if (!JLPT_TO_WK[jlptLevel]) {
        alert("Vui lòng chọn cấp độ JLPT.");
        return;
    }

    let url = API_URL + JLPT_TO_WK[jlptLevel];
    let headers = { "Authorization": "Bearer " + API_KEY };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();
        vocabularyList = data.data.map(item => ({
            word: item.data.characters,
            meaning: item.data.meanings.map(m => m.meaning)[0]
        }));

        generateQuestions();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Tạo danh sách câu hỏi
function generateQuestions() {
    if (vocabularyList.length < 4) {
        alert("Không đủ dữ liệu để tạo quiz!");
        return;
    }

    questions = [];
    userAnswers = {};

    for (let i = 0; i < totalQuestions; i++) {
        let questionData = vocabularyList[Math.floor(Math.random() * vocabularyList.length)];
        let correctAnswer = questionData.meaning;

        let choices = new Set([correctAnswer]);
        while (choices.size < 4) {
            let randomChoice = vocabularyList[Math.floor(Math.random() * vocabularyList.length)].meaning;
            choices.add(randomChoice);
        }

        questions.push({
            word: questionData.word,
            correctAnswer,
            choices: Array.from(choices).sort(() => Math.random() - 0.5)
        });
    }

    startQuiz();
}

// Bắt đầu Quiz
function startQuiz() {
    document.getElementById("quiz-container").classList.remove("hidden");
    showQuestions();
}

// Hiển thị tất cả câu hỏi
function showQuestions() {
    let quizHTML = questions.map((q, index) => `
        <div class="question">
            <p><b>Câu ${index + 1}/${totalQuestions}:</b> 「${q.word}」 có nghĩa là gì?</p>
            ${q.choices.map(choice => `
                <label>
                    <input type="radio" name="question-${index}" value="${choice}" onchange="selectAnswer(${index}, '${choice}')">
                    ${choice}
                </label><br>
            `).join('')}
            <p id="result-${index}" class="result-text"></p> <!-- Chỗ để hiển thị kết quả -->
        </div>
    `).join('');

    document.getElementById("quiz-questions").innerHTML = quizHTML;
    document.getElementById("quiz-score").innerHTML = ""; // Reset điểm khi làm lại
}


// Lưu đáp án người dùng chọn
function selectAnswer(questionIndex, selectedAnswer) {
    userAnswers[questionIndex] = selectedAnswer;
}

// Chấm điểm khi bấm Submit
function submitQuiz() {
    let score = 0;

    questions.forEach((q, index) => {
        let userAnswer = userAnswers[index];
        let correct = q.correctAnswer;
        let resultElement = document.getElementById(`result-${index}`);

        if (userAnswer === correct) {
            score++;
            resultElement.innerHTML = `<span style="color: green;">✅ Đúng!</span>`;
        } else {
            resultElement.innerHTML = `<span style="color: red;">❌ Sai! Đáp án đúng là: <b>${correct}</b></span>`;
        }
    });

    document.getElementById("quiz-score").innerHTML = `<h2>🎯 Tổng điểm: ${score}/${totalQuestions}</h2>`;
}

