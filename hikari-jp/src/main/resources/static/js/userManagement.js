// === SEARCH FUNCTIONALITY ===
const userSearchInput = document.getElementById("userSearch")
const usersTable = document.getElementById("usersTable")

userSearchInput?.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const rows = usersTable.querySelectorAll("tbody tr")

    rows.forEach((row) => {
        const username = row.cells[1].textContent.toLowerCase()
        const email = row.cells[2].textContent.toLowerCase()
        const role = row.cells[3].textContent.toLowerCase()
        const fullName = row.cells[4].textContent.toLowerCase()
        const phone = row.cells[5].textContent.toLowerCase()

        if (
            username.includes(searchTerm) ||
            email.includes(searchTerm) ||
            role.includes(searchTerm) ||
            fullName.includes(searchTerm) ||
            phone.includes(searchTerm)
        ) {
            row.style.display = ""
        } else {
            row.style.display = "none"
        }
    })
})

// === EDIT USER ===
const editUserModal = document.getElementById("editUserModal")
const editUserBtns = document.querySelectorAll(".edit-user")
const saveUserBtn = document.getElementById("saveUserBtn")
const editAvatarInput = document.getElementById("editAvatar")
const editAvatarPreview = document.getElementById("editAvatarPreview")

editUserBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-id")
        fetch(`/admin/edit-user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("editUserId").value = data.id
                document.getElementById("editUsername").value = data.username
                document.getElementById("editEmail").value = data.email
                document.getElementById("editFullName").value = data.userDetail.fullName
                document.getElementById("editPhone").value = data.userDetail.phoneNumber
                document.getElementById("editBirthdate").value = data.userDetail.birthdate
                document.getElementById("editRole").value = data.role.toLowerCase()
                editUserModal.classList.add("active")
            })
            .catch((err) => console.error("Fetch error:", err))
    })
})

// Avatar preview for edit user
if (editAvatarInput) {
    editAvatarInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const avatarImg = editAvatarPreview.querySelector("img")
                avatarImg.src = e.target.result
            }
            reader.readAsDataURL(this.files[0])
        }
    })
}

function showError(input, message) {
    const parent = input.closest('.form-group');
    const small = parent.querySelector("small")
    parent.classList.add("error")
    small.innerText = message
}

function showSuccess(input) {
    const parent = input.closest('.form-group');
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

saveUserBtn.addEventListener("click", () => {
    // Lấy các input elements
    const usernameInput = document.getElementById("editUsername")
    const emailInput = document.getElementById("editEmail")
    const fullNameInput = document.getElementById("editFullName")
    const phoneInput = document.getElementById("editPhone")
    const birthdateInput = document.getElementById("editBirthdate")

    // Validate
    const isEmptyError = checkEmptyError([usernameInput, emailInput, fullNameInput, phoneInput, birthdateInput])
    const isEmailError = checkEmail(emailInput)
    const isFullNameError = checkFullname(fullNameInput)
    const isPhoneError = checkPhone(phoneInput)
    const isBirthDateError = checkBirthdate(birthdateInput)

    if (isEmptyError || isEmailError || isFullNameError || isPhoneError || isBirthDateError) {
        return
    }

    // Create form data for file upload
    const userId = document.getElementById("editUserId").value

    // Add user data
    const updatedUser = {
        id: userId,
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        role: document.getElementById('editRole').value,
        userDetail: {
            fullName: fullNameInput.value.trim(),
            phoneNumber: phoneInput.value.trim(),
            birthdate: birthdateInput.value.trim()
        }
    };


    fetch(`/admin/save-user/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(() => {
            alert('User updated successfully!');
            editUserModal.classList.remove('active');
            location.reload();
        })
        .catch(error => console.error('Error updating user:', error));
});


// === RESET PASSWORD ===
const resetPasswordBtns = document.querySelectorAll(".reset-password")
const resetPasswordModal = document.getElementById("resetPasswordModal")
const resetUserName = document.getElementById("resetUserName")
const newPassword = document.getElementById("newPassword")
const generatePasswordBtn = document.getElementById("generatePasswordBtn")
const copyPasswordBtn = document.getElementById("copyPasswordBtn")
const confirmResetBtn = document.getElementById("confirmResetBtn")
let userToReset = null

resetPasswordBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-id")
        fetch(`/admin/edit-user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                resetUserName.textContent = data.userDetail.fullName
                newPassword.value = ""
                userToReset = userId
                resetPasswordModal.classList.add("active")
            })
            .catch((err) => console.error("Fetch error:", err))
    })
})

generatePasswordBtn?.addEventListener("click", () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    newPassword.value = password
})

copyPasswordBtn?.addEventListener("click", () => {
    if (newPassword.value) {
        navigator.clipboard
            .writeText(newPassword.value)
            .then(() => alert("Password copied to clipboard!"))
            .catch((err) => console.error("Copy failed:", err))
    } else {
        alert("No password to copy!")
    }
})

confirmResetBtn?.addEventListener("click", () => {
    if (userToReset && newPassword.value) {
        fetch(`/admin/reset-password/${userToReset}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword: newPassword.value }),
        })
            .then((response) => response.text())
            .then((data) => {
                alert(data)
                resetPasswordModal.classList.remove("active")
            })
            .catch((error) => {
                console.error("Error resetting password:", error)
                alert("Failed to reset password. Please try again.")
            })
    } else {
        alert("Please generate or enter a password first.")
    }
})

// === DELETE USER ===
const deleteUserBtns = document.querySelectorAll(".delete-user")
const deleteUserModal = document.getElementById("deleteUserModal")
const deleteUserName = document.getElementById("deleteUserName")
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
let userToDelete = null

deleteUserBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-id")
        fetch(`/admin/delete-user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                userToDelete = userId
                deleteUserName.textContent = data.userDetail.fullName
                deleteUserModal.classList.add("active")
            })
            .catch((err) => console.error("Fetch error:", err))
    })
})

confirmDeleteBtn.addEventListener("click", () => {
    if (userToDelete) {
        fetch(`/admin/delete-user/${userToDelete}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(text || "Failed to delete user")
                    })
                }
                return response.text()
            })
            .then(() => {
                alert("User deleted successfully!")
                deleteUserModal.classList.remove("active")
                location.reload()
            })
            .catch((err) => {
                alert(err.message)
                console.error("Delete error:", err)
            })
    }
})

// === ADD USER ===
const addUserBtn = document.querySelector(".btn-primary")
const addUserModal = document.getElementById("addUserModal")
const confirmAddBtn = document.getElementById("confirmAddBtn")
const addAvatarInput = document.getElementById("addAvatar")
const addAvatarPreview = document.getElementById("addAvatarPreview")

// Show add user modal
addUserBtn.addEventListener("click", () => {
    document.getElementById("addUserForm").reset()
    const avatarImg = addAvatarPreview.querySelector("img")
    avatarImg.src = "/images/profile-image.png"
    addUserModal.classList.add("active")
})

// Avatar preview for add user
if (addAvatarInput) {
    addAvatarInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const avatarImg = addAvatarPreview.querySelector("img")
                avatarImg.src = e.target.result
            }
            reader.readAsDataURL(this.files[0])
        }
    })
}

// Toggle password visibility
const togglePasswordBtns = document.querySelectorAll(".toggle-password")
togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        const input = this.previousElementSibling
        const icon = this.querySelector(".material-icons")

        if (input.type === "password") {
            input.type = "text"
            icon.textContent = "visibility_off"
        } else {
            input.type = "password"
            icon.textContent = "visibility"
        }
    })
})

function checkPassword(input) {
    input.value = input.value.trim()

    if (!input.value) {
        showError(input, "Password is required")
        return true
    }

    if (input.value.length < 8) {
        showError(input, "Password must be at least 8 characters")
        return true
    }

    showSuccess(input)
    return false
}

function checkPasswordMatch(password, confirmPassword) {
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, "Passwords do not match")
        return true
    }

    showSuccess(confirmPassword)
    return false
}


confirmAddBtn.addEventListener("click", () => {
    // Get form inputs
    const usernameInput = document.getElementById("addUsername")
    const emailInput = document.getElementById("addEmail")
    const passwordInput = document.getElementById("addPassword")
    const confirmPasswordInput = document.getElementById("addConfirmPassword")
    const fullNameInput = document.getElementById("addFullName")
    const phoneInput = document.getElementById("addPhone")
    const birthdateInput = document.getElementById("addBirthdate")
    const roleInput = document.getElementById("addRole")
    const avatarInput = document.getElementById("addAvatar")

    // Validate inputs
    const isEmptyError = checkEmptyError([usernameInput, emailInput, passwordInput, confirmPasswordInput, fullNameInput, phoneInput, birthdateInput, roleInput,])

    const isEmailError = checkEmail(emailInput)
    const isPasswordError = checkPassword(passwordInput)
    const isPasswordMatchError = checkPasswordMatch(passwordInput, confirmPasswordInput)
    const isFullNameError = checkFullname(fullNameInput)
    const isPhoneError = checkPhone(phoneInput)
    const isBirthdateError = checkBirthdate(birthdateInput)

    if (isEmptyError || isEmailError || isPasswordError || isPasswordMatchError || isFullNameError || isPhoneError || isBirthdateError) {
        return
    }

    // Create form data
    const formData = new FormData()

    // Add user data
    const userData = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        role: roleInput.value,
        userDetail: {
            fullName: fullNameInput.value.trim(),
            phoneNumber: phoneInput.value.trim(),
            birthdate: birthdateInput.value.trim(),
        },
    }

    formData.append("userData", JSON.stringify(userData))

    // Add avatar if selected
    if (avatarInput.files.length > 0) {
        formData.append("avatar", avatarInput.files[0])
    }

    // Submit form
    fetch("/admin/add-user", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(text || "Failed to add user")
                })
            }
            return response.json()
        })
        .then(() => {
            alert("User added successfully!")
            addUserModal.classList.remove("active")
            location.reload()
        })
        .catch((error) => {
            alert(error.message)
            console.error("Error adding user:", error)
        })
})
