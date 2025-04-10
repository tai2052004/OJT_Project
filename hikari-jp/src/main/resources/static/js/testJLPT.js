const video = document.getElementById('video');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mess = document.getElementById("message");
let scanning = true;
let animationId

async function initFaceCheck() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            startCheckingLoop(); // <-- Bắt đầu quét mỗi giây
        });
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
                mess.innerText = "Please let your face in camera";
                triggerWarning();
            } else if (!msg.includes("Face valid")) {
                mess.innerText = "Please don't let anyone else in your camera";
                triggerWarning();
            }

        } catch (err) {
            console.error("Lỗi validate:", err);
        }
    }

    animationId = requestAnimationFrame(startCheckingLoop);
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
initFaceCheck();

document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".question");
    const questionBoxContainer = document.querySelector(".question-boxes");
    const rightPanel = document.querySelector(".right-panel");
    const progressBar = document.querySelector(".progress-bar");
    const timerElement = document.querySelector('.right-panel p');
    const submitButton = document.querySelector('.submit-btn');
    let timeLeft = 60 * 60; // 3600 seconds
    let timerInterval;
    let testSubmitted = false; // Flag to track whether the test has been submitted


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
            clearInterval(timerInterval);
            if (!testSubmitted) {
                alert("Time's up! Your test will be submitted.");
                submitButton.click(); // Automatically trigger the submit button if time runs out
            }
        }
    }

    function startTest() {
        if (testSubmitted) return; // If test has been submitted, do nothing
        enableFullscreen();
        overlay.style.display = "none";
        timerInterval = setInterval(updateTimer, 1000); // Start countdown timer
        attachListeners();
    }

    startButton.addEventListener("click", startTest);

    document.addEventListener("fullscreenchange", preventFullscreenExit);
    document.addEventListener("mozfullscreenchange", preventFullscreenExit);
    document.addEventListener("webkitfullscreenchange", preventFullscreenExit);
    document.addEventListener("MSFullscreenChange", preventFullscreenExit);

    // Detect tab/app switch
    function detectTabSwitch() {
        if (testSubmitted) return; // Disable tab switch detection if test is submitted
        if (document.hidden || document.visibilityState === "hidden") {
            alert("You have violated the test rules! Redirecting in 3 seconds...");
            setTimeout(() => {
                window.location.href = "/backToHome";
            }, 3000);
        }
    }

    function detectWindowBlur() {
        if (testSubmitted) return; // Disable window blur detection if test is submitted
        setTimeout(() => {
            if (!document.hasFocus()) {
                alert("You have violated the test rules! Redirecting in 3 seconds...");
                setTimeout(() => {
                    window.location.href = "/backToHome";
                }, 3000);
            }
        }, 200);
    }
    function attachListeners() {
        const questions = document.querySelectorAll(".question");
        questionBoxContainer.innerHTML = "";

        questions.forEach((question, index) => {
            const box = document.createElement("div");
            box.classList.add("question-box");
            box.textContent = index + 1;
            box.dataset.index = index;
            box.addEventListener("click", () => {
                question.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            questionBoxContainer.appendChild(box);
        });

        trackAnswers();
    }

    document.addEventListener("visibilitychange", detectTabSwitch);
    window.addEventListener("blur", detectWindowBlur);
    function updateProgress() {
        const totalQuestions = document.querySelectorAll(".question").length;
        const answeredCount = document.querySelectorAll(".question-box.answered").length;
        const progress = (answeredCount / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }


    // Track answer selection
    // Track answer selection and add unselect functionality
    function trackAnswers() {
        const questions = document.querySelectorAll(".question");
        let answeredCount = 0;

        questions.forEach((question, index) => {
            const boxDiv = question.querySelector(".box");
            const inputs = question.querySelectorAll("input[type='radio']");
            const box = document.querySelector(`.question-boxes .question-box:nth-child(${index + 1})`);

            const unselectButton = document.createElement("button");
            unselectButton.textContent = "Unselect";
            unselectButton.style.display = "none";
            unselectButton.addEventListener("click", () => {
                inputs.forEach(input => input.checked = false);
                if (box.classList.contains("answered")) {
                    answeredCount--;
                    box.classList.remove("answered");
                    box.style.backgroundColor = "";
                }
                unselectButton.style.display = "none";
                updateProgress();
            });
            boxDiv.appendChild(unselectButton);

            inputs.forEach(input => {
                input.addEventListener("change", () => {
                    if (!box.classList.contains("answered")) {
                        answeredCount++;
                        box.classList.add("answered");
                        box.style.backgroundColor = "green";
                    }
                    unselectButton.style.display = "block";
                    updateProgress();
                });
            });
        });
    }

    submitButton.addEventListener("click", function () {
        if (testSubmitted) return;
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
                    scanning = false;
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                    }
                    if (video.srcObject) {
                        video.srcObject.getTracks().forEach(track => track.stop());
                        video.style.display = "none";
                    }
                    document.exitFullscreen();
                    clearInterval(timerInterval); // Stop the timer
                    let scoreInput = document.getElementById("userScore");
                    let score = 0; // Initialize score

                    // Re-select questions dynamically so that it reflects all rendered elements
                    const questions = document.querySelectorAll(".question");

                    questions.forEach((question, index) => {
                        const correctAnswer = question.dataset.correctAnswer; // Get the correct answer from dataset
                        const inputs = question.querySelectorAll("input[type='radio']");
                        let selectedValue = null;

                        // Determine the selected answer
                        inputs.forEach(input => {
                            if (input.checked) {
                                selectedValue = input.value;
                            }
                        });

                        // Disable all radio buttons for this question
                        inputs.forEach(input => {
                            input.disabled = true;
                        });

                        // Remove any existing marker in the question
                        let oldMarker = question.querySelector(".marker");
                        if (oldMarker) {
                            oldMarker.remove();
                        }

                        // Create a new marker to display next to the choices
                        let marker = document.createElement("span");
                        marker.className = "marker";
                        marker.style.marginLeft = "10px"; // add some spacing

                        // Check if the selected answer is correct and set marker text and color
                        if (selectedValue === correctAnswer) {
                            score++; // Increase score for correct answer
                            marker.textContent = "O";
                            marker.style.color = "green";
                        } else {
                            marker.textContent = "X";
                            marker.style.color = "red";
                        }

                        // Insert the marker after the choices list in the current question
                        let choicesList = question.querySelector('.choices');
                        if (choicesList) {
                            choicesList.parentNode.insertBefore(marker, choicesList.nextSibling);
                        }
                        // Hide "Unselect" button after submission
                        const unselectButton = question.querySelector("button");
                        if (unselectButton) {
                            unselectButton.style.display = "none";
                        }
                        // Also, mark the corresponding question box color in the right panel
                        const box = document.querySelector(`.question-boxes .question-box:nth-child(${index + 1})`);
                        if (selectedValue === null) {
                            box.style.backgroundColor = "gray"; // no answer selected
                        } else if (selectedValue === correctAnswer) {
                            box.style.backgroundColor = "green"; // correct answer
                        } else {
                            box.style.backgroundColor = "red"; // wrong answer
                        }
                    });

                    // Store updated score in the hidden input field
                    scoreInput.value = score;

                    // Mark the test as submitted and disable further submissions
                    testSubmitted = true;
                    submitButton.disabled = true;
                }
            });
        }// Prevent multiple submissions

    });



    window.addEventListener("scroll", () => {
        const offset = 20; // Space from top
        rightPanel.style.position = "fixed";
        rightPanel.style.top = `${offset}px`;
    });

});

