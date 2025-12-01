/* ==========================================================
   app.js – SINGLE JS FILE FOR REGISTRATION, LOGIN & AUTOPLAY
   Works on register.html AND login.html
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------------------------------------------
    // 0. AUTOPLAY SOUND ON PAGE LOAD
    // -----------------------------------------------------------------
    const playWelcomeSound = () => {
        const audio = new Audio('sounds/intro.m4a'); // Put your file in /sounds/
        audio.volume = 0.5;          // 50% volume – adjust as needed
        audio.loop = false;

        // Browsers block autoplay with sound → start muted, then unmute
        audio.muted = true;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Successfully started (muted)
                    setTimeout(() => { audio.muted = false; }, 100);
                    console.log('Welcome sound playing');
                })
                .catch(() => {
                    // Autoplay blocked → show fallback button
                    showPlayButton(audio);
                });
        }
    };

    const showPlayButton = (audio) => {
        const btn = document.createElement('button');
        btn.textContent = 'Play Welcome Sound';
        btn.style.cssText = `
            position:fixed; bottom:20px; right:20px;
            padding:12px 20px; font-size:16px; z-index:9999;
            background:#007bff; color:#fff; border:none; border-radius:6px;
            cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.2);
        `;
        btn.onclick = () => {
            audio.muted = false;
            audio.play().then(() => btn.remove());
        };
        document.body.appendChild(btn);
    };

    // Try to play sound immediately
    playWelcomeSound();

    // -----------------------------------------------------------------
    // 1. Detect which page we are on
    // -----------------------------------------------------------------
    const isRegisterPage = !!document.getElementById('registerForm');
    const isLoginPage    = !!document.getElementById('loginForm');

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
                showError('Please fill in both fields.');
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