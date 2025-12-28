// --- 0. INISIALISASI ANIMASI (AOS) ---
        const initAOS = () => {
            if (window.AOS && typeof AOS.init === 'function') {
                AOS.init({
                    duration: 800, // Durasi animasi 0.8 detik
                    once: true,    // Animasi cuma sekali saat scroll ke bawah
                    offset: 100    // Jarak trigger animasi
                });
            }
        };
        // Try init now; if the lib loads later, also init on load
        initAOS();
        window.addEventListener('load', initAOS);

        // --- 1. NAVIGASI MOBILE ---
        document.querySelector('.menu-toggle').addEventListener('click', function() {
            document.querySelector('nav ul').classList.toggle('active');
        });

        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    document.querySelector('nav ul').classList.remove('active');
                }
            });
        });

        // --- 3. LOGIKA FAQ (AKORDEON) with a11y ---
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            // Ensure accessible attributes exist
            if (question && answer) {
                // If answer doesn't have an id (added in HTML), give it a stable id
                if (!answer.id) answer.id = `faq-answer-${Math.random().toString(36).slice(2,8)}`;
                question.setAttribute('tabindex', '0');
                question.setAttribute('role', 'button');
                question.setAttribute('aria-controls', answer.id);
                question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

                const toggle = () => {
                    // Close others
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const q = otherItem.querySelector('.faq-question');
                            if (q) q.setAttribute('aria-expanded', 'false');
                        }
                    });
                    item.classList.toggle('active');
                    question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
                };

                question.addEventListener('click', toggle);
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle();
                    }
                });
            }
        });

// (Deduplicated) removed duplicate nav/form listeners — the primary handlers remain earlier in the file (e.g., WhatsApp form submit handler).

// --- 2. LOGIKA DARK MODE ---
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeBtn ? themeBtn.querySelector('i') : null;

if (themeBtn) {
    // Cek preferensi tersimpan
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            if(icon) icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            if(icon) icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// --- 3. LOGIKA TYPEWRITER EFFECT ---
const textElement = document.querySelector('.typewriter-text');
const words = ["Keluarga IT.", "Programmer Muda.", "Jagoan Logika.", "Trinity Trisma."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if(!textElement) return; // Mencegah error jika elemen tidak ada
    
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = 150;
    if (isDeleting) typeSpeed = 80;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        typeSpeed = 500;
        if (wordIndex === words.length) wordIndex = 0;
    }

    setTimeout(typeEffect, typeSpeed);
}
        
// Jalankan Typewriter saat load
document.addEventListener('DOMContentLoaded', typeEffect);

// --- 4. LOGIKA QUIZ ---
const questionBank = {
    easy: [
        { q: "Kode manakah yang benar untuk mencetak teks di Python?", o: ["echo 'Halo'", "print('Halo')", "System.out.println('Halo')", "Console.Log('Halo')"], a: 1 },
        { q: "Tipe data untuk menyimpan angka desimal (koma) adalah...", o: ["Integer", "String", "Float", "Boolean"], a: 2 },
        { q: "Simbol '==' dalam pemrograman digunakan untuk?", o: ["Membandingkan nilai", "Mengisi nilai variabel", "Komentar", "Logika AND"], a: 0 }
    ],
    medium: [
        { q: "Jika A = True dan B = False, maka hasil (A OR B) adalah...", o: ["False", "True", "Null", "Error"], a: 1 },
        { q: "Berapa hasil dari 10 % 3 (Modulus)?", o: ["3", "1", "3.33", "0"], a: 1 },
        { q: "Dalam array C++: int arr[5]. Indeks terakhir adalah?", o: ["5", "4", "6", "Tidak terbatas"], a: 1 }
    ],
    hard: [
        { q: "Apa kompleksitas waktu (Big O) dari Binary Search?", o: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], a: 2 },
        { q: "Output dari rekursif: f(3) jika f(n) = n * f(n-1) dan f(1)=1?", o: ["3", "6", "9", "4"], a: 1 },
        { q: "Struktur data 'LIFO' (Last In First Out) digunakan pada...", o: ["Queue", "Stack", "Array", "Linked List"], a: 1 }
    ]
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
const TIME_LIMIT = 15;

// Element Quiz
const startScreen = document.getElementById('quiz-start');
const questionScreen = document.getElementById('quiz-question');
const resultScreen = document.getElementById('quiz-result');
const questionText = document.getElementById('question-text');
const optionList = document.getElementById('option-list');
const questionCount = document.getElementById('question-count');
const levelBadge = document.getElementById('level-badge');
const timeDisplay = document.getElementById('time-left');
const timerBar = document.getElementById('timer-bar');
const timerBox = document.querySelector('.timer-box');

function showStartScreen() {
    if(questionScreen) questionScreen.classList.remove('active');
    if(resultScreen) resultScreen.classList.remove('active');
    if(startScreen) startScreen.classList.add('active');

    // Hide any lingering save button and clear handler when returning to start
    const saveBtn = document.getElementById('save-score-btn');
    if (saveBtn) {
        saveBtn.style.display = 'none';
        saveBtn.onclick = null;
    }
}

function startLevel(difficulty) {
    currentQuestions = questionBank[difficulty];
    
    if(levelBadge) {
        levelBadge.innerText = difficulty.toUpperCase();
        levelBadge.className = 'badge'; 
        levelBadge.classList.add(difficulty === 'easy' ? 'bg-success' : difficulty === 'medium' ? 'bg-warning' : 'bg-danger');
        if(difficulty === 'easy') levelBadge.style.backgroundColor = '#27ae60';
        else if(difficulty === 'medium') levelBadge.style.backgroundColor = '#f39c12';
        else levelBadge.style.backgroundColor = '#c0392b';
    }

    currentQuestionIndex = 0;
    score = 0;
    
    startScreen.classList.remove('active');
    questionScreen.classList.add('active');
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = TIME_LIMIT;
    updateTimerUI();
    startTimer();

    const q = currentQuestions[currentQuestionIndex];
    
    if(questionText) questionText.innerText = q.q;
    if(questionCount) questionCount.innerText = `Soal ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    
    if(optionList) {
        optionList.innerHTML = '';
        q.o.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.classList.add('option-btn');
            btn.onclick = () => checkAnswer(index, btn);
            optionList.appendChild(btn);
        });
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if(timeLeft <= 0) {
            clearInterval(timer);
            autoFail();
        }
    }, 1000);
}

function updateTimerUI() {
    if(timeDisplay) timeDisplay.innerText = timeLeft;
    if(timerBar) timerBar.style.width = (timeLeft / TIME_LIMIT) * 100 + '%';
    
    if(timeLeft <= 5) {
        if(timerBox) timerBox.classList.add('danger');
        if(timerBar) timerBar.style.backgroundColor = '#e74c3c';
    } else {
        if(timerBox) timerBox.classList.remove('danger');
        if(timerBar) timerBar.style.backgroundColor = '#1abc9c';
    }
}

function checkAnswer(selectedIndex, btnElement) {
    clearInterval(timer);
    const correctIndex = currentQuestions[currentQuestionIndex].a;
    const options = optionList.children;
    
    for(let btn of options) btn.classList.add('disabled');

    if(selectedIndex === correctIndex) {
        btnElement.classList.add('correct');
        score += 20;
    } else {
        btnElement.classList.add('wrong');
        options[correctIndex].classList.add('correct');
    }
    nextQuestionDelay();
}

function autoFail() {
    const correctIndex = currentQuestions[currentQuestionIndex].a;
    const options = optionList.children;
    for(let btn of options) btn.classList.add('disabled');
    options[correctIndex].classList.add('correct');
    nextQuestionDelay();
}

function nextQuestionDelay() {
    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');

    // Show final score
    const finalScoreEl = document.getElementById('final-score');
    if (finalScoreEl) finalScoreEl.innerText = score;

    const msgEl = document.getElementById('result-message');
    if (msgEl) {
        msgEl.innerHTML = '';
        msgEl.innerHTML += `<div>Skor Kamu: <strong>${score}</strong></div>`;

        if (score >= 80) msgEl.innerHTML += `<div>Sempurna! Kamu siap ikut lomba! 🏆</div>`;
        else if (score >= 60) msgEl.innerHTML += `<div>Bagus sekali! Tingkatkan lagi.</div>`;
        else msgEl.innerHTML += `<div>Jangan menyerah, ayo belajar lagi!</div>`;
    }

    // --- Leaderboard: persist top 5 scores in localStorage ---
    const leaderboardListEl = document.getElementById('leaderboard-list');
    const saveBtn = document.getElementById('save-score-btn');

    const getLeaderboard = () => {
        try {
            return JSON.parse(localStorage.getItem('trinityLeaderboard') || '[]');
        } catch (e) {
            console.warn('trinityLeaderboard parse error, clearing localStorage key', e);
            localStorage.removeItem('trinityLeaderboard');
            return [];
        }
    };
    const setLeaderboard = (arr) => localStorage.setItem('trinityLeaderboard', JSON.stringify(arr));

    const renderLeaderboard = () => {
        const list = getLeaderboard();
        if (!leaderboardListEl) return;
        leaderboardListEl.innerHTML = '';
        if (list.length === 0) {
            leaderboardListEl.innerHTML = '<li>Tidak ada skor tersimpan.</li>';
            return;
        }
        list.forEach(entry => {
            const li = document.createElement('li');
            li.innerText = `${entry.name} — ${entry.score} (${entry.date})`;
            leaderboardListEl.appendChild(li);
        });
    };

    // Check if current score qualifies to be saved
    const qualifies = () => {
        const list = getLeaderboard();
        if (list.length < 5) return true;
        return score > list[list.length - 1].score;
    };

    // Save score flow
    const saveScoreFlow = () => {
        const name = prompt('Simpan skor! Masukkan nama/inisial (max 20 karakter):', 'Anon');
        if (!name) return;
        const entry = { name: String(name).slice(0,20), score: score, date: new Date().toLocaleDateString() };
        const list = getLeaderboard();
        list.push(entry);
        list.sort((a,b) => b.score - a.score);
        const top = list.slice(0,5);
        setLeaderboard(top);
        renderLeaderboard();
        if (saveBtn) {
            saveBtn.style.display = 'none';
            saveBtn.onclick = null;
        }
        alert('Skor tersimpan di leaderboard!');
    };

    // Render existing leaderboard and show save button conditionally
    renderLeaderboard();
    if (score > 0 && qualifies()) {
        if (saveBtn) {
            saveBtn.style.display = 'inline-block';
            // Use assignment to avoid duplicate listeners when showResult runs multiple times
            saveBtn.onclick = saveScoreFlow;
        }
    } else {
        if (saveBtn) {
            saveBtn.style.display = 'none';
            saveBtn.onclick = null;
        }
    }
}

// Registration form: AJAX submission to Formspree (Accept: application/json), show in-page modal, and honeypot handling
const regForm = document.getElementById('registration-form');
if (regForm) {
    const statusEl = document.getElementById('form-status');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Use browser validity first
        if (!regForm.checkValidity()) {
            regForm.reportValidity();
            return;
        }

        const action = regForm.action;
        const submitBtn = regForm.querySelector('button[type="submit"]');

        // Disable submit while sending
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-disabled', 'true');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        }

        try {
            const formData = new FormData(regForm);

            // Honeypot check: if filled, treat as spam and silently succeed
            if (formData.get('_gotcha')) {
                if (statusEl) {
                    statusEl.className = 'form-status success';
                    statusEl.textContent = 'Pendaftaran berhasil — Terima kasih!';
                    statusEl.style.display = 'block';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-disabled');
                    submitBtn.innerHTML = 'Kirim Pendaftaran';
                }
                return;
            }

            const res = await fetch(action, {
                method: regForm.method || 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });

            const json = await res.json().catch(() => null);

            if (res.ok) {
                // Show success modal (stay on page)
                regForm.reset();
                if (modal) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                }
                if (statusEl) {
                    statusEl.className = 'form-status success';
                    statusEl.textContent = 'Pendaftaran berhasil — Terima kasih!';
                    statusEl.style.display = 'block';
                }

                // Optional: If server provides a full next, you may prefer redirect; (we prefer modal by default)
                // If you still want redirect, use: const redirectTarget = json && json.next ? new URL(json.next, location.origin).href : null;

                // If Firebase is available, refresh global leaderboard
                if (typeof loadGlobalLeaderboard === 'function') loadGlobalLeaderboard();
            } else {
                const msg = (json && json.error) ? json.error : 'Oops! Ada masalah saat mengirim form.';
                if (statusEl) {
                    statusEl.className = 'form-status error';
                    statusEl.textContent = msg;
                    statusEl.style.display = 'block';
                } else {
                    alert(msg);
                }
            }
        } catch (err) {
            console.error('Registration submit failed', err);
            if (statusEl) {
                statusEl.className = 'form-status error';
                statusEl.textContent = 'Tidak dapat mengirim (koneksi). Coba lagi.';
                statusEl.style.display = 'block';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.removeAttribute('aria-disabled');
                submitBtn.innerHTML = 'Kirim Pendaftaran';
            }
        }
    });

    // Modal close handler
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// --- Firebase (optional) - init and leaderboard helpers ---
// Paste config from Firebase console; we guard initialization so site still works without it.
const firebaseConfig = {
  apiKey: "AIzaSyAePSJN0D_beXx2Xx4ywnKmnI4NO67rdRY",
  authDomain: "trinitytrisma.firebaseapp.com",
  projectId: "trinitytrisma",
  storageBucket: "trinitytrisma.firebasestorage.app",
  messagingSenderId: "782129818220",
  appId: "1:782129818220:web:30d4272eedba4b79438649",
  measurementId: "G-D0XP1KTCT3"
};

let db = null;
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('Firebase initialized');
    } catch (e) {
        console.warn('Firebase init error', e);
        db = null;
    }
}

// Load top 5 global leaderboard (Firestore)
async function loadGlobalLeaderboard() {
    const listEl = document.getElementById('global-leaderboard-list');
    if (!listEl) return;
    if (!db) {
        listEl.innerHTML = '<li>Global leaderboard belum tersedia.</li>';
        return;
    }

    listEl.innerHTML = '<li>Loading...</li>';
    try {
        const snap = await db.collection('leaderboard').orderBy('score', 'desc').limit(5).get();
        if (snap.empty) {
            listEl.innerHTML = '<li>Belum ada data...</li>';
            return;
        }
        listEl.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `<span>${d.name || 'Anon'}</span> — <strong>${d.score}</strong>`;
            listEl.appendChild(li);
        });
    } catch (err) {
        console.error('loadGlobalLeaderboard error', err);
        listEl.innerHTML = '<li>Gagal memuat data leaderboard.</li>';
    }
}

// Hook refresh button
const refreshGlobalBtn = document.getElementById('refresh-global-leaderboard');
if (refreshGlobalBtn) refreshGlobalBtn.addEventListener('click', loadGlobalLeaderboard);
// Auto-load on init if Firestore is available
if (db) loadGlobalLeaderboard();

// Back-to-top button: guard and use event listeners (avoid overwriting global onscroll)
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    const updateBackToTop = () => {
        if (window.scrollY > 300) backToTop.style.display = 'block';
        else backToTop.style.display = 'none';
    };

    // Initialize and listen for scroll changes
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('load', updateBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}