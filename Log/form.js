const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const avatarUpload = document.getElementById('avatarUpload');

document.addEventListener('DOMContentLoaded', () => {
    // Toggle forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Handle registration
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const avatarFile = avatarUpload.files[0];

        if (localStorage.getItem(username)) {
            alert('Username already exists!');
            return;
        }

        if (!avatarFile) {
            alert('Please upload an avatar!');
            return;
        }

        // Convert image to base64
        const reader = new FileReader();
        reader.onload = function (event) {
            const avatarBase64 = event.target.result;

            // Save user data to localStorage
            localStorage.setItem(username, JSON.stringify({
                password: password,
                avatar: avatarBase64
            }));

            alert('Registration successful!');
            registerForm.reset();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        };
        reader.readAsDataURL(avatarFile);
    });

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = JSON.parse(localStorage.getItem(username));

        if (!user) {
            alert('User not found!');
            return;
        }

        if (user.password === password) {
            sessionStorage.setItem('currentUser', username);
            window.location.href = '../Loading/loading.html';
        } else {
            alert('Wrong password!');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling; // Lấy trường nhập mật khẩu
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Đổi icon
            button.classList.toggle('bx-hide');
            button.classList.toggle('bx-show');
        });
    });

    // Các phần xử lý đăng ký/đăng nhập khác
    // ...
});

//Yêu cầu ảnh avatar
avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
        alert('File size must be less than 2MB.');
        e.target.value = ''; // Clear the file input
    }
});


// Thêm các biến mới
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const showForgotPassword = document.getElementById('showForgotPassword');
const showLoginFromForgot = document.getElementById('showLoginFromForgot');

// Trong DOMContentLoaded
showForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
});

showLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Xử lý reset password
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('forgotUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    
    const userData = JSON.parse(localStorage.getItem(username));
    
    if (!userData) {
        alert('Username not found!');
        return;
    }
    
    userData.password = newPassword;
    localStorage.setItem(username, JSON.stringify(userData));
    alert('Password reset successfully!');
    forgotPasswordForm.reset();
    forgotPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
});