/* ==========================================================
   app.js – SINGLE JS FILE FOR REGISTRATION & LOGIN
   Works on register.html AND login.html
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------------------------------------------
    // 1. Detect which page we are on
    // -----------------------------------------------------------------
    const isRegisterPage = !!document.getElementById('registerForm');
    const isLoginPage = !!document.getElementById('loginForm');

    // -----------------------------------------------------------------
    // 2. REGISTRATION LOGIC (register.html)
    // -----------------------------------------------------------------
    if (isRegisterPage) {
        const form = document.getElementById('registerForm');
        const roleStudent = document.getElementById('r1');
        const roleTutor = document.getElementById('r2');
        const studentNumberDiv = document.getElementById('studentNumberField');
        const studentNumberIn = document.getElementById('studentnumber');
        const fullnameIn = document.getElementById('fullname');
        const courseIn = document.getElementById('course');
        const yearIn = document.getElementById('year');
        const passwordIn = document.getElementById('password');
        const errorMsg = document.getElementById('errorMsg');

        // Toggle student number field
        const toggleStudentField = () => {
            if (roleStudent.checked) {
                studentNumberDiv.style.display = 'block';
                studentNumberIn.required = true;
                
            } else {
                studentNumberDiv.style.display = 'none';
                studentNumberIn.required = false;
                studentNumberIn.value = '';
            }
        };
        roleStudent.addEventListener('change', toggleStudentField);
        roleTutor.addEventListener('change', toggleStudentField);
        toggleStudentField();

        // Submit registration
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';

            const errors = [];
            if (!fullnameIn.value.trim()) errors.push('Full name is required');
            if (!courseIn.value.trim()) errors.push('Course is required');
            if (!yearIn.value.trim()) errors.push('Year is required');
            if (!passwordIn.value) errors.push('Password is required');
            if (roleStudent.checked && !studentNumberIn.value.trim())
                errors.push('Student number is required');

            if (errors.length) {
                showError(errors.join('<br>'));
                return;
            }

            const userData = {
                fullname: fullnameIn.value.trim(),
                role: roleStudent.checked ? 'Student' : 'Tutor',
                studentNumber: roleStudent.checked ? studentNumberIn.value.trim() : null,
                course: courseIn.value.trim(),
                year: yearIn.value.trim(),
                password: passwordIn.value,
                registeredAt: new Date().toISOString()
            };

            // Load existing users
            let users = JSON.parse(localStorage.getItem('users') || '[]');

            // Prevent duplicate
            if (users.some(u => u.fullname.toLowerCase() === userData.fullname.toLowerCase())) {
                showError('This name is already registered.');
                return;
            }

            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('latestUser', JSON.stringify(userData));

            alert('Registration successful! Redirecting...');
            window.location.href = 'dashboard.html';
        });

        function showError(msg) {
            errorMsg.innerHTML = msg;
            errorMsg.style.display = 'block';
        }
    }

    // -----------------------------------------------------------------
    // 3. LOGIN LOGIC (login.html)
    // -----------------------------------------------------------------
    if (isLoginPage) {
        const form = document.getElementById('loginForm');
        const usernameIn = document.getElementById('username');
        const passwordIn = document.getElementById('password');
        const errorMsg = document.getElementById('errorMsg');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';

            const username = usernameIn.value.trim();
            const password = passwordIn.value;

            if (!username || !password) {
                showError(' fill in both fields bitch.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.fullname.toLowerCase() === username.toLowerCase());

            if (!user) {
                showError('User not found. Please register first.');
                return;
            }

            if (user.password !== password) {
                showError('Incorrect password.');
                return;
            }

            // Login success
            localStorage.setItem('currentUser', JSON.stringify({
                fullname: user.fullname,
                role: user.role,
                course: user.course,
                year: user.year,
                studentNumber: user.studentNumber || 'N/A'
            }));

            window.location.href = 'dashboard.html';
        });

        function showError(msg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
        }
    }
});
