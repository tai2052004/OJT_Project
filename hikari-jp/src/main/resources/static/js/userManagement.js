// === EDIT USER ===
const editUserModal = document.getElementById('editUserModal');
const editUserBtns = document.querySelectorAll('.edit-user');
const saveUserBtn = document.getElementById('saveUserBtn');

editUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-id');
        fetch(`/admin/edit-user/${userId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('editUserId').value = data.id;
                document.getElementById('editUsername').value = data.username;
                document.getElementById('editEmail').value = data.email;
                document.getElementById('editFullName').value = data.userDetail.fullName;
                document.getElementById('editPhone').value = data.userDetail.phoneNumber;
                document.getElementById('editBirthdate').value = data.userDetail.birthdate;
                document.getElementById('editRole').value = data.role;
                editUserModal.classList.add('active');
            })
            .catch(err => console.error('Fetch error:', err));
    });
});

saveUserBtn.addEventListener('click', () => {
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        id: userId,
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        role: document.getElementById('editRole').value,
        userDetail: {
            fullName: document.getElementById('editFullName').value,
            phoneNumber: document.getElementById('editPhone').value,
            birthdate: document.getElementById('editBirthdate').value
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
const resetPasswordBtns = document.querySelectorAll('.reset-password');
const resetPasswordModal = document.getElementById('resetPasswordModal');
const resetUserName = document.getElementById('resetUserName');
const newPassword = document.getElementById('newPassword');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const copyPasswordBtn = document.getElementById('copyPasswordBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');
let userToReset = null;

resetPasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-id');
        fetch(`/admin/edit-user/${userId}`)
            .then(response => response.json())
            .then(data => {
                resetUserName.textContent = data.userDetail.fullName;
                newPassword.value = '';
                userToReset = userId;
                resetPasswordModal.classList.add('active');
            })
            .catch(err => console.error('Fetch error:', err));
    });
});

generatePasswordBtn?.addEventListener('click', () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    newPassword.value = password;
});

copyPasswordBtn?.addEventListener('click', () => {
    if (newPassword.value) {
        navigator.clipboard.writeText(newPassword.value)
            .then(() => alert('Password copied to clipboard!'))
            .catch(err => console.error('Copy failed:', err));
    } else {
        alert('No password to copy!');
    }
});

confirmResetBtn?.addEventListener('click', () => {
    if (userToReset && newPassword.value) {
        fetch(`/admin/reset-password/${userToReset}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword: newPassword.value })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                resetPasswordModal.classList.remove('active');
            })
            .catch(error => {
                console.error('Error resetting password:', error);
                alert('Failed to reset password. Please try again.');
            });
    } else {
        alert('Please generate or enter a password first.');
    }
});

// === DELETE USER ===
const deleteUserBtns = document.querySelectorAll('.delete-user');
const deleteUserModal = document.getElementById('deleteUserModal');
const deleteUserName = document.getElementById('deleteUserName');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
let userToDelete = null;

deleteUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-id');
        fetch(`/admin/delete-user/${userId}`)
            .then(response => response.json())
            .then(data => {
                userToDelete = userId;
                deleteUserName.textContent = data.userDetail.fullName;
                deleteUserModal.classList.add('active');
            })
            .catch(err => console.error('Fetch error:', err));
    });
});

confirmDeleteBtn.addEventListener('click', () => {
    if (userToDelete) {
        fetch(`/admin/delete-user/${userToDelete}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    alert("User deleted successfully!");
                    deleteUserModal.classList.remove('active');
                    location.reload();
                } else {
                    alert("Failed to delete user.");
                }
            })
            .catch(err => console.error('Delete error:', err));
    }
});
