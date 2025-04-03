document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".question");
    const questionBoxContainer = document.querySelector(".question-boxes");
    const rightPanel = document.querySelector(".right-panel");
    const progressBar = document.querySelector(".progress-bar");
    const timerElement = document.querySelector('.right-panel p');
    const submitButton = document.querySelector('.submit-btn');
    let answeredCount = 0;
    let timeLeft = 60 * 60; // 3600 seconds
    let timerInterval;
    let testSubmitted = false; // Flag to track whether the test has been submitted
    //@@ user java scrip to fetch question from database
    //------------------------------------------------------------------------------------------
    // function fetchAndRenderQuestions() {
    //     fetch("/jlptTest1")
    //         .then(response => response.json())
    //         .then(data => {
    //             renderQuestions(data);
    //             attachListeners();
    //         })
    //         .catch(error => console.error("Error fetching questions:", error));
    // }
    // function renderQuestions(questionsData) {
    //     const questionsContainer = document.querySelector(".content");
    //     questionsContainer.innerHTML = "";
    //
    //     questionsData.forEach((question, index) => {
    //         let questionHTML = `
    //             <div class="question" data-correct-answer="${question.correctAnswer}">
    //                 <p>${index + 1}. ${question.questionText}</p>
    //                 <div class="box">
    //                     <ul class="choices">
    //                         <li><input type="radio" name="q${question.id}" value="1"> ${question.choice1}</li>
    //                         <li><input type="radio" name="q${question.id}" value="2"> ${question.choice2}</li>
    //                         <li><input type="radio" name="q${question.id}" value="3"> ${question.choice3}</li>
    //                         <li><input type="radio" name="q${question.id}" value="4"> ${question.choice4}</li>
    //                     </ul>
    //                 </div>
    //             </div>
    //         `;
    //         questionsContainer.innerHTML += questionHTML;
    //     });
    // }
    //---------------------------------------------------------------------
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
    rules.style.textAlign = "center";
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
    // Generate question boxes dynamically
    // questions.forEach((question, index) => {
    //     const box = document.createElement("div");
    //     box.classList.add("question-box");
    //     box.textContent = index + 1;
    //     box.dataset.index = index;
    //     box.addEventListener("click", () => {
    //         question.scrollIntoView({ behavior: "smooth", block: "start" });
    //     });
    //     questionBoxContainer.appendChild(box);
    // });

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
        if (testSubmitted) return; // Prevent multiple submissions
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
        alert("You scored: " + score + " out of " + questions.length);

        // Mark the test as submitted and disable further submissions
        testSubmitted = true;
        submitButton.disabled = true;
    });



    window.addEventListener("scroll", () => {
        const offset = 20; // Space from top
        rightPanel.style.position = "fixed";
        rightPanel.style.top = `${offset}px`;
    });
    fetchAndRenderQuestions();

});
