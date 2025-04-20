function showError(input, message) {
    const parent = input.closest('.profile-inf');
    const small = parent.querySelector("small")
    parent.classList.add("error")
    small.innerText = message
}

function showSuccess(input) {
    const parent = input.closest('.profile-inf');
    const small = parent.querySelector("small")
    parent.classList.remove("error")
    small.innerText = ""
}

function checkEmptyError(inputs) {
    let isEmptyError = false
    inputs.forEach((input) => {
        input.value = input.value.trim()
        if (!input.value) {
            showError(input, "Cannot be empty!")
            isEmptyError = true
        } else {
            showSuccess(input)
        }
    })
    return isEmptyError
}

function checkEmail(input) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    input.value = input.value.trim()

    if (!input.value) {
        showError(input, "Email is required")
        return true
    }

    if (!regexEmail.test(input.value)) {
        showError(input, "Invalid email format")
        return true
    }

    showSuccess(input)
    return false
}

function checkPhone(input) {
    const regexPhone = /^0[0-9]{9}$/
    input.value = input.value.trim()

    if (!input.value) {
        showError(input, "Phone is required")
        return true
    }

    if (!regexPhone.test(input.value)) {
        showError(input, "Phone must start with 0 and have 10 digits")
        return true
    }

    showSuccess(input)
    return false
}

function checkFullname(input) {
    const regexFullname = /^[a-zA-ZÀ-ỹ\s']+$/
    input.value = input.value.trim()

    if (!input.value) {
        showError(input, "Full name is required")
        return true
    }

    if (!regexFullname.test(input.value)) {
        showError(input, "Name can only contain letters and spaces")
        return true
    }

    showSuccess(input)
    return false
}

function checkBirthdate(input) {
    input.value = input.value.trim()
    const selectedDate = new Date(input.value)
    const today = new Date()

    if (!input.value) {
        showError(input, "Birthdate is required")
        return true
    }

    if (selectedDate >= today) {
        showError(input, "Birthdate must be in the past")
        return true
    }

    showSuccess(input)
    return false
}

document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get input elements
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const birthdateInput = document.getElementById('birthdate');

    // Validate inputs
    const isEmptyError = checkEmptyError([fullNameInput, phoneInput, birthdateInput]);
    const isFullNameError = checkFullname(fullNameInput);
    const isPhoneError = checkPhone(phoneInput);
    const isBirthDateError = checkBirthdate(birthdateInput);

    if (isFullNameError || isPhoneError || isBirthDateError) {
        return;
    }

    // If validation passes, submit the form
    this.submit();
});

document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử input file
    const avatarInput = document.getElementById('avatarInput');

    // Thêm sự kiện khi người dùng chọn tệp
    avatarInput.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Lấy tệp đầu tiên
        if (file) {
            const reader = new FileReader(); // Tạo FileReader để đọc tệp
            reader.onload = function(e) {
                const img = document.getElementById('profileImage'); // Lấy phần tử img
                img.src = e.target.result; // Cập nhật src của ảnh
            };
            reader.readAsDataURL(file); // Đọc tệp dưới dạng URL dữ liệu
        }
    });
});