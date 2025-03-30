document.addEventListener("DOMContentLoaded", function () {
    const otpInputs = document.querySelectorAll(".otp-input input");
    const otpHiddenInput = document.getElementById("otpFull");

    // Chuyển focus tự động giữa các ô nhập OTP
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            updateHiddenOTP();
        });
    });

    function updateHiddenOTP() {
        otpHiddenInput.value = Array.from(otpInputs).map(i => i.value).join("");
        console.log("OTP Full:", otpHiddenInput.value); // Debug
    }
});

function resendOTP() {
    let email = document.querySelector(".email-display").textContent;

    fetch('/resend-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ email: email })
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            resetTimer();
        })
        .catch(error => console.error('Error:', error));
}

function resetTimer() {
    let timerElement = document.getElementById("timer");
    let resendButton = document.getElementById("resendButton");
    let timeLeft = 15;

    resendButton.disabled = true;

    let countdown = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            resendButton.disabled = false;
        }
    }, 1000);
}
