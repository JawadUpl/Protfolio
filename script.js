// ==========================================
// ARCADE 2026 - NEO-RETRO PIXEL JS
// ==========================================

// ==========================================
// PIXEL CURSOR
// ==========================================
const pixelCursor = document.querySelector('.pixel-cursor');
const cursorShadow = document.querySelector('.cursor-shadow');

let mouseX = 0, mouseY = 0;
let shadowX = 0, shadowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = Math.floor(e.clientX / 4) * 4;
    mouseY = Math.floor(e.clientY / 4) * 4;

    if (pixelCursor) {
        pixelCursor.style.left = mouseX + 'px';
        pixelCursor.style.top = mouseY + 'px';
    }
});

function animateCursorShadow() {
    shadowX += (mouseX - shadowX) * 0.15;
    shadowY += (mouseY - shadowY) * 0.15;

    shadowX = Math.floor(shadowX / 4) * 4;
    shadowY = Math.floor(shadowY / 4) * 4;

    if (cursorShadow) {
        cursorShadow.style.left = shadowX + 'px';
        cursorShadow.style.top = shadowY + 'px';
    }

    requestAnimationFrame(animateCursorShadow);
}
animateCursorShadow();

// ==========================================
// BOOT SEQUENCE
// ==========================================
const bootScreen = document.getElementById('boot-screen');
const bootFill = document.getElementById('boot-fill');
const bootStatus = document.getElementById('boot-status');
const gameScreen = document.getElementById('game-screen');

let bootProgress = 0;
const bootMessages = [
    'LOADING PLAYER DATA■■■',
    'INITIALIZING GRAPHICS■■■',
    'LOADING TEXTURES■■■',
    'CONNECTING SERVER■■■',
    'READY TO PLAY!'
];

const bootInterval = setInterval(() => {
    bootProgress += Math.random() * 8 + 2;

    if (bootProgress >= 100) {
        bootProgress = 100;
        clearInterval(bootInterval);
        bootStatus.textContent = bootMessages[4];
    } else {
        const msgIndex = Math.floor((bootProgress / 100) * 4);
        bootStatus.textContent = bootMessages[msgIndex];
    }

    bootFill.style.width = bootProgress + '%';
}, 150);

// Start game on click or key press
function startGame() {
    playSound('start');
    bootScreen.classList.add('hidden');
    gameScreen.classList.add('visible');
    initPixelRain();
    startScoreCounter();
}

document.addEventListener('click', () => {
    if (bootProgress >= 100 && !bootScreen.classList.contains('hidden')) {
        startGame();
    }
});

document.addEventListener('keydown', () => {
    if (bootProgress >= 100 && !bootScreen.classList.contains('hidden')) {
        startGame();
    }
});

// Auto start after load completes
setTimeout(() => {
    if (bootProgress >= 100 && !bootScreen.classList.contains('hidden')) {
        startGame();
    }
}, 4000);

// ==========================================
// PIXEL RAIN BACKGROUND
// ==========================================
const canvas = document.getElementById('pixel-rain');
const ctx = canvas.getContext('2d');

let pixels = [];
const pixelSize = 4;
const rainCount = 60;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class RainPixel {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 1 + 0.5;
        this.size = pixelSize;
        this.colors = ['#00ffff', '#ff00ff', '#00ff88', '#ffff00'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.y += this.speed;

        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(
            Math.floor(this.x / pixelSize) * pixelSize,
            Math.floor(this.y / pixelSize) * pixelSize,
            this.size,
            this.size
        );
        ctx.globalAlpha = 1;
    }
}

function initPixelRain() {
    pixels = [];
    for (let i = 0; i < rainCount; i++) {
        pixels.push(new RainPixel());
    }
    animateRain();
}

function animateRain() {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0014');
    gradient.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw and update pixels
    pixels.forEach(pixel => {
        pixel.update();
        pixel.draw();
    });

    requestAnimationFrame(animateRain);
}

// ==========================================
// TYPING EFFECT
// ==========================================
const typingText = document.getElementById('typing-text');
const textArray = [
    'STUDENT.DEVELOPER',
    'ASPIRING.GAME.DEV',
    'MULTIMEDIA.ARTIST',
    'PIXEL.ENTHUSIAST',
    'CREATIVE.CODER'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    if (!typingText) return;

    const currentText = textArray[textIndex];

    if (!isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else {
            typeSpeed = 100;
        }
    } else {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            playSound('blip');
            typeSpeed = 500;
        } else {
            typeSpeed = 50;
        }
    }

    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 3000);

// ==========================================
// SCORE COUNTER
// ==========================================
const hiScore = document.getElementById('hi-score');
let score = 0;

function startScoreCounter() {
    setInterval(() => {
        score += Math.floor(Math.random() * 50) + 10;
        updateScore();
    }, 2000);
}

function updateScore() {
    if (hiScore) {
        hiScore.textContent = score.toString().padStart(6, '0');
    }
}

function addScore(points) {
    score += points;
    updateScore();
    playSound('coin');
}

// ==========================================
// NAVIGATION
// ==========================================
const hudLinks = document.querySelectorAll('.hud-link');
const sections = document.querySelectorAll('.screen');

hudLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('select');

        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });

            hudLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            addScore(50);
        }
    });
});

// Active section detection
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            hudLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ==========================================
// SKILL BARS ANIMATION
// ==========================================
const skillBars = document.querySelectorAll('.bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const level = bar.dataset.level;
            bar.style.width = level + '%';
            playSound('appear');
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ==========================================
// BUTTONS & INTERACTIONS
// ==========================================
const btnStart = document.getElementById('btn-start');
if (btnStart) {
    btnStart.addEventListener('click', () => {
        playSound('start');
        addScore(100);
        const profileSection = document.getElementById('profile');
        if (profileSection) {
            profileSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Stage buttons
const stageBtns = document.querySelectorAll('.stage-btn');
stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('select');
        addScore(150);
        showNotification('STAGE LOCKED - COMING SOON!');
    });
});

// Select options
const selectOptions = document.querySelectorAll('.select-option');
selectOptions.forEach(option => {
    option.addEventListener('click', () => {
        playSound('blip');
        addScore(25);

        selectOptions.forEach(o => o.style.borderColor = 'var(--neon-cyan)');
        option.style.borderColor = 'var(--neon-yellow)';
    });
});

// Social links
const socialLinks = document.querySelectorAll('.social-pixel, .channel-item');
socialLinks.forEach(link => {
    link.addEventListener('click', () => {
        playSound('select');
        addScore(50);
    });
});

// Skill tags
const skillTags = document.querySelectorAll('.tag-item');
skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
        playSound('blip');
        addScore(15);
    });
});

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playSound('success');

        const formData = new FormData(contactForm);
        const name = formData.get('name');

        showNotification(`MESSAGE TRANSMITTED!\n\nTHANK YOU, ${name.toUpperCase()}!`);
        contactForm.reset();
        addScore(500);
    });
}

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
        padding: 40px 50px;
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        color: #00ffff;
        text-shadow: 0 0 10px #00ffff;
        z-index: 10001;
        text-align: center;
        box-shadow: 0 0 40px #00ffff;
        white-space: pre-line;
        line-height: 2;
        image-rendering: pixelated;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ==========================================
// 8-BIT SOUND EFFECTS
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
            frequency = 880;
            duration = 0.05;
            break;
        case 'select':
            frequency = 660;
            duration = 0.1;
            break;
        case 'start':
            frequency = 440;
            duration = 0.3;
            break;
        case 'coin':
            frequency = 1100;
            duration = 0.15;
            break;
        case 'success':
            frequency = 880;
            duration = 0.3;
            break;
        case 'appear':
            frequency = 330;
            duration = 0.1;
            break;
    }

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Resume audio context
document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

// ==========================================
// PARTICLE BURST ON CLICK
// ==========================================
document.addEventListener('click', (e) => {
    createPixelBurst(e.clientX, e.clientY);
});

function createPixelBurst(x, y) {
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
            image-rendering: pixelated;
        `;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 40 + Math.random() * 40;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let px = x, py = y, opacity = 1;

        function animate() {
            px += vx * 0.1;
            py += vy * 0.1;
            opacity -= 0.03;

            // Snap to pixel grid
            particle.style.left = Math.floor(px / 4) * 4 + 'px';
            particle.style.top = Math.floor(py / 4) * 4 + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }

        animate();
    }
}

// ==========================================
// KONAMI CODE
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

    showNotification('🎮 GOD MODE ACTIVATED! 🎮\n\n+99999 SCORE!\nYOU ARE LEGENDARY!');

    document.body.style.animation = 'rainbow 3s linear infinite';

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
const animatedElements = document.querySelectorAll('.char-card, .stats-card, .skill-node, .stage-card, .connect-info, .message-terminal');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            playSound('appear');
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    scrollObserver.observe(el);
});

// ==========================================
// CONSOLE
// ==========================================
console.log('%c🎮 ARCADE 2026 LOADED! 🎮', 'font-size: 24px; font-weight: bold; color: #00ffff; text-shadow: 0 0 10px #00ffff;');
console.log('%c▼▼▼ KONAMI CODE: ↑ ↑ ↓ ↓ ← → ← → B A ▼▼▼', 'font-size: 14px; color: #ffff00;');

// ==========================================
// GALLERY LIGHTBOX
// ==========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentImageIndex = 0;
const galleryImages = [];

// Collect all gallery image paths
galleryItems.forEach((item, index) => {
    galleryImages.push(item.dataset.img);

    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = galleryImages[currentImageIndex];
    updateCounter();
    lightbox.classList.add('active');
    playSound('select');
    addScore(50);
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    playSound('blip');
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
    updateCounter();
    playSound('blip');
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
    updateCounter();
    playSound('blip');
}

function updateCounter() {
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}

// Lightbox event listeners
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', nextImage);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', prevImage);
}

// Close on background click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    }
});
