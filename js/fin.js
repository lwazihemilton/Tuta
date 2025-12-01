// js/fin.js – FINAL SINGLE SCRIPT – Runs on every page
feather.replace();

// Premium Mode Toggle
function togglePremium() {
  document.body.classList.toggle('premium-mode');
  const text = document.getElementById('modeText');
  const icon = document.getElementById('modeIcon');
  if (document.body.classList.contains('premium-mode')) {
    text.textContent = 'Premium Mode';
    icon.setAttribute('data-feather', 'moon');
  } else {
    text.textContent = 'Standard Mode';
    icon.setAttribute('data-feather', 'sun');
  }
  feather.replace();
}

// Logout
function logout() {
  if (confirm('Log out of Tuts?')) {
    localStorage.clear();
    location.href = 'index.html';
  }
}

// Page Protection + User Name
(function() {
  const publicPages = ['index.html', 'login.html', 'register-student.html', 'register-tutor.html', 'verify-email.html', 'terms.html'];
  const current = location.pathname.split('/').pop() || 'index.html';

  if (!publicPages.includes(current) && !localStorage.getItem('tuts_token')) {
    alert('Please log in first');
    location.href = 'index.html';
  }

  const nameEl = document.getElementById('userName');
  if (nameEl) {
    const user = JSON.parse(localStorage.getItem('tuts_user') || '{}');
    nameEl.textContent = user.name ? user.name.split(' ')[0] : 'Friend';
  }
})();

// AI Tutor Chat (only on ai-tutor.html)
if (document.getElementById('chat') && document.getElementById('aiQuery')) {
  const chat = document.getElementById('chat');
  const input = document.getElementById('aiQuery');

  input.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

  window.sendMessage = function() {
    const q = input.value.trim();
    if (!q) return;

    chat.innerHTML += `<div class="message user">${q}<div class="timestamp">Just now</div></div>`;
    chat.innerHTML += `<div class="typing" id="typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      document.getElementById('typing')?.remove();
      const replies = [
        "Perfect! Here's the full step-by-step solution → x = [-b ± √(b²-4ac)]/2a",
        "You're crushing it! Want 5 practice questions?",
        "Great question! Let me explain with a diagram...",
        "That’s correct! You're ready for your test!",
        "Here’s a video explanation → youtu.be/example"
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      chat.innerHTML += `<div class="message ai">${reply}<div class="timestamp">Just now</div></div>`;
      chat.scrollTop = chat.scrollHeight;
    }, 1200 + Math.random() * 1200);

    input.value = '';
  };
}