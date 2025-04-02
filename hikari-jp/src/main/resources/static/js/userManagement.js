document.querySelectorAll('.edit-user').forEach(btn => {
    btn.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');  // Lấy ID người dùng từ data-id

        // Gửi request đến backend để lấy thông tin người dùng
        fetch(`/admin/edit-user/${userId}`)
            .then(response => response.json())
            .then(data => {
                // Điền thông tin vào form trong modal
                document.getElementById('editUserId').value = data.id;
                document.getElementById('editUsername').value = data.username;
                document.getElementById('editEmail').value = data.email;
                document.getElementById('editFullName').value = data.userDetail.fullName;  // Chỉnh lại đây
                document.getElementById('editPhone').value = data.userDetail.phoneNumber;  // Chỉnh lại đây
                document.getElementById('editBirthdate').value = data.userDetail.birthdate;  // Chỉnh lại đây
                document.getElementById('editRole').value = data.role;
                // Hiển thị modal
                document.getElementById('editUserModal').classList.add('active');
            });
    });
});

document.getElementById('saveUserBtn').addEventListener('click', function() {
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        id: userId,
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        fullName: document.getElementById('editFullName').value,
        phoneNumber: document.getElementById('editPhone').value,
        role: document.getElementById('editRole').value,
        birthdate: document.getElementById('editBirthdate').value
    };

    // Gửi request POST tới backend để lưu thông tin người dùng đã cập nhật
    fetch(`/admin/save-user/${userId}`, {
        method: 'POST',  // Hoặc 'PUT' tùy vào API của bạn
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(data => {
            alert('User updated successfully!');
            // Đóng modal
            document.getElementById('editUserModal').classList.remove('active');
            // Cập nhật lại bảng dữ liệu
            location.reload();  // reload trang hoặc cập nhật lại hàng dữ liệu trong bảng
        })
        .catch(error => {
            console.error('Error updating user data:', error);
        });
});



// document.addEventListener('DOMContentLoaded', function() {
//     // User search functionality
//     const userSearch = document.getElementById('userSearch');
//     const usersTable = document.getElementById('usersTable');
//
//     if (userSearch && usersTable) {
//         userSearch.addEventListener('input', function() {
//             const searchTerm = this.value.toLowerCase();
//             const rows = usersTable.querySelectorAll('tbody tr');
//
//             rows.forEach(row => {
//                 const username = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
//                 const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
//                 const fullName = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
//                 const phone = row.querySelector('td:nth-child(7)').textContent;
//
//                 if (username.includes(searchTerm) ||
//                     email.includes(searchTerm) ||
//                     fullName.includes(searchTerm) ||
//                     phone.includes(searchTerm)) {
//                     row.style.display = '';
//                 } else {
//                     row.style.display = 'none';
//                 }
//             });
//         });
//     }
//
//     // Edit user functionality
//     const editUserBtns = document.querySelectorAll('.edit-user');
//     const editUserModal = document.getElementById('editUserModal');
//     const editUserForm = document.getElementById('editUserForm');
//     const editUserId = document.getElementById('editUserId');
//     const editUsername = document.getElementById('editUsername');
//     const editEmail = document.getElementById('editEmail');
//     const editFullName = document.getElementById('editFullName');
//     const editPhone = document.getElementById('editPhone');
//     const editBirthdate = document.getElementById('editBirthdate');
//     const editRole = document.getElementById('editRole');
//     const editPremium = document.getElementById('editPremium');
//     const saveUserBtn = document.getElementById('saveUserBtn');
//
//     // Mock user data for demonstration
//     const userData = {
//         1: {
//             id: 1,
//             username: 'dckontum',
//             email: 'dckontum@gmail.com',
//             full_name: 'Trần Ngọc Thiện',
//             phone_number: '0909123456',
//             birthdate: '2004-03-25',
//             role: 'user',
//             is_premium: false
//         },
//         2: {
//             id: 2,
//             username: 'johndoe',
//             email: 'john@example.com',
//             full_name: 'John Doe',
//             phone_number: '0901234567',
//             birthdate: '1990-05-15',
//             role: 'user',
//             is_premium: true
//         },
//         3: {
//             id: 3,
//             username: 'adminuser',
//             email: 'admin@example.com',
//             full_name: 'Admin User',
//             phone_number: '0912345678',
//             birthdate: '1985-10-20',
//             role: 'admin',
//             is_premium: true
//         }
//     };
//
//     editUserBtns.forEach(btn => {
//         btn.addEventListener('click', function() {
//             const userId = this.getAttribute('data-id');
//             const user = userData[userId];
//
//             if (user && editUserModal) {
//                 // Fill form with user data
//                 editUserId.value = user.id;
//                 editUsername.value = user.username;
//                 editEmail.value = user.email;
//                 editFullName.value = user.full_name;
//                 editPhone.value = user.phone_number;
//                 editBirthdate.value = user.birthdate;
//                 editRole.value = user.role;
//                 editPremium.checked = user.is_premium;
//
//                 // Show modal
//                 editUserModal.classList.add('active');
//             }
//         });
//     });
//
//     if (saveUserBtn) {
//         saveUserBtn.addEventListener('click', function() {
//             // Get form data
//             const userId = editUserId.value;
//             const updatedUser = {
//                 id: userId,
//                 username: editUsername.value,
//                 email: editEmail.value,
//                 full_name: editFullName.value,
//                 phone_number: editPhone.value,
//                 birthdate: editBirthdate.value,
//                 role: editRole.value,
//                 is_premium: editPremium.checked
//             };
//
//             // Update user data (in a real app, this would be an API call)
//             userData[userId] = updatedUser;
//             console.log('Updated user:', updatedUser);
//
//             // Close modal
//             editUserModal.classList.remove('active');
//
//             // In a real app, you would update the table row with new data
//             alert('User updated successfully!');
//         });
//     }
//
//     // Delete user functionality
//     const deleteUserBtns = document.querySelectorAll('.delete-user');
//     const deleteUserModal = document.getElementById('deleteUserModal');
//     const deleteUserName = document.getElementById('deleteUserName');
//     const deleteUserEmail = document.getElementById('deleteUserEmail');
//     const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
//     let userToDelete = null;
//
//     deleteUserBtns.forEach(btn => {
//         btn.addEventListener('click', function() {
//             const userId = this.getAttribute('data-id');
//             const user = userData[userId];
//
//             if (user && deleteUserModal) {
//                 userToDelete = userId;
//                 deleteUserName.textContent = user.username;
//                 deleteUserEmail.textContent = user.email;
//
//                 // Show modal
//                 deleteUserModal.classList.add('active');
//             }
//         });
//     });
//
//     if (confirmDeleteBtn) {
//         confirmDeleteBtn.addEventListener('click', function() {
//             if (userToDelete) {
//                 // Delete user (in a real app, this would be an API call)
//                 console.log('Deleting user:', userToDelete);
//
//                 // Close modal
//                 deleteUserModal.classList.remove('active');
//
//                 // In a real app, you would remove the table row
//                 alert('User deleted successfully!');
//             }
//         });
//     }
//
//     // Reset password functionality
//     const resetPasswordBtns = document.querySelectorAll('.reset-password');
//     const resetPasswordModal = document.getElementById('resetPasswordModal');
//     const resetUserName = document.getElementById('resetUserName');
//     const resetUserEmail = document.getElementById('resetUserEmail');
//     const newPassword = document.getElementById('newPassword');
//     const generatePasswordBtn = document.getElementById('generatePasswordBtn');
//     const copyPasswordBtn = document.getElementById('copyPasswordBtn');
//     const confirmResetBtn = document.getElementById('confirmResetBtn');
//     let userToReset = null;
//
//     resetPasswordBtns.forEach(btn => {
//         btn.addEventListener('click', function() {
//             const userId = this.getAttribute('data-id');
//             const user = userData[userId];
//
//             if (user && resetPasswordModal) {
//                 userToReset = userId;
//                 resetUserName.textContent = user.username;
//                 resetUserEmail.textContent = user.email;
//                 newPassword.value = '';
//
//                 // Show modal
//                 resetPasswordModal.classList.add('active');
//             }
//         });
//     });
//
//     if (generatePasswordBtn) {
//         generatePasswordBtn.addEventListener('click', function() {
//             // Generate random password
//             const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
//             let password = "";
//             for (let i = 0; i < 12; i++) {
//                 password += chars.charAt(Math.floor(Math.random() * chars.length));
//             }
//
//             newPassword.value = password;
//         });
//     }
//
//     if (copyPasswordBtn) {
//         copyPasswordBtn.addEventListener('click', function() {
//             if (newPassword.value) {
//                 // Copy to clipboard
//                 newPassword.select();
//                 document.execCommand('copy');
//
//                 // Visual feedback
//                 const originalIcon = this.innerHTML;
//                 this.innerHTML = '<span class="material-icons">check</span>';
//
//                 setTimeout(() => {
//                     this.innerHTML = originalIcon;
//                 }, 2000);
//             }
//         });
//     }
//
//     if (confirmResetBtn) {
//         confirmResetBtn.addEventListener('click', function() {
//             if (userToReset && newPassword.value) {
//                 // Reset password (in a real app, this would be an API call)
//                 console.log('Resetting password for user:', userToReset, 'New password:', newPassword.value);
//
//                 // Close modal
//                 resetPasswordModal.classList.remove('active');
//
//                 alert('Password reset successfully!');
//             } else if (!newPassword.value) {
//                 alert('Please generate or enter a password first.');
//             }
//         });
//     }
// });