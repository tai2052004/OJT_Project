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

document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () =>
    {
        secondBody.style.display = "block";
        document.querySelectorAll('.num-active').forEach(el => el.classList.remove('num-active'));
        setInterval(updateCountdown, 1000);
    });
    levelContent.forEach(lv => lv.addEventListener('click',() =>
    {
        levelContent.forEach(l => l.classList.remove('num-active'));
        lv.classList.add('num-active');
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

