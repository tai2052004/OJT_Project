let totalTime = 60 * 60; // 60 phút = 3600 giây
let timeLeft = totalTime;
let progressBar = document.getElementById("progress-bar");
let countdownElement = document.getElementById("time");
let startButton = document.querySelector('.start-button');
let secondBody = document.querySelector('.second-body');
let levelContent = document.querySelectorAll('.level-content');
let gradeContent = document.querySelectorAll('.grade-content');
let subjectContent = document.querySelectorAll('.subject-content');
let topicNum = document.querySelectorAll('.topic-num');
let answers = document.querySelectorAll('.answer');
let num = document.querySelectorAll('.num');
let levelContentInput = document.getElementById("level_test");

document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () =>
    {
        if ( fetchKanji() === true)
        {
            secondBody.style.display = "block";
            document.querySelectorAll('.num-active').forEach(el => el.classList.remove('num-active'));
            setInterval(updateCountdown, 1000);
        }
    });
    levelContent.forEach(lv => lv.addEventListener('click',() =>
    {
        levelContent.forEach(l => l.classList.remove('num-active'));
        lv.classList.add('num-active');
        levelContentInput.value = lv.textContent;
    }));
    gradeContent.forEach(gr => gr.addEventListener('click',() =>
    {
        gradeContent.forEach(g => g.classList.remove('num-active'));
        gr.classList.add('num-active');
    }));
    subjectContent.forEach(sc => sc.addEventListener('click',() =>
    {
        subjectContent.forEach(s => s.classList.remove('num-active'));
        sc.classList.add('num-active');
    }));
    topicNum.forEach(tn => tn.addEventListener('click',() =>
    {
        topicNum.forEach(t => t.classList.remove('num-active'));
        tn.classList.add('num-active');
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

const JLPT_TO_WK = {
    "N5": "1,2,3,4,5,6,7,8,9,10",
    "N4": "11,12,13,14,15,16,17,18,19,20",
    "N3": "21,22,23,24,25,26,27,28,29,30",
    "N2": "31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    "N1": "51,52,53,54,55,56,57,58,59,60"
};

async function fetchKanji() {
    let jlptLevel = levelContentInput.value;
    let levels = JLPT_TO_WK[jlptLevel];

    if (!levels) {
        Swal.fire({
            toast: true, // Hiển thị dưới dạng nhỏ gọn
            position: 'top', // Hiển thị ở phía trên màn hình
            icon: 'warning', // Biểu tượng cảnh báo
            title: 'Vui lòng chọn cấp độ JLPT.',
            showConfirmButton: false, // Ẩn nút OK
            timer: 3000 // Tự động biến mất sau 3 giây
        });
        return false;
    }

    let url = API_URL + levels;
    let headers = {
        "Authorization": "Bearer " + API_KEY
    };

    try {
        let response = await fetch(url, { headers });
        let data = await response.json();
        displayKanji(data);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        return false;
    }
    return true;
}

function displayKanji(data) {
    let kanjiList = document.getElementById("kanji-list");
    kanjiList.innerHTML = "";

    data.data.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("kanji-item");

        let kanji = document.createElement("h2");
        kanji.textContent = item.data.characters;

        let meanings = document.createElement("p");
        meanings.textContent = "Nghĩa: " + item.data.meanings.map(m => m.meaning).join(", ");

        div.appendChild(kanji);
        div.appendChild(meanings);
        kanjiList.appendChild(div);
    });
}

