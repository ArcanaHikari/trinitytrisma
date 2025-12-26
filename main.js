// --- 0. INISIALISASI ANIMASI (AOS) ---
        AOS.init({
            duration: 800, // Durasi animasi 0.8 detik
            once: true,    // Animasi cuma sekali saat scroll ke bawah
            offset: 100    // Jarak trigger animasi
        });

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

        // --- 2. FITUR KIRIM KE WHATSAPP ---
        const form = document.getElementById('registration-form');
        if(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Ambil data dari input
                const nama = document.getElementById('name').value;
                const kelas = document.getElementById('kelas').value;
                const minat = document.getElementById('interest').value;
                const alasan = document.getElementById('message').value;

                // Nomor WA Admin (Ganti dengan nomor aslimu, format 62...)
                const nomorWA = "6281805515828"; 

                // Format Pesan
                const text = `Halo Admin Trinity Trisma!%0A%0ASaya ingin mendaftar:%0ANama: ${nama}%0AKelas: ${kelas}%0AMinat: ${minat}%0AAlasan: ${alasan}%0A%0AMohon infonya lebih lanjut. Terima kasih!`;

                // Buka Link WA
                window.open(`https://wa.me/${nomorWA}?text=${text}`, '_blank');
            });
        }

        // --- 3. LOGIKA FAQ (AKORDEON) ---
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Tutup yang lain dulu (opsional, biar rapi)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                // Toggle yang diklik
                item.classList.toggle('active');
            });
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
    
    const finalScoreEl = document.getElementById('final-score');
    const msgEl = document.getElementById('result-message');
    
    let tempScore = 0;
    if(finalScoreEl) {
        // Skip animasi jika score 0 agar tidak infinite loop
        if (score === 0) {
            finalScoreEl.innerText = 0;
        } else {
            const scoreInterval = setInterval(() => {
                if(tempScore < score) {
                    tempScore++;
                    finalScoreEl.innerText = tempScore;
                } else {
                    finalScoreEl.innerText = score;
                    clearInterval(scoreInterval);
                }
            }, 20);
        }
    }

    if(msgEl) {
        if(score >= 80) msgEl.innerText = "Sempurna! Kamu siap ikut lomba! 🏆";
        else if(score >= 60) msgEl.innerText = "Bagus sekali! Tingkatkan lagi.";
        else msgEl.innerText = "Jangan menyerah, ayo belajar lagi!";
    }
}

