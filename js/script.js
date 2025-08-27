// DOM Elements
const mainContainer = document.querySelector('.main-container');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const menuOverlay = document.getElementById('menu-overlay');

// Current slide index
let currentSlide = 0;
let isScrolling = false;

// Initialize the slideshow
function initSlideshow() {
    // Set initial active slide
    updateActiveSlide(0);
    
    // Add scroll event listener
    mainContainer.addEventListener('scroll', handleScroll);
    
    // Add dot click listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Add navigation link listeners
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
            closeNavMenu();
        });
    });
    
    // Add mobile menu toggle
    hamburger.addEventListener('click', toggleNavMenu);
    
    // Add close menu button
    closeMenu.addEventListener('click', closeNavMenu);
    
    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', closeNavMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeNavMenu();
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Add touch/swipe support for mobile
    addTouchSupport();
}

// Handle scroll events
function handleScroll() {
    if (isScrolling) return;
    
    const scrollTop = mainContainer.scrollTop;
    const slideHeight = window.innerHeight;
    const newSlide = Math.round(scrollTop / slideHeight);
    
    if (newSlide !== currentSlide) {
        updateActiveSlide(newSlide);
    }
}

// Update active slide
function updateActiveSlide(index) {
    currentSlide = index;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

// Go to specific slide
function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    isScrolling = true;
    const slideHeight = window.innerHeight;
    const scrollTop = index * slideHeight;
    
    mainContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
    });
    
    // Update active slide after scroll animation
    setTimeout(() => {
        updateActiveSlide(index);
        isScrolling = false;
    }, 500);
}

// Toggle navigation menu
function toggleNavMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

// Close navigation menu
function closeNavMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    menuOverlay.classList.remove('active');
}

// Handle keyboard navigation
function handleKeyboard(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            e.preventDefault();
            goToSlide(Math.max(0, currentSlide - 1));
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            e.preventDefault();
            goToSlide(Math.min(slides.length - 1, currentSlide + 1));
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(slides.length - 1);
            break;
        case 'Escape':
            closeNavMenu();
            break;
    }
}

// Add touch/swipe support for mobile
function addTouchSupport() {
    let startY = 0;
    let startTime = 0;
    
    mainContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });
    
    mainContainer.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const deltaY = startY - endY;
        const deltaTime = endTime - startTime;
        
        // Only handle quick swipes
        if (deltaTime < 300 && Math.abs(deltaY) > 50) {
            if (deltaY > 0) {
                // Swipe up - next slide
                goToSlide(Math.min(slides.length - 1, currentSlide + 1));
            } else {
                // Swipe down - previous slide
                goToSlide(Math.max(0, currentSlide - 1));
            }
        }
    });
}

// Add scroll indicator animation
function animateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    let opacity = 0.7;
    let direction = -1;
    
    setInterval(() => {
        opacity += direction * 0.01;
        
        if (opacity <= 0.3) {
            direction = 1;
        } else if (opacity >= 0.7) {
            direction = -1;
        }
        
        scrollIndicator.style.opacity = opacity;
    }, 50);
}

// Add smooth reveal animations for content
function addRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe all content elements
    document.querySelectorAll('.content > *').forEach(el => {
        observer.observe(el);
    });
}

// Add CSS for reveal animations
function addRevealCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .content > * {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .content > *.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .content > *:nth-child(1) { transition-delay: 0.1s; }
        .content > *:nth-child(2) { transition-delay: 0.2s; }
        .content > *:nth-child(3) { transition-delay: 0.3s; }
        .content > *:nth-child(4) { transition-delay: 0.4s; }
        .content > *:nth-child(5) { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    animateScrollIndicator();
    addRevealCSS();
    addRevealAnimations();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add loading animation CSS
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .slide {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease;
    }
    
    .slide.active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(loadingStyle);

// Add smooth scrolling for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    mainContainer.style.scrollBehavior = 'auto';
}

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll handler
mainContainer.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps
