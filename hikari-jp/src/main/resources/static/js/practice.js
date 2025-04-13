let totalTime = 60 * 20; //
let totalTimeRead = 60 * 60;
let totalListening = 60 * 30;
let totalTimeGrammar = 60 * 40;
let timeLeft = 0;
let timerInterval = null;
let countdownElement = document.getElementById("time");
let startButton = document.querySelector('.start-button');
let secondBody = document.querySelector('.second-body');
let levelContent = document.querySelectorAll('.level-content');
let subjectContent = document.querySelectorAll('.subject-content');
let topicNum = document.querySelectorAll('.topic-num');
let num = document.querySelectorAll('.num');
let levelContentInput = document.getElementById("level_test");
let subjectTestInput = document.getElementById("subject_test");
let topicTestInput = document.getElementById("topic_test");
let gradeContent = document.querySelectorAll('.grade-content');
let gradeTestInput = document.getElementById("grade-test");
let levelReading = document.getElementById("level_test_reading");
let questionContent = document.querySelectorAll('.question-content');
let questionListening = document.querySelectorAll('.questionListening');
let readingPart  = document.querySelector('.readingPart');
let listeningPart  = document.querySelector('.listeningPart');
let grammarPart = document.querySelector('.grammarPart');
let questionGrammar = document.querySelectorAll('.questionGrammar');

document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () =>
    {

        let scoreResultDiv = document.querySelector(".score-result");
        if (scoreResultDiv) {
            scoreResultDiv.outerHTML = '<button class="submit-answer-button" onclick="submitQuiz()">Submit</button>';
        }
        if (testNavigate())
        {
            secondBody.style.display = "block";
            document.querySelectorAll('.num-active').forEach(el => el.classList.remove('num-active'));
            if (subjectTestInput.value.includes("たんご"))
            {
                fetchVocabulary();
                // Clear interval cũ nếu có
                if (timerInterval) clearInterval(timerInterval);
                // Gán interval mới vào biến
                timeLeft = totalTime;
                timerInterval = setInterval(updateCountdown, 1000);
                if (readingPart)
                {
                    readingPart.style.display = "none";
                }
                if (listeningPart)
                {
                    listeningPart.style.display = "none";
                }
                if (grammarPart)
                {
                    grammarPart.style.display = "none";
                }

            }
            if (subjectTestInput.value.includes("どっかい"))
            {
                let hiddenInputSubject = subjectTestInput.value;
                let hiddenInputLevel = levelContentInput.value;
                let hiddenInputTopic = topicTestInput.value;
                let hiddenInputGrade = gradeTestInput.value;
                sessionStorage.setItem("savedHiddenSubject", hiddenInputSubject);
                sessionStorage.setItem("savedHiddenLevel", hiddenInputLevel);
                sessionStorage.setItem("savedHiddenTopic", hiddenInputTopic);
                sessionStorage.setItem("savedHiddenGrade", hiddenInputGrade);
                document.getElementById("myForm").submit();
                // Clear interval cũ nếu có
            }
            if (subjectTestInput.value.includes("ちょうかい"))
            {
                let hiddenInputSubject = subjectTestInput.value;
                let hiddenInputLevel = levelContentInput.value;
                let hiddenInputTopic = topicTestInput.value;
                let hiddenInputGrade = gradeTestInput.value;
                sessionStorage.setItem("savedHiddenSubject", hiddenInputSubject);
                sessionStorage.setItem("savedHiddenLevel", hiddenInputLevel);
                sessionStorage.setItem("savedHiddenTopic", hiddenInputTopic);
                sessionStorage.setItem("savedHiddenGrade", hiddenInputGrade);
                document.getElementById("myForm").submit();
                // Clear interval cũ nếu có
            }
            if (subjectTestInput.value.includes("ぶんぽう"))
            {
                let hiddenInputSubject = subjectTestInput.value;
                let hiddenInputLevel = levelContentInput.value;
                let hiddenInputTopic = topicTestInput.value;
                let hiddenInputGrade = gradeTestInput.value;
                sessionStorage.setItem("savedHiddenSubject", hiddenInputSubject);
                sessionStorage.setItem("savedHiddenLevel", hiddenInputLevel);
                sessionStorage.setItem("savedHiddenTopic", hiddenInputTopic);
                sessionStorage.setItem("savedHiddenGrade", hiddenInputGrade);
                document.getElementById("myForm").submit();
                // Clear interval cũ nếu có
            }

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
        if (subjectTestInput.value.includes("どっかい") || subjectTestInput.value.includes("ちょうかい") || subjectTestInput.value.includes("ぶんぽう"))
        {
            gradeContent.forEach(gr =>
            {
                gr.classList.add("disabled");
            });
        }
        else
        {
            gradeContent.forEach(gr =>
            {
                gr.classList.remove("disabled");
            });
        }
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
    let savedHiddenSubject = sessionStorage.getItem("savedHiddenSubject");
    let savedHiddenLevel = sessionStorage.getItem("savedHiddenLevel");
    let savedHiddenTopic = sessionStorage.getItem("savedHiddenTopic");
    let savedHiddenGrade = sessionStorage.getItem("savedHiddenGrade");

    if (savedHiddenSubject.includes("どっかい"))
    {
        if (timerInterval) clearInterval(timerInterval);
        // Gán interval mới vào biến
        timeLeft = totalTimeRead;
        timerInterval = setInterval(updateCountdown, 1000);
    }
    if (savedHiddenSubject.includes("ちょうかい"))
    {
        if (timerInterval) clearInterval(timerInterval);
        // Gán interval mới vào biến
        timeLeft = totalListening;
        timerInterval = setInterval(updateCountdown, 1000);
    }
    if (savedHiddenSubject.includes("ぶんぽう"))
    {
        if (timerInterval) clearInterval(timerInterval);
        // Gán interval mới vào biến
        timeLeft = totalTimeGrammar;
        timerInterval = setInterval(updateCountdown, 1000);
    }
    if (savedHiddenSubject) {
        subjectTestInput.value = savedHiddenSubject;
        sessionStorage.removeItem("savedHiddenSubject");
    }
    if (savedHiddenLevel) {
       levelContentInput.value = savedHiddenLevel;
        sessionStorage.removeItem("savedHiddenLevel");
    }
    if (savedHiddenTopic) {
        topicTestInput.value = savedHiddenTopic;
        sessionStorage.removeItem("savedHiddenTopic");
    }
    if (savedHiddenGrade)
    {
        gradeTestInput.value = savedHiddenGrade;
        sessionStorage.removeItem("savedHiddenGrade");
    }

    // Nếu muốn xóa dữ liệu sau khi lấy (chỉ lưu tạm trong 1 lần load)




    let value = document.getElementById("checkValue").value;
    if (value) {
        secondBody.style.display = "block";
        document.querySelector('.subject-name').innerText = subjectTestInput.value + " " + topicTestInput.value + "(" + levelContentInput.value +")"
        generateNumOfQuestion(2);
    }

    let valueListen = document.getElementById("checkListen").value;
    if (valueListen) {
        secondBody.style.display = "block";
        document.querySelector('.subject-name').innerText = subjectTestInput.value + " " + topicTestInput.value + "(" + levelContentInput.value +")"
        generateNumOfQuestion(3);
        checkViewPort();
    }

    let valueGrammar = document.getElementById("checkGrammar").value;
    if (valueGrammar)
    {
        secondBody.style.display = "block";
        document.querySelector('.subject-name').innerText = subjectTestInput.value + " " + topicTestInput.value + "(" + levelContentInput.value +")"
        generateNumOfQuestion(5);
        checkViewPort();
    }

});

function updateCountdown() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;


    if (timeLeft > 0) {
        timeLeft--;
    } else {
        countdownElement.innerText = "Hết giờ!";
        submitQuiz();
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

    if (subjectTestInput.value.includes("たんご")) {
        if ((!jlptGrade) || (!jlptGrade.includes("10") && !jlptGrade.includes("20") && !jlptGrade.includes("30"))) {
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
    }
   if (subjectTestInput.value.includes("どっかい"))
    {
        gradeTestInput.value = "2";
    }
    if (subjectTestInput.value.includes("ちょうかい"))
    {
        gradeTestInput.value = "3";
    }
    if (subjectTestInput.value.includes("ぶんぽう"))
    {
        gradeTestInput.value = "5";
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
    generateNumOfQuestion(gradeTestInput.value);
}

function checkViewPort()
{
    let togglediv = document.querySelector('.toggle-div');
    let secondbody1 = document.querySelector('.second-body-1');
    let question_num = document.querySelector('.question_num');
    document.querySelector('.subject-name').innerText = subjectTestInput.value + " " + topicTestInput.value  + "(" + levelContentInput.value +")"
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
            if (fixhead)
            {
                fixhead.remove();
            }

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
    if ( timeLeft > 0)
    {
        if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
            return; // Nếu bấm Cancel thì dừng hàm
        }
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
    document.querySelectorAll('.num').forEach( n =>
        {
            n.removeEventListener("click",selectAnswer);
        }
    );
    if (subjectTestInput.value.includes("たんご"))
    {
        questions.forEach((q, index) => {
            let userAnswer = userAnswers[index];
            let correct = q.correctAnswer;
            document.querySelectorAll('.result-text').forEach(rt => rt.classList.remove('hidden'));
            let all_results = document.querySelectorAll(`#result-${index}`);
            let resultElement = Array.from(all_results).find(r => !r.closest('.readingPart') && !r.closest('.listeningPart'));
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
    }
    else if (subjectTestInput.value.includes("どっかい") || subjectTestInput.value.includes("ちょうかい") || subjectTestInput.value.includes("ぶんぽう"))
    {
        let variable = questionContent;
        if (subjectTestInput.value.includes("どっかい"))
        {
            variable = questionContent;
        }
        else if (subjectTestInput.value.includes("ちょうかい"))
        {
            variable = questionListening;
        }
        else if (subjectTestInput.value.includes("ぶんぽう"))
        {
            variable = questionGrammar;
            document.querySelectorAll('.toggle-div-explain').forEach(item =>
            {
                item.classList.remove("hidden");
            })
        }
        variable.forEach(qc =>
        {
            let parentID = qc.id.split('-')[1];
            let userAnswer = document.getElementById('userAnswer-' + parentID);
            let correctAnswer = document.getElementById('correctAnswer-' + parentID);
            let resultElement = document.getElementById('result-' + parentID);
            document.querySelectorAll('.result-text').forEach(rt => rt.classList.remove('hidden'));
            let answer = qc.querySelectorAll('.answer');
            if ( userAnswer.value === correctAnswer.value)
            {
                score++;
                resultElement.innerHTML = `<span class="correct ">✅ Correct!</span>`;
            }else {
                document.querySelectorAll('.num').forEach( n =>
                {
                    if ( parseInt( n.dataset.question) === parseInt(parentID))
                    {
                        n.classList.remove("selectedNum");
                        n.classList.add("wrongNum");
                    }
                })
                answer.forEach(aq =>
                {
                    if(aq.innerText.trim() === correctAnswer.value)
                    {
                        aq.style.backgroundImage   = "linear-gradient(45deg, #1B9544, lightgreen)";
                    }
                    if(aq.innerText.trim() === userAnswer.value)
                    {
                        aq.style.backgroundImage   = "linear-gradient(45deg, #bc2b26, lightcoral)";
                    }
                })
                resultElement.innerHTML = `<span class="wrong ">❌ Incorrect! Correct answer is: <b>${correctAnswer.value}</b></span>`;
            }

        })
    }


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

function generateNumOfQuestion(gradeTestInputValue)
{
    let questNum = document.querySelector('.question_num');
    document.querySelectorAll('.num').forEach(n => {
        let newNode = n.cloneNode(false); // Clone node để bỏ hết event
        n.replaceWith(newNode);
    });

    // 🔹 Xóa toàn bộ div con trong .question_num
    questNum.innerHTML = "";
    for( let i = 1; i <= parseInt(gradeTestInputValue); i++)
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
        let target_question = null;
        if ( subjectTestInput.value.includes("たんご"))
        {
            let all_questions = document.querySelectorAll("#question-" + numAtr);

            // Lọc ra phần tử không nằm trong .readingPart
            target_question = Array.from(all_questions).find(q => !q.closest('.readingPart') && !q.closest('.listeningPart'));
        }
        else
        {
            target_question = document.getElementById("question-" + numAtr);
        }

        if (target_question)
        {
            target_question.scrollIntoView({ behavior : "smooth" })
        }
    }))
}

function selectAnswerReading(abc)
{

    abc.parentElement.querySelectorAll('.answer').forEach(a => a.classList.remove('selectedRead'));
    let parentID = null;
    if (subjectTestInput.value.includes("どっかい"))
    {
        parentID = abc.parentElement.id.split('-')[1];
    }
    else if (subjectTestInput.value.includes("ちょうかい") || subjectTestInput.value.includes("ぶんぽう"))
    {
        parentID = abc.parentElement.parentElement.id.split('-')[1]
    }
    let userAnswer = document.getElementById("userAnswer-" + parentID);
    userAnswer.value = abc.textContent;
    // Thêm class 'selected' cho đáp án được chọn
    abc.classList.add('selectedRead');
    document.querySelectorAll('.num').forEach(  n =>
    {
        if (n.dataset.question === parentID )
        {
            n.classList.add("selectedNum");
        }
    })
}

function toggleExplain(cde)
{
    let divID = cde.id.split("-")[1];
    let explain = document.getElementById("explain-" + divID);
    if (!explain.style.height || explain.style.height === "0px") {
        explain.style.padding = "15px";
        explain.style.height = explain.scrollHeight + 50 + "px";
    } else {
        explain.style.padding = "0";
        explain.style.height = "0px";
    }
}

