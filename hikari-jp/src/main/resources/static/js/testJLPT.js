const video = document.getElementById('video');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mess = document.getElementById("message");
let scanning = true;
let animationId
const questions = document.querySelectorAll(".question");
const questionBoxContainer = document.querySelector(".question-boxes");
const rightPanel = document.querySelector(".right-panel");
const progressBar = document.querySelector(".progress-bar");
const timerElement = document.querySelector('.right-panel p');
const submitButton = document.querySelector('.submit-btn');
let timeGrammar = 60 * 30;
let timeVocab = 60 * 20;
let timeListening = 60 * 30;
let timeReading = 60 * 40;
let timeLeft= timeVocab; // 3600 seconds
let timerInterval;
let testSubmitted = false; // Flag to track whether the test has been submitted
let btnNavigate = document.querySelectorAll('.header1 button');
let vocabPart = document.querySelector('.vocabPart');
let grammarPart = document.querySelector('.grammarPart');
let readingPart = document.querySelector('.readingPart');
let listeningPart = document.querySelector('.listeningPart');
let currentQuestionIndex = 0;
let abc = vocabPart;
let question;
let subjectNow = document.getElementById("subjectNow");
let vocabSize = document.getElementById("vocabSize");
let grammarSize = document.getElementById("grammarSize");
let readingSize = document.getElementById("readingSize");
let listeningSize = document.getElementById("listeningSize");
let finalScore = document.querySelector('.final-score');
let grammarCheck = false;
let readingCheck = false;
let listeningCheck = false;
let grammarBtn = document.getElementById('grammar');
let readingBtn = document.getElementById('reading');
let listeningBtn = document.getElementById('listening');
let countTimes = 0;
let countCheck = 0;
let scoreInput = document.getElementById('score');
let statusInput = document.getElementById('status');
let progressInput = document.getElementById('progress');
statusInput.value = "Finished";
let vocabRateInput = document.getElementById('vocab-rate');
let grammarRateInput = document.getElementById('grammar-rate');
let readingRateInput = document.getElementById('reading-rate');
let listeningRateInput = document.getElementById('listening-rate');
let testStarted = false;

async function initFaceCheck() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            startCheckingLoop(); // <-- Bắt đầu quét mỗi giây
        });
    });
}

async function initVoiceCheck()
{
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            startVoiceDetection();
        })
        .catch((err) => {
            alert("You need to grant microphone permission to use voice recognition.");
        });
}
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl)
]).then(() => {
    console.log("✅ Mô hình TinyFaceDetector đã được tải.");
});

let lastDetectionTime = 0;
const detectionInterval = 1500;

async function startCheckingLoop(timestamp) {
    if (!scanning) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions());

    // Vẽ box nếu có phát hiện khuôn mặt
    if (detections.length > 0) {
        const box = detections[0].box;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
    }

    // Gửi ảnh kiểm tra định kỳ
    if (timestamp - lastDetectionTime >= detectionInterval) {
        lastDetectionTime = timestamp;

        try {
            const msg = await captureAndValidate();
            console.log("📸 Số khuôn mặt phát hiện:", detections.length);
            if (detections.length === 0) {
                countTimes++;
                if ( countTimes > 5)
                {
                    isVoiceDetected = false;
                    scanning = false;
                    testSubmitted = true;
                    cancelAnimationFrame(animationId);
                    stopVoiceDetection();
                    clearInterval(timerInterval);
                    statusInput.value = "Violated"
                    scoreInput.value = "No Score"
                    await saveHistory();
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: "You have violated rules too much times. You will be redirected to Home Page",
                        showConfirmButton: false,
                        timer: 3000, // Swal sẽ tự động đóng sau 3 giây
                        timerProgressBar: true,
                        customClass: {
                            popup: 'custom-swal-popup'
                        },
                        didOpen: () => {
                            // Thay đổi overlay sau khi mở
                            document.querySelector('.swal2-container').style.background = 'rgba(0, 0, 0, 0.8)';
                        }
                    });
                    setTimeout(() => {
                        window.location.href = "/backToHome";
                    }, 3000);
                }
                else
                {
                    mess.innerText = "Please let your face in camera ( " + countTimes + " / 5 )";
                    triggerWarning();
                }
            } else if (!msg.includes("Face valid")) {
                countTimes++;
                if ( countTimes > 5)
                {
                    isVoiceDetected = false;
                    scanning = false;
                    testSubmitted = true;
                    cancelAnimationFrame(animationId);
                    stopVoiceDetection();
                    clearInterval(timerInterval);
                    statusInput.value = "Violated"
                    scoreInput.value = "No Score"
                    await saveHistory();
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: "You have violated rules too much times. You will be redirected to Home Page",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        customClass: {
                            popup: 'custom-swal-popup'
                        },
                        didOpen: () => {
                            // Thay đổi overlay sau khi mở
                            document.querySelector('.swal2-container').style.background = 'rgba(0, 0, 0, 0.8)';
                        }
                    });
                    setTimeout(() => {
                        window.location.href = "/backToHome";
                    }, 3000);
                }
                else
                {
                    mess.innerText = "Please don't let anyone else in your camera ( " + countTimes + " / 5 )";
                    triggerWarning();
                }
            } else if (detections.length > 1) {
                countTimes++;
                if ( countTimes > 5)
                {
                    isVoiceDetected = false;
                    scanning = false;
                    testSubmitted = true;
                    cancelAnimationFrame(animationId);
                    stopVoiceDetection();
                    clearInterval(timerInterval);
                    statusInput.value = "Violated"
                    scoreInput.value = "No Score"
                    await saveHistory();
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: "You have violated rules too much times. You will be redirected to Home Page",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        customClass: {
                            popup: 'custom-swal-popup'
                        },
                        didOpen: () => {
                            // Thay đổi overlay sau khi mở
                            document.querySelector('.swal2-container').style.background = 'rgba(0, 0, 0, 0.8)';
                        }
                    });
                    setTimeout(() => {
                        window.location.href = "/backToHome";
                    }, 3000);
                }
                else
                {
                    mess.innerText = "Please don't let anyone else in your camera ( " + countTimes + " / 5 )";
                    triggerWarning();
                }
            }


        } catch (err) {
            console.error("Lỗi validate:", err);
        }
    }

    if(scanning)
    {
        animationId = requestAnimationFrame(startCheckingLoop);
    }
}

function triggerWarning() {
    scanning = false;
    document.getElementById('warning-overlay').style.display = 'flex';
}

function resumeTest() {
    scanning = true;
    startCheckingLoop();
    document.getElementById('warning-overlay').style.display = 'none';
}
async function captureAndValidate() {
    return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
            try {
                const formData = new FormData();
                formData.append("file", blob, "face.jpg");

                const response = await fetch("/api/face/validate", {
                    method: "POST",
                    body: formData
                });

                const msg = await response.text();
                console.log("✅ Server response:", msg);
                resolve(msg); // trả về kết quả từ backend

            } catch (err) {
                console.error("❌ Lỗi khi gửi ảnh:", err);
                reject(err);
            }
        }, "image/jpeg");
    });
}

let recognition;
let isVoiceDetected = true;
let isVoiceDetectionActive = true;

async function startVoiceDetection() {
    try {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "vi-VN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false; // dùng false để tránh lỗi lặp chồng recognition

        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript.trim();
            console.log("Nghe được:", transcript);

            if (isVoiceDetected) {
                countTimes++;
                if ( countTimes > 5)
                {
                    isVoiceDetected = false;
                    scanning = false;
                    testSubmitted = true;
                    cancelAnimationFrame(animationId);
                    stopVoiceDetection();
                    clearInterval(timerInterval);
                    statusInput.value = "Violated"
                    scoreInput.value = "No Score"
                    saveHistory();
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: "You have violated rules too much times. You will be redirected to Home Page",
                        showConfirmButton: false,
                        timer: 3000, // Swal sẽ tự động đóng sau 3 giây
                        timerProgressBar: true,
                        customClass: {
                            popup: 'custom-swal-popup'
                        },
                        didOpen: () => {
                            // Thay đổi overlay sau khi mở
                            document.querySelector('.swal2-container').style.background = 'rgba(0, 0, 0, 0.8)';
                        }
                    });

                    setTimeout(() => {
                        window.location.href = "/backToHome";
                    }, 3000);
                }
                else
                {
                    Swal.fire({
                        icon: "info",
                        title: "Voice Detection!",
                        text: "Times : " + countTimes + "/5",
                        confirmButtonText: 'OK'
                    });
                }
            }
        };

        recognition.onerror = (event) => {
            console.warn("Lỗi nhận diện:", event.error);
        };

        recognition.onend = () => {
            if(isVoiceDetectionActive)
            {
                // Tự động khởi động lại sau khi kết thúc
                startVoiceDetection();
            }
        };

        recognition.start();
        console.log("Bắt đầu lắng nghe...");
    } catch (error) {
        console.error("Không thể dùng microphone:", error);
        alert("Please grant permission to use microphone.");
    }
}
function stopVoiceDetection() {
    isVoiceDetectionActive = false;
    if (recognition) {
        recognition.stop(); // Dừng recognition hiện tại
    }
}
initFaceCheck();
initVoiceCheck();



// Gọi hàm lần đầu sau khi có quyền mic



btnNavigate.forEach( bn => bn.addEventListener('click', () => handleClick(bn)));

// Correct answers (example, make sure to update with actual correct answers)

// Create overlay for rules and start test
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.background = "rgba(0, 0, 0, 0.8)";
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "9999";
overlay.style.flexDirection = "column";

const message = document.createElement("p");
message.style.color = "white";
message.style.fontSize = "18px";
message.textContent = "Please read the rules before starting the test.";

const rules = document.createElement("ul");
rules.style.color = "white";
rules.innerHTML = "<li>Stay in fullscreen mode.</li><li>Do not switch tabs or apps.</li><li>Do not take screenshot.</li><li>Complete the test without interruptions.</li>";

const startButton = document.createElement("button");
startButton.textContent = "Start Test";
startButton.style.fontSize = "20px";
startButton.style.padding = "10px 20px";
startButton.style.cursor = "pointer";

overlay.appendChild(message);
overlay.appendChild(rules);
overlay.appendChild(startButton);
document.body.appendChild(overlay);

function enableFullscreen() {
    if (testSubmitted) return; // Disable fullscreen functionality if test is submitted
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function preventFullscreenExit() {
    if (testSubmitted) return; // Disable fullscreen exit detection if test is submitted
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        overlay.style.display = "flex";
        message.textContent = "You must stay in fullscreen mode to continue the test!";
        startButton.textContent = "Continue";
    }
}

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    // Format minutes and seconds to always show two digits
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        if (!testSubmitted) {
            if ( grammarCheck === true && readingCheck === true && listeningCheck === true)
            {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: "Time's up! Your test will be submitted.",
                    confirmButtonText: 'OK'
                });
                clearInterval(timerInterval);
                submitButton.click();
            }
            else
            {
                if(!grammarCheck)
                {
                    grammarBtn.click();
                }
                else if (!readingCheck)
                {
                    readingBtn.click();
                }
                else if (!listeningCheck)
                {
                    listeningBtn.click();
                }
            }

        }
    }
}

function startTest() {
    if (testSubmitted) return; // If test has been submitted, do nothing
    enableFullscreen();
    overlay.style.display = "none";
    //If test started, don't set time interval
    if (!testStarted)
    {
        timerInterval = setInterval(updateTimer, 1000); // Start countdown timer
    }
    testStarted = true;
    // attachListeners();
}

startButton.addEventListener("click", startTest);

document.addEventListener("fullscreenchange", preventFullscreenExit);
document.addEventListener("mozfullscreenchange", preventFullscreenExit);
document.addEventListener("webkitfullscreenchange", preventFullscreenExit);
document.addEventListener("MSFullscreenChange", preventFullscreenExit);

// Detect tab/app switch
async function detectTabSwitch() {
    if (testSubmitted) return; // Disable tab switch detection if test is submitted
    if (document.hidden || document.visibilityState === "hidden") {
        isVoiceDetected = false;
        scanning = false;
        testSubmitted = true;
        cancelAnimationFrame(animationId);
        stopVoiceDetection();
        clearInterval(timerInterval);
        statusInput.value = "Violated"
        scoreInput.value = "No Score"
        overlay.style.display = "none";
        await saveHistory();
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: "You have violated rules. You will be redirected to Home Page",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'custom-swal-popup'
            },
            didOpen: () => {
                // Thay đổi overlay sau khi mở
                document.querySelector('.swal2-container').style.background = 'rgba(0, 0, 0, 0.8)';
            }
        });
        setTimeout(() => {
            window.location.href = "/backToHome";
        }, 3000);
    }
}

async function detectWindowBlur() {
    if (testSubmitted) return; // Disable window blur detection if test is submitted
    if (!document.hasFocus()) {
        isVoiceDetected = false;
        scanning = false;
        testSubmitted = true;
        cancelAnimationFrame(animationId);
        stopVoiceDetection();
        clearInterval(timerInterval);
        statusInput.value = "Violated"
        scoreInput.value = "No Score"
        overlay.style.display = "none";
        await saveHistory();
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: "You have violated rules. You will be redirected to Home Page",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'custom-swal-popup'
            },
            didOpen: () => {
                // Thay đổi overlay sau khi mở
                document.querySelector('.swal2-container').style.background = 'rgba(0, 0, 0, 0.8)';
            }
        });
        setTimeout(() => {
            window.location.href = "/backToHome";
        }, 3000);
    }
}


document.addEventListener("visibilitychange", detectTabSwitch);
window.addEventListener("blur", detectWindowBlur);
// function updateProgress() {
//     const totalQuestions = document.querySelectorAll(".question").length;
//     const answeredCount = document.querySelectorAll(".question-box.answered").length;
//     const progress = (answeredCount / totalQuestions) * 100;
//     progressBar.style.width = `${progress}%`;
// }

async function saveHistory()
{
    const total =
        Number(vocabSize.value) +
        Number(grammarSize.value) +
        Number(readingSize.value) +
        Number(listeningSize.value);

    console.log(Number(vocabSize.value));
    console.log(Number(grammarSize.value));
    console.log(Number(readingSize.value));
    console.log(Number(listeningSize.value));
    const percentage = Math.round((countCheck / total) * 100);
    console.log(percentage);
    progressInput.value = `${percentage}%`;
    const formData = new FormData()
    formData.append("topic", document.getElementById('topic').value);
    formData.append("level", document.getElementById('level').value);
    formData.append("score", document.getElementById('score').value);
    formData.append("status", document.getElementById('status').value);
    formData.append("progress", document.getElementById('progress').value);
    formData.append("date-taken", document.getElementById('date-taken').value);
    formData.append("vocab-rate", document.getElementById('vocab-rate').value);
    formData.append("grammar-rate", document.getElementById('grammar-rate').value);
    formData.append("reading-rate", document.getElementById('reading-rate').value);
    formData.append("listening-rate", document.getElementById('listening-rate').value);
    formData.append("user-answer", JSON.stringify(answers));

    const response = await fetch("/saveResult", {
        method: "POST",
        body: formData
    });
    console.log(await response.text());
}

submitButton.addEventListener("click", function () {
    if (testSubmitted) return;
    let score = 0;
    if ( timeLeft > 0)
    {
        Swal.fire({
            title: 'Are you sure submitting the test?',
            text: "You can't make any change after submitting!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Submitted successful!',
                    '',
                    'success'
                );
                displayResult(score);
            }
        });
    }
    else
    {
        displayResult(score);
    }

});

let indexx = 0;
let userCorrect = 0;
const answers = [];
function displayResult(score)
{
    scanning = false;
    clearInterval(timerInterval);
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    stopVoiceDetection();
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.style.display = "none";
    }
    document.exitFullscreen();
    timerElement.textContent = "Finished!";
    btnNavigate.forEach( bn => {
        bn.disabled = false;
    });
    document.querySelector('.back').style.display = "block";
    let variable = document.querySelectorAll('.question-item');
    document.querySelectorAll('.toggle-div-explain').forEach(item =>
    {
        item.classList.remove("hidden");
    });
    variable.forEach(qc =>
    {
        indexx++;
        let parentID = qc.id.split('-')[1];
        let userAnswer = qc.querySelector('#userAnswer-' + parentID);
        let correctAnswer = qc.querySelector('#correctAnswer-' + parentID);
        let testQuestionID = qc.querySelector('.test_question_id');
        answers.push( {
            userAnswer : userAnswer.value,
            testQuestionId : testQuestionID.value,
        } )
        let resultElement = qc.querySelector('#result-' + parentID);
        document.querySelectorAll('.result-text').forEach(rt => rt.classList.remove('hidden'));
        let answer = qc.querySelectorAll('.answer');
        answer.forEach(aq => {
            aq.onclick = null;
        });
        if ( userAnswer.value === correctAnswer.value)
        {
            score++;
            userCorrect++;
            resultElement.innerHTML = `<span class="correct ">✅ Correct!</span>`;
        }else {
            document.querySelectorAll('.question-box').forEach( n =>
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
            });
            resultElement.innerHTML = `<span class="wrong ">❌ Incorrect! Correct answer is: <b>${correctAnswer.value}</b></span>`;
        }

        if ( indexx === Number(vocabSize.value))
        {
            vocabRateInput.value = Math.floor((userCorrect / Number(vocabSize.value)) * 100 ) + '%';
            userCorrect = 0;
        }
        if (indexx === (Number(vocabSize.value) + Number(grammarSize.value)))
        {
            grammarRateInput.value = Math.floor((userCorrect / Number(grammarSize.value)) * 100 ) + '%';
            userCorrect = 0;
        }
        if (indexx === (Number(vocabSize.value) + Number(grammarSize.value) + Number(readingSize.value)))
        {
            readingRateInput.value = Math.floor((userCorrect / Number(readingSize.value)) * 100 ) + '%';
            userCorrect = 0;
        }
        if (indexx === (Number(vocabSize.value) + Number(grammarSize.value) + Number(readingSize.value) + Number(listeningSize.value)) )
        {
            listeningRateInput.value = Math.floor((userCorrect / Number(listeningSize.value)) * 100 ) + '%';
            userCorrect = 0;
        }

    });
    Swal.fire({
        title: 'Kết quả bài thi',
        html: `<h3 style="color: #007bff;">Số câu đúng: ${score}/${
            Number(vocabSize.value) +
            Number(grammarSize.value) +
            Number(readingSize.value) +
            Number(listeningSize.value)
        }</h3>`,
        icon: 'success',
        confirmButtonText: 'OK',
    });

    finalScore.innerText = `🎯 Total Score: ${score}/${
        Number(vocabSize.value) +
        Number(grammarSize.value) +
        Number(readingSize.value) +
        Number(listeningSize.value)
    }`;
    finalScore.style.display = "block";

    scoreInput.value = `${score}/${
        Number(vocabSize.value) +
        Number(grammarSize.value) +
        Number(readingSize.value) +
        Number(listeningSize.value)
    }`;



    saveHistory();
    // Store updated score in the hidden input field

    // Mark the test as submitted and disable further submissions
    testSubmitted = true;
    submitButton.disabled = true;
}

window.addEventListener("scroll", () => {
    const offset = 20; // Space from top
    rightPanel.style.position = "fixed";
    rightPanel.style.top = `${offset}px`;
});


function handleClick(bn) {
    if ( bn.classList.contains('selected'))
    {
        return;
    }
    if (!testSubmitted)
    {
        if ( timeLeft > 0 )
        {
            Swal.fire({
                title: 'Are you sure changing to another part?',
                text: "You can't change anything in the last section anymore. !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Change',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    btnNavigate.forEach( b => {
                        if ( b.classList.contains('selected'))
                        {
                            b.classList.remove('selected');
                            b.disabled = true;
                        }
                    });
                    bn.classList.add("selected");
                    btnNavigate.forEach( b => {
                        if (!b.classList.contains('selected'))
                        {
                            document.querySelector('.' + b.id).style.display = "none";
                        }
                    });
                    currentQuestionIndex = 0;
                    if ( bn.id.includes("grammar"))
                    {
                        subjectNow.value = "grammar";
                        generateQuestionNode();
                        document.querySelector('.container').style.width = "800px";
                        grammarPart.style.display = "block";
                        grammarCheck = true;
                        timeLeft = timeGrammar;
                        abc = grammarPart;
                        updateQuestionVisibility();
                    }
                    if ( bn.id.includes("reading"))
                    {
                        subjectNow.value = "reading";
                        generateQuestionNode();
                        document.querySelector('.container').style.width = "1400px";
                        readingCheck = true;
                        readingPart.style.display = "block";
                        timeLeft = timeReading;
                    }
                    if ( bn.id.includes("listening"))
                    {
                        subjectNow.value = "listening";
                        generateQuestionNode();
                        document.querySelector('.container').style.width = "800px";
                        listeningPart.style.display = "block";
                        listeningCheck = true;
                        timeLeft = timeListening;
                        abc = listeningPart;
                        updateQuestionVisibility();
                    }

                }
            });
        }
        else
        {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: "Time's up! You will be changed to the next part.",
                confirmButtonText: 'OK'
            });
            btnNavigate.forEach( b => {
                if ( b.classList.contains('selected'))
                {
                    b.classList.remove('selected');
                    b.disabled = true;
                }
            });
            bn.classList.add("selected");
            btnNavigate.forEach( b => {
                if (!b.classList.contains('selected'))
                {
                    document.querySelector('.' + b.id).style.display = "none";
                }
            });
            currentQuestionIndex = 0;
            if ( bn.id.includes("grammar"))
            {
                subjectNow.value = "grammar";
                generateQuestionNode();
                document.querySelector('.container').style.width = "800px";
                grammarPart.style.display = "block";
                grammarCheck = true;
                timeLeft = timeGrammar;
                abc = grammarPart;
                updateQuestionVisibility();
            }
            if ( bn.id.includes("reading"))
            {
                subjectNow.value = "reading";
                generateQuestionNode();
                document.querySelector('.container').style.width = "1400px";
                readingCheck = true;
                readingPart.style.display = "block";
                timeLeft = timeReading;
            }
            if ( bn.id.includes("listening"))
            {
                subjectNow.value = "listening";
                generateQuestionNode();
                document.querySelector('.container').style.width = "800px";
                listeningPart.style.display = "block";
                listeningCheck = true;
                timeLeft = timeListening;
                abc = listeningPart;
                updateQuestionVisibility();
            }
        }

    }
    else
    {
        currentQuestionIndex = 0;
        clearInterval(timerInterval);
        btnNavigate.forEach( b => {
            if ( b.classList.contains('selected'))
            {
                b.classList.remove('selected');
            }
        });
        bn.classList.add("selected");
        btnNavigate.forEach( b => {
            if (!b.classList.contains('selected'))
            {
                document.querySelector('.' + b.id).style.display = "none";
            }
        });
        if ( bn.id.includes("vocab"))
        {
            subjectNow.value = "vocab";
            generateQuestionNode();
            document.querySelector('.container').style.width = "800px";
            vocabPart.style.display = "block";
            timerElement.textContent = "Finished!"
            abc = vocabPart;
            updateQuestionVisibility();
        }
        if ( bn.id.includes("grammar"))
        {
            subjectNow.value = "grammar";
            generateQuestionNode();
            document.querySelector('.container').style.width = "800px";
            grammarPart.style.display = "block";
            timerElement.textContent = "Finished!"
            abc = grammarPart;
            updateQuestionVisibility();
        }
        if ( bn.id.includes("reading"))
        {
            subjectNow.value = "reading";
            generateQuestionNode();
            document.querySelector('.container').style.width = "1400px";
            readingPart.style.display = "block";
            timeLeft = timeReading;
        }
        if ( bn.id.includes("listening"))
        {
            subjectNow.value = "listening";
            generateQuestionNode();
            document.querySelector('.container').style.width = "800px";
            listeningPart.style.display = "block";
            timerElement.textContent = "Finished!"
            abc = listeningPart;
            updateQuestionVisibility();
        }
    }

}


function updateQuestionVisibility() {
    question = abc.querySelectorAll('.question-item');
    question.forEach((q, index) => {
        q.classList.remove('active');
        q.classList.add('hidden');
        if (index === currentQuestionIndex) {
            q.classList.add('active');
            q.classList.remove('hidden');
        }
    });
    // Cập nhật trạng thái nút
    abc.querySelector('.prev-btn').disabled = currentQuestionIndex === 0;
    abc.querySelector('.next-btn').disabled = currentQuestionIndex === question.length - 1;
}

function showNextQuestion() {
    if (currentQuestionIndex < abc.querySelectorAll('.question-item').length - 1) {
        currentQuestionIndex++;
        updateQuestionVisibility();
    }
}

function showPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestionVisibility();
    }
}

// Gọi khi trang load để hiện câu đầu tiên
window.addEventListener('DOMContentLoaded', () => {
    updateQuestionVisibility();
    generateQuestionNode();
});

function selectAnswer(abc)
{
    countCheck++;
    abc.parentElement.querySelectorAll('.answer').forEach(a => a.classList.remove('selectedRead'));
    let parentID = null;
    let userAnswer;
    if (subjectNow.value.includes("reading"))
    {
        parentID = abc.parentElement.id.split('-')[1];
        userAnswer = abc.parentElement.querySelector("#userAnswer-" + parentID);
    }
    else
    {
        parentID = abc.parentElement.parentElement.id.split('-')[1]
        userAnswer = abc.parentElement.parentElement.querySelector("#userAnswer-" + parentID);
    }

    userAnswer.value = abc.textContent;
    // Thêm class 'selected' cho đáp án được chọn
    abc.classList.add('selectedRead');
    document.querySelectorAll('.question-box').forEach(  n =>
    {
        if (n.dataset.question === parentID )
        {
            n.classList.add("selectedNum");
        }
    })
}

function generateQuestionNode()
{
    let questNum = document.querySelector('.question-boxes');
    let size = 0;
    questNum.innerHTML = "";
    if ( subjectNow.value.includes("vocab"))
    {
        size = vocabSize.value;
    }
    else if ( subjectNow.value.includes("grammar"))
    {
        size = grammarSize.value;
    }
    else if ( subjectNow.value.includes("listening"))
    {
        size = listeningSize.value;
    }
    else if ( subjectNow.value.includes("reading"))
    {
        size = readingSize.value;
    }
    // 🔹 Xóa toàn bộ div con trong .question_num
    for( let i = 1; i <= size; i++)
    {
        let numDiv = document.createElement("div");
        numDiv.classList.add("question-box");
        numDiv.textContent = i;
        numDiv.setAttribute("data-question", i);
        questNum.appendChild(numDiv);
    }

    document.querySelectorAll('.question-box').forEach( n => n.addEventListener("click", () =>
    {
        currentQuestionIndex = n.dataset.question - 1;
        updateQuestionVisibility();
    }));

    if (testSubmitted)
    {
        let variable;
        if (subjectNow.value.includes("vocab"))
        {
            variable = vocabPart.querySelectorAll('.question-item');
        }
        else if ( subjectNow.value.includes("grammar"))
        {
            variable = grammarPart.querySelectorAll('.question-item');
        }
        else if ( subjectNow.value.includes("listening"))
        {
            variable = listeningPart.querySelectorAll('.question-item');
        }
        else if ( subjectNow.value.includes("reading"))
        {
            variable = readingPart.querySelectorAll('.question-item');
        }
        variable.forEach(qc =>
        {
            let parentID = qc.id.split('-')[1];
            let userAnswer = qc.querySelector('#userAnswer-' + parentID);
            let correctAnswer = qc.querySelector('#correctAnswer-' + parentID);

            if ( userAnswer.value === correctAnswer.value)
            {
                document.querySelectorAll('.question-box').forEach( n =>
                {
                    if ( parseInt( n.dataset.question) === parseInt(parentID))
                    {
                        n.classList.add("selectedNum");
                    }
                });
            }else {
                document.querySelectorAll('.question-box').forEach( n =>
                {
                    if ( parseInt( n.dataset.question) === parseInt(parentID))
                    {
                        n.classList.remove("selectedNum");
                        n.classList.add("wrongNum");
                    }
                });
            }

        });
    }
}
function toggleExplain(cde)
{
    let divID = cde.id.split("-")[1];
    let explain = null;
    if ( subjectNow.value.includes("reading") )
    {
        explain = cde.parentElement.parentElement.querySelector("#explain-" + divID);
    }
    else
    {
        explain = cde.parentElement.querySelector("#explain-" + divID);
    }
    if (!explain.style.height || explain.style.height === "0px") {
        explain.style.padding = "15px";
        explain.style.height = explain.scrollHeight + 50 + "px";
    } else {
        explain.style.padding = "0";
        explain.style.height = "0px";
    }
}