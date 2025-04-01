document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".question");
    const questionBoxContainer = document.querySelector(".question-boxes");
    const rightPanel = document.querySelector(".right-panel");
    const progressBar = document.querySelector(".progress-bar");
    let answeredCount = 0;
    let hasBlurred = false;

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
    rules.innerHTML = "<li>Stay in fullscreen mode.</li><li>Do not switch tabs or apps.</li><li>Complete the test without interruptions.</li>";

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
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            overlay.style.display = "flex";
            message.textContent = "You must stay in fullscreen mode to continue the test!";
            startButton.textContent = "Continue";
        }
    }

    startButton.addEventListener("click", () => {
        enableFullscreen();
        overlay.style.display = "none";
    });

    document.addEventListener("fullscreenchange", preventFullscreenExit);
    document.addEventListener("mozfullscreenchange", preventFullscreenExit);
    document.addEventListener("webkitfullscreenchange", preventFullscreenExit);
    document.addEventListener("MSFullscreenChange", preventFullscreenExit);

    // Detect tab/app switch
    function detectTabSwitch() {
        if (document.hidden || document.visibilityState === "hidden") {
            alert("You have violated the test rules! Redirecting in 5 seconds...");
            setTimeout(() => {
                window.location.href = "/backToHome";
            }, 5000);
        }
    }

    function detectWindowBlur() {
        setTimeout(() => {
            if (!document.hasFocus()) {
                alert("You have violated the test rules! Redirecting in 5 seconds...");
                setTimeout(() => {
                    window.location.href = "/backToHome";
                }, 5000);
            }
        }, 200);
    }

    document.addEventListener("visibilitychange", detectTabSwitch);
    window.addEventListener("blur", detectWindowBlur);

    // Generate question boxes dynamically
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

    // Update progress bar and question box color
    function updateProgress() {
        const totalQuestions = questions.length;
        const progress = (answeredCount / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Track answer selection
    questions.forEach((question, index) => {
        const boxDiv = question.querySelector(".box");
        const inputs = question.querySelectorAll("input[type='radio']");
        const box = document.querySelector(`.question-boxes .question-box:nth-child(${index + 1})`);

        // Create unselect button
        const unselectButton = document.createElement("button");
        unselectButton.textContent = "Unselect";
        unselectButton.style.background = "transparent";
        unselectButton.style.border = "1px solid gray";
        unselectButton.style.padding = "5px";
        unselectButton.style.cursor = "pointer";
        unselectButton.style.display = "none"; // Initially hidden
        unselectButton.addEventListener("click", () => {
            inputs.forEach(input => input.checked = false);
            if (box.classList.contains("answered")) {
                answeredCount--;
                box.classList.remove("answered");
                box.style.backgroundColor = "";
            }
            unselectButton.style.display = "none"; // Hide after unselecting
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
                unselectButton.style.display = "block"; // Show unselect button after selection
                updateProgress();
            });
        });
    });

    // Make right panel follow scrolling
    window.addEventListener("scroll", () => {
        const offset = 20; // Space from top
        rightPanel.style.position = "fixed";
        rightPanel.style.top = `${offset}px`;
    });
});
