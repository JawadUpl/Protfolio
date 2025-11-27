// ==========================================
// GAMER PIXELATED PORTFOLIO - ARCADE JS
// ==========================================

// ==========================================
// PIXEL CURSOR
// ==========================================
const pixelCursor = document.querySelector('.pixel-cursor');
const cursorTrail = document.querySelector('.cursor-trail');

let mouseX = 0;
let mouseY = 0;
let trailX = 0;
let trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Snap to pixel grid
    mouseX = Math.floor(mouseX / 4) * 4;
    mouseY = Math.floor(mouseY / 4) * 4;
});

function animateCursor() {
    // Trail follows with delay
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;

    trailX = Math.floor(trailX / 4) * 4;
    trailY = Math.floor(trailY / 4) * 4;

    pixelCursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// ==========================================
// ARCADE LOADING SCREEN
// ==========================================
const loadingScreen = document.getElementById('loading-screen');
const loadingFill = document.getElementById('loading-fill');
const mainContent = document.getElementById('main-content');

let loadProgress = 0;
const loadSpeed = 2;

const loadInterval = setInterval(() => {
    loadProgress += loadSpeed + Math.random() * 3;

    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        setTimeout(startGame, 500);
    }

    loadingFill.style.width = loadProgress + '%';
}, 100);

function startGame() {
    playSound('start');
    loadingScreen.classList.add('hidden');
    mainContent.classList.add('visible');
    initPixelBackground();
    startScoreCounter();
}

// ==========================================
// PIXEL BACKGROUND ANIMATION
// ==========================================
const canvas = document.getElementById('pixel-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pixels = [];
const pixelSize = 8;
const pixelCount = 50;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class PixelStar {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = pixelSize;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;

        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(
            Math.floor(this.x / pixelSize) * pixelSize,
            Math.floor(this.y / pixelSize) * pixelSize,
            this.size,
            this.size
        );
        ctx.globalAlpha = 1;
    }
}

function initPixelBackground() {
    for (let i = 0; i < pixelCount; i++) {
        pixels.push(new PixelStar());
    }
    animatePixels();
}

function animatePixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pixels.forEach(pixel => {
        pixel.update();
        pixel.draw();
    });

    requestAnimationFrame(animatePixels);
}

// ==========================================
// TYPING EFFECT
// ==========================================
const typedTextElement = document.getElementById('typed-text');

// Dynamic text array based on screen size
function getTextArray() {
    return window.innerWidth <= 768 ? [
        'STUDENT',
        'DEVELOPER',
        'GAME.DEV',
        'ILLUSTRATOR',
        'CODER'
    ] : [
        'STUDENT.DEVELOPER',
        'ASPIRING.GAME.DEV',
        'MULTIMEDIA.ILLUSTRATOR',
        'PASSIONATE.LEARNER',
        'CREATIVE.CODER'
    ];
}

let textArray = getTextArray();

window.addEventListener('resize', () => {
    textArray = getTextArray();
});

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentText = textArray[textIndex % textArray.length];

    if (!isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause
        } else {
            typingSpeed = 100;
        }
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            playSound('blip');
            typingSpeed = 500;
        } else {
            typingSpeed = 50;
        }
    }

    setTimeout(typeEffect, typingSpeed);
}

setTimeout(() => {
    if (typedTextElement) typeEffect();
}, 3000);

// ==========================================
// SCORE COUNTER
// ==========================================
const scoreElement = document.getElementById('score');
let score = 0;

function startScoreCounter() {
    setInterval(() => {
        score += Math.floor(Math.random() * 100) + 10;
        updateScore();
    }, 2000);
}

function updateScore() {
    scoreElement.textContent = score.toString().padStart(6, '0');
}

// Add score for interactions
function addScore(points) {
    score += points;
    updateScore();
    playSound('coin');
}

// ==========================================
// NAVIGATION
// ==========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('select');

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            addScore(50);
        }
    });
});

// Active section detection
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ==========================================
// BUTTONS
// ==========================================
const startGameBtn = document.getElementById('start-game');

startGameBtn.addEventListener('click', () => {
    playSound('start');
    addScore(100);

    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// ==========================================
// POWER-UPS
// ==========================================
const powerUps = document.querySelectorAll('.power-up');

powerUps.forEach(powerUp => {
    powerUp.addEventListener('click', function () {
        playSound('powerup');
        addScore(200);

        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);

        // Create floating score text
        createFloatingText('+200', this);
    });
});

function createFloatingText(text, element) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.cssText = `
        position: fixed;
        font-family: 'Press Start 2P', cursive;
        font-size: 1.5rem;
        color: #ffff00;
        text-shadow: 0 0 10px #ffff00;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 1s ease-out forwards;
    `;

    const rect = element.getBoundingClientRect();
    floatingText.style.left = rect.left + rect.width / 2 + 'px';
    floatingText.style.top = rect.top + 'px';

    document.body.appendChild(floatingText);

    setTimeout(() => {
        floatingText.remove();
    }, 1000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// LEVEL CARDS
// ==========================================
const levelCards = document.querySelectorAll('.level-card');
const levelBtns = document.querySelectorAll('.level-btn');

levelCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        playSound('hover');
    });
});

levelBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        playSound('select');
        addScore(150);

        const card = this.closest('.level-card');
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = '';
        }, 10);

        // Show "Coming Soon" message
        showNotification('LEVEL LOCKED - COMING SOON!');
    });
});

// ==========================================
// CONTACT ITEMS
// ==========================================
const contactItems = document.querySelectorAll('.contact-item');

contactItems.forEach(item => {
    item.addEventListener('click', function (e) {
        playSound('select');
        addScore(100);
    });
});

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playSound('select');

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (name && email && message) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.querySelector('span:last-child').textContent;
        submitBtn.querySelector('span:last-child').textContent = 'SENDING...';
        submitBtn.disabled = true;

        // Check if emailjs is defined
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS SDK not loaded');
            showNotification('SYSTEM ERROR: EMAIL SERVICE OFFLINE');
            submitBtn.querySelector('span:last-child').textContent = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        // Explicitly pass public key as 4th argument
        emailjs.sendForm('service_jygrtxw', 'template_9awwxv5', contactForm, '2U-MtyAtRw9ecupt4')
            .then(() => {
                playSound('success');
                showNotification(`MESSAGE SENT SUCCESSFULLY!\n\nTHANK YOU, ${name.toUpperCase()}!\nI'LL REPLY SOON!`);
                contactForm.reset();
                addScore(500);
            })
            .catch((error) => {
                console.error('FAILED...', error);
                playSound('blip'); // Error sound
                showNotification(`FAILED TO SEND MESSAGE.\nERROR: ${JSON.stringify(error)}`);
            })
            .finally(() => {
                submitBtn.querySelector('span:last-child').textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    }
});

// ==========================================
// NOTIFICATIONS
// ==========================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #0a0014;
        border: 4px solid #00ffff;
        padding: 3rem;
        font-family: 'Press Start 2P', cursive;
        font-size: 1rem;
        color: #00ffff;
        text-shadow: 0 0 10px #00ffff;
        z-index: 10001;
        text-align: center;
        box-shadow: 0 0 50px #00ffff;
        white-space: pre-line;
        line-height: 2;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2500);
}

// Add fadeOut animation
style.textContent += `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;

// ==========================================
// SOCIAL BUTTONS
// ==========================================
const socialBtns = document.querySelectorAll('.social-btn');

socialBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        playSound('select');
        addScore(50);
    });
});

// ==========================================
// TAGS
// ==========================================
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
    tag.addEventListener('click', function () {
        playSound('blip');
        addScore(25);
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            playSound('appear');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

const animatedElements = document.querySelectorAll('.character-card, .stats-panel, .level-card, .contact-info, .message-console');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==========================================
// SOUND EFFECTS (8-BIT STYLE)
// ==========================================
const audioContext = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

function playSound(type) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    let frequency = 440;
    let duration = 0.1;

    switch (type) {
        case 'blip':
            frequency = 800;
            duration = 0.05;
            break;
        case 'select':
            frequency = 600;
            duration = 0.1;
            break;
        case 'start':
            frequency = 400;
            duration = 0.3;
            break;
        case 'coin':
            frequency = 1000;
            duration = 0.15;
            break;
        case 'powerup':
            frequency = 1200;
            duration = 0.2;
            break;
        case 'success':
            frequency = 800;
            duration = 0.3;
            break;
        case 'hover':
            frequency = 500;
            duration = 0.05;
            break;
        case 'appear':
            frequency = 300;
            duration = 0.1;
            break;
    }

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'square'; // 8-bit sound

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// ==========================================
// KEYBOARD SHORTCUTS (GAMER STYLE)
// ==========================================
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
            playSound('blip');
            break;
        case 'ArrowDown':
            e.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
            playSound('blip');
            break;
        case 'Enter':
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                playSound('select');
                addScore(10);
            }
            break;
        case 'Escape':
            playSound('select');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
    }
});

// ==========================================
// KONAMI CODE EASTER EGG
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        playSound('blip');

        if (konamiIndex === konamiCode.length) {
            activateGodMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateGodMode() {
    playSound('success');
    score += 99999;
    updateScore();

    showNotification('🎮 GOD MODE ACTIVATED! 🎮\n\n+99999 SCORE!\nYOU ARE NOW A LEGEND!');

    // Add rainbow effect
    document.body.style.animation = 'rainbow 3s linear infinite';

    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add rainbow animation
style.textContent += `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;

// ==========================================
// PARTICLE EFFECTS ON CLICK
// ==========================================
document.addEventListener('click', (e) => {
    createParticleBurst(e.clientX, e.clientY);
});

function createParticleBurst(x, y) {
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'];

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let px = x;
        let py = y;
        let opacity = 1;

        const animate = () => {
            px += vx * 0.1;
            py += vy * 0.1;
            opacity -= 0.02;

            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

// ==========================================
// INITIAL SETUP
// ==========================================
console.log('%c🎮 GAMER PORTFOLIO LOADED! 🎮', 'font-size: 24px; font-weight: bold; color: #00ffff; text-shadow: 0 0 10px #00ffff;');
console.log('%c▼▼▼ TRY THE KONAMI CODE: ↑ ↑ ↓ ↓ ← → ← → B A ▼▼▼', 'font-size: 14px; color: #ffff00;');
console.log('%c★ USE ARROW KEYS TO SCROLL | PRESS ESC TO GO HOME ★', 'font-size: 12px; color: #ff00ff;');

// Resume AudioContext on first user interaction
document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });
