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


