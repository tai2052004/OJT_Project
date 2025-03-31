let totalTime = 60 * 20; // 60 phút = 3600 giây
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
let gradeContent = document.querySelectorAll('.grade-content');
let gradeTestInput = document.getElementById("grade-test");
let levelReading = document.getElementById("level_test_reading");

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
            if (subjectTestInput.value.includes("どっかい"))
            {
                document.getElementById("myForm").submit();
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
        levelReading.value = lv.id;
    }));
    subjectContent.forEach(sc => sc.addEventListener('click',() =>
    {
        subjectContent.forEach(s => s.classList.remove('num-active'));
        sc.classList.add('num-active');
        subjectTestInput.value = sc.textContent;
    }));
    gradeContent.forEach(gr => gr.addEventListener('click',() =>
    {
        gradeContent.forEach(g => g.classList.remove('num-active'));
        gr.classList.add('num-active');
        gradeTestInput.value = gr.textContent;
    }));
    topicNum.forEach(tn => tn.addEventListener('click',() =>
    {
        topicNum.forEach(t => t.classList.remove('num-active'));
        tn.classList.add('num-active');
        topicTestInput.value = tn.textContent;
    }));

    let value = document.getElementById("checkValue").value;
    if (value) {
        secondBody.style.display = "block";
    }

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
    let jlptGrade = gradeTestInput.value;
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

    if (!jlptGrade) {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: 'warning',
            title: 'Please choose num of question.',
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

    checkViewPort();
    generateQuestions();
    generateNumOfQuestion();
}

function checkViewPort()
{
    let togglediv = document.querySelector('.toggle-div');
    let secondbody1 = document.querySelector('.second-body-1');
    let question_num = document.querySelector('.question_num');
    document.querySelector('.subject-name').innerText = subjectTestInput.value + " " + topicTestInput.value
    let parentDiv = [secondbody1,togglediv, question_num];

    const originalPosition = parentDiv.map(block => (
        {
            parent : block.parentNode,
            nextSibling : block.nextSibling
        }
    ))

    const threshold = togglediv.offsetTop;

    window.addEventListener("scroll", () => {
        if (window.scrollY > threshold)
        {
            if (!document.querySelector('.fixed-head'))
            {
                const fixedHead = document.createElement("div");
                fixedHead.classList.add("fixed-head");

                parentDiv.forEach( child => fixedHead.appendChild(child));

                const secondbody = document.querySelector('.second-body');
                if (secondbody)
                {
                    secondbody.appendChild(fixedHead);
                }
            }
        } else
        {
            const fixhead = document.querySelector('.fixed-head')

            parentDiv.forEach( (c, i) => {
                const { parent, sibling } = originalPosition[i];
                parent.insertBefore(c, sibling);
            });
            fixhead.remove();
        }
    })

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

    let selectedKanji = kanjiList.sort(() => 0.5 - Math.random()).slice(0, parseInt(gradeTestInput.value) / 2);
    let selectedVocab = vocabularyList.sort(() => 0.5 - Math.random()).slice(0, parseInt(gradeTestInput.value) / 2);

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

    showQuestions();
}

function showQuestions() {
    let quizHTML = questions.map((q, index) => `
        <div class="question">
            <p class="question-name" id="question-${index + 1}"><b>Question ${index + 1}:</b> 「${q.word}」 means ?</p>
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

    document.querySelector(".second-body").insertAdjacentHTML("afterend", quizHTML);
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
        let answerQuestion = document.querySelectorAll(`#question-${index + 1} + .answer-container .answer`);
        if (userAnswer === correct) {
            score++;
            resultElement.innerHTML = `<span class="correct ">✅ Correct!</span>`;
        } else {
            document.querySelectorAll('.num').forEach( n =>
            {
                if ( parseInt( n.dataset.question) === index + 1)
                {
                    n.classList.remove("selectedNum");
                    n.classList.add("wrongNum");
                }
            })
            answerQuestion.forEach(aq =>
            {
                if(aq.innerText.trim() === correct)
                {
                    aq.style.backgroundImage   = "linear-gradient(45deg, #1B9544, lightgreen)";
                }
                if(aq.innerText.trim() === userAnswer)
                {
                    aq.style.backgroundImage   = "linear-gradient(45deg, #bc2b26, lightcoral)";
                }
            })
            resultElement.innerHTML = `<span class="wrong ">❌ Incorrect! Correct answer is: <b>${correct}</b></span>`;
        }
    });

    Swal.fire({
        title: 'Kết quả bài thi',
        html: `<h3 style="color: #007bff;">Số câu đúng: ${score}/${gradeTestInput.value}</h3>`,
        icon: 'success',
        confirmButtonText: 'OK',
    });

    let newDiv = document.createElement("div");
    newDiv.innerText = `🎯 Total Score: ${score}/${gradeTestInput.value}`;
    newDiv.classList.add("score-result");

    let btn = document.querySelector('.submit-answer-button');
    btn.parentNode.replaceChild(newDiv,btn);
}
function selectAnswer(questionIndex, element, selectedAnswer) {
    // Loại bỏ class 'selected' khỏi tất cả đáp án của câu hỏi này
    element.parentElement.querySelectorAll('.answer').forEach(a => a.classList.remove('selected'));

    // Thêm class 'selected' cho đáp án được chọn
    element.classList.add('selected');
    document.querySelectorAll('.num').forEach(  n =>
    {
        if ( parseInt(n.dataset.question) === (questionIndex+1))
        {
            n.classList.add("selectedNum");
        }
    })

    // Lưu đáp án vào userAnswers
    userAnswers[questionIndex] = selectedAnswer;
}

document.getElementById("toggleQuestions").addEventListener("click", function () {
    const container = document.querySelector(".question_num");
    // Nếu đang ẩn thì mở rộng lên bằng scrollHeight, ngược lại thu lại
    if (!container.style.height || container.style.height === "0px") {
        container.style.height = container.scrollHeight + 50 + "px";
    } else {
        container.style.height = "0px";
    }
});

function generateNumOfQuestion()
{
    let questNum = document.querySelector('.question_num');
    for( let i = 1; i <= parseInt(gradeTestInput.value); i++)
    {
        let numDiv = document.createElement("div");
        numDiv.classList.add("num");
        numDiv.textContent = i;
        numDiv.setAttribute("data-question", i);
        questNum.appendChild(numDiv);
        console.log()
    }
    document.querySelectorAll('.num').forEach( n => n.addEventListener("click", () =>
    {
        let numAtr = n.dataset.question;
        let target_question = document.getElementById("question-" + numAtr);
        if (target_question)
        {
            target_question.scrollIntoView({ behavior : "smooth" })
        }
    }))
}
