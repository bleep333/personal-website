// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check for saved dark mode preference or default to dark mode
function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'false') {
        body.classList.remove('dark-mode');
    } else {
        // Default to dark mode if no preference is saved
        body.classList.add('dark-mode');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    // Clear navbar inline styles when switching to light mode so CSS rules apply
    const navbar = document.querySelector('.navbar');
    if (!isDarkMode && navbar) {
        navbar.style.background = '';
        navbar.style.boxShadow = '';
    }
}

// Initialize dark mode on page load
loadDarkModePreference();

// Add event listener to toggle button
darkModeToggle.addEventListener('click', toggleDarkMode);

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Check if mobile menu is open
            const isMenuOpen = navMenu.classList.contains('active');
            
            // Function to perform the scroll
            const performScroll = () => {
                // Get navbar height dynamically
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                
                // Try to find the section-title within the target section for better positioning
                // This ensures we scroll to the title, not just the top of the section
                const sectionTitle = target.querySelector('.section-title');
                const scrollTarget = sectionTitle || target;
                
                // Get the position of the scroll target
                const targetRect = scrollTarget.getBoundingClientRect();
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = targetRect.top + currentScroll;
                
                // Calculate offset - more on mobile to account for browser chrome and better visibility
                const isMobile = window.innerWidth <= 768 || isTouchDevice;
                const extraOffset = isMobile ? 100 : 20; // Much larger offset on mobile
                
                // Calculate final scroll position
                const scrollPosition = Math.max(0, targetPosition - navbarHeight - extraOffset);
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            };
            
            // If menu is open, wait for it to close before scrolling
            if (isMenuOpen) {
                // Wait for menu animation to complete (300ms transition)
                setTimeout(performScroll, 350);
            } else {
                performScroll();
            }
        }
    });
});

// Navbar background change on scroll (dark mode only; light mode uses CSS)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    } else {
        navbar.style.background = '';
        navbar.style.boxShadow = '';
    }
});

// Function to calculate which section should be highlighted
function getActiveSection() {
    // Check if scrolled all the way down
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 50; // pixels from bottom
    
    if (scrollPosition >= documentHeight - threshold) {
        return 'contact';
    }
    
    // Otherwise, find the section that takes up the majority of the screen
    const sections = document.querySelectorAll('section[id]');
    const viewportTop = window.scrollY;
    const viewportBottom = window.scrollY + window.innerHeight;
    
    let maxVisibleArea = 0;
    let activeSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // Calculate visible area of this section
        const visibleTop = Math.max(viewportTop, sectionTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Track section with most visible area
        if (visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            activeSectionId = section.getAttribute('id');
        }
    });
    
    return activeSectionId || 'home';
}

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const current = getActiveSection();

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Initialize active nav link on page load
    const navLinks = document.querySelectorAll('.nav-link');
    const current = getActiveSection();
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || (current === 'home' && link.getAttribute('href') === '#home')) {
            link.classList.add('active');
        }
    });
});


// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing animation
        // typeWriter(heroTitle, originalText, 100);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
  
    const stars = document.querySelector('.hero-stars');
    const clouds = document.querySelector('.hero-clouds');
  
    // subtle parallax (small values)
    if (stars) stars.style.transform = `translateY(${scrolled * 0.15}px)`;
    if (clouds) clouds.style.transform = `translateY(${scrolled * 0.10}px)`;
  });

// Detect if device is touch-enabled (mobile)
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Project card hover effects and click handling
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Make card clickable to open live site if data-live-url is set
    const liveUrl = card.getAttribute('data-live-url');
    if (liveUrl) {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a link inside the card
            if (!e.target.closest('.project-link')) {
                // On mobile, don't navigate if clicking on the image area (let image toggle handle it)
                if (isTouchDevice && e.target.closest('.project-image')) {
                    return;
                }
                window.open(liveUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }
    
    // Prevent card link from triggering when clicking on project-links
    const projectLinks = card.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});

// Hide placeholders for all project images that exist
document.querySelectorAll('.project-img').forEach(img => {
    const projectImageContainer = img.closest('.project-image');
    const placeholder = projectImageContainer ? projectImageContainer.querySelector('.project-placeholder') : null;
    
    // Hide placeholder if image exists and is loaded
    const hidePlaceholder = function() {
        if (placeholder && img.src) {
            placeholder.classList.add('hidden');
        }
    };
    
    // Show placeholder only if image fails to load
    const showPlaceholder = function() {
        if (placeholder && (!img.src || !img.complete || img.naturalWidth === 0)) {
            placeholder.classList.remove('hidden');
        }
    };
    
    img.addEventListener('load', hidePlaceholder);
    img.addEventListener('error', showPlaceholder);
    
    // Check on initial load
    if (img.complete && img.naturalWidth > 0) {
        hidePlaceholder();
    } else if (img.src) {
        // Image is loading, hide placeholder immediately
        hidePlaceholder();
    }
});

// Project image hover swap functionality
document.querySelectorAll('.project-img[data-project]').forEach(img => {
    const projectName = img.getAttribute('data-project');
    const originalSrc = img.src;
    const hoverSrc = `images/${projectName}-hover.jpg`;
    
    // Find the placeholder and project card
    const projectImageContainer = img.closest('.project-image');
    const placeholder = projectImageContainer ? projectImageContainer.querySelector('.project-placeholder') : null;
    const projectCard = img.closest('.project-card');
    
    // Track current image state (false = original, true = hover)
    let isHoverImage = false;
    
    // Mobile UI elements
    let carouselDots = null;
    let hintOverlay = null;
    let hintDismissed = false;
    
    // Hide placeholder if image exists and is loaded
    img.addEventListener('load', function() {
        if (placeholder && img.src && img.complete && img.naturalWidth > 0) {
            placeholder.classList.add('hidden');
        }
    });
    
    // Check on initial load
    if (img.complete && img.naturalWidth > 0 && placeholder) {
        placeholder.classList.add('hidden');
    }
    
    // Preload hover image to check if it exists
    const hoverImage = new Image();
    let hoverImageExists = false;
    
    hoverImage.onload = function() {
        hoverImageExists = true;
        // Initialize mobile UI if hover image exists and on touch device
        if (isTouchDevice && projectImageContainer) {
            initializeMobileUI();
        }
    };
    
    hoverImage.onerror = function() {
        hoverImageExists = false;
    };
    
    hoverImage.src = hoverSrc;
    
    // Check if hover image is already loaded
    if (hoverImage.complete && hoverImage.naturalWidth > 0) {
        hoverImageExists = true;
        if (isTouchDevice && projectImageContainer) {
            initializeMobileUI();
        }
    }
    
    // Initialize mobile UI elements (dots and hint)
    function initializeMobileUI() {
        if (!hoverImageExists || !projectImageContainer) return;
        
        // Check if hint was already dismissed in this session
        const hintKey = `imageHintDismissed_${projectName}`;
        hintDismissed = sessionStorage.getItem(hintKey) === 'true';
        
        // Create carousel dots
        if (!carouselDots) {
            carouselDots = document.createElement('div');
            carouselDots.className = 'image-carousel-dots';
            
            // Create two dots
            const dot1 = document.createElement('div');
            dot1.className = 'image-carousel-dot active';
            dot1.setAttribute('data-index', '0');
            
            const dot2 = document.createElement('div');
            dot2.className = 'image-carousel-dot';
            dot2.setAttribute('data-index', '1');
            
            carouselDots.appendChild(dot1);
            carouselDots.appendChild(dot2);
            projectImageContainer.appendChild(carouselDots);
            
            // Update dots to reflect initial state
            updateDots();
        }
        
        // Create hint overlay (only if not dismissed)
        if (!hintOverlay && !hintDismissed) {
            hintOverlay = document.createElement('div');
            hintOverlay.className = 'image-switch-hint';
            hintOverlay.textContent = 'Tap or swipe';
            projectImageContainer.appendChild(hintOverlay);
        }
    }
    
    // Update carousel dots to reflect current image
    function updateDots() {
        if (!carouselDots) return;
        const dots = carouselDots.querySelectorAll('.image-carousel-dot');
        dots.forEach((dot, index) => {
            if (index === (isHoverImage ? 1 : 0)) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Hide hint after first successful switch
    function dismissHint() {
        if (hintOverlay && !hintDismissed) {
            hintOverlay.classList.add('hidden');
            const hintKey = `imageHintDismissed_${projectName}`;
            sessionStorage.setItem(hintKey, 'true');
            hintDismissed = true;
            // Remove from DOM after fade out
            setTimeout(() => {
                if (hintOverlay && hintOverlay.parentNode) {
                    hintOverlay.remove();
                }
            }, 500);
        }
    }
    
    // Function to swap to hover image
    const showHoverImage = function() {
        if (hoverImageExists || (hoverImage.complete && hoverImage.naturalWidth > 0)) {
            if (placeholder) {
                placeholder.classList.add('hidden');
            }
            if (!isHoverImage) {
                img.style.opacity = '0';
                setTimeout(() => {
                    img.src = hoverSrc;
                    if (placeholder) {
                        placeholder.classList.add('hidden');
                    }
                    img.style.opacity = '1';
                    isHoverImage = true;
                    updateDots();
                    dismissHint();
                }, 150);
            }
        }
    };
    
    // Function to swap back to original image
    const showOriginalImage = function() {
        if (placeholder) {
            placeholder.classList.add('hidden');
        }
        if (isHoverImage) {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = originalSrc;
                if (placeholder) {
                    placeholder.classList.add('hidden');
                }
                img.style.opacity = '1';
                isHoverImage = false;
                updateDots();
                dismissHint();
            }, 150);
        }
    };
    
    // Function to toggle between images
    const toggleImage = function() {
        if (isHoverImage) {
            showOriginalImage();
        } else {
            showHoverImage();
        }
    };
    
    // Function to switch to next image (for swipe)
    const switchToNext = function() {
        if (isHoverImage) {
            showOriginalImage();
        } else {
            showHoverImage();
        }
    };
    
    // Function to switch to previous image (for swipe)
    const switchToPrev = function() {
        if (isHoverImage) {
            showOriginalImage();
        } else {
            showHoverImage();
        }
    };
    
    if (projectCard) {
        // Desktop hover behavior
        projectCard.addEventListener('mouseenter', function() {
            if (!isTouchDevice) {
                showHoverImage();
            }
        });
        
        projectCard.addEventListener('mouseleave', function() {
            if (!isTouchDevice) {
                showOriginalImage();
            }
        });
        
        // Mobile touch behavior - toggle image on tap, swipe for navigation
        if (isTouchDevice && projectImageContainer) {
            let touchStartTime = 0;
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTarget = null;
            let swipeThreshold = 50; // Minimum distance for swipe
            
            projectImageContainer.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTarget = e.target;
            }, { passive: true });
            
            projectImageContainer.addEventListener('touchmove', function(e) {
                // Prevent default scrolling if user is swiping horizontally
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = Math.abs(currentX - touchStartX);
                const deltaY = Math.abs(currentY - touchStartY);
                
                // If horizontal swipe is more significant than vertical, prevent scroll
                if (deltaX > deltaY && deltaX > 10) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            projectImageContainer.addEventListener('touchend', function(e) {
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - touchStartTime;
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                
                // Check if it's a swipe (horizontal movement > threshold and > vertical movement)
                if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY && touchDuration < 500) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Swipe right (positive deltaX) = next image
                    // Swipe left (negative deltaX) = previous image
                    if (deltaX > 0) {
                        switchToNext();
                    } else {
                        switchToPrev();
                    }
                }
                // Check if it's a tap (small movement, quick duration)
                else if (touchDuration < 300 && absDeltaX < 10 && absDeltaY < 10) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleImage();
                }
            });
            
            // Also handle click for devices that support both touch and mouse
            projectImageContainer.addEventListener('click', function(e) {
                // Only handle if it's from a touch device and not from a link
                if (isTouchDevice && !e.target.closest('.project-link') && !e.target.closest('.image-carousel-dots')) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleImage();
                }
            });
        }
    }
});

// Skill item animation on hover
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add initial styles for hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    // Add loaded class to body
    document.body.classList.add('loaded');
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Close any open notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// Add focus styles for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Navbar background change (dark mode only; light mode uses CSS)
    const navbar = document.querySelector('.navbar');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    } else {
        navbar.style.background = '';
        navbar.style.boxShadow = '';
    }

    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const current = getActiveSection();

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 10);

window.addEventListener('scroll', throttledScrollHandler);

// Scroll Progress Spine
(function() {
    const scrollSpine = document.getElementById('scroll-spine');
    if (!scrollSpine) return;
    
    let ticking = false;
    
    function updateScrollSpine() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Calculate scroll progress (0 to 1)
        const scrollableHeight = documentHeight - windowHeight;
        let scrollProgress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
        
        // Clamp progress between 0 and 1
        scrollProgress = Math.min(1, Math.max(0, scrollProgress));
        
        // Set CSS variable for spine progress
        scrollSpine.style.setProperty('--spine-progress', scrollProgress);

        // Update marker position to follow the progress fill
        const marker = scrollSpine.querySelector('.spine-marker');
        if (marker) {
            // Position marker at the bottom edge of the fill (progress * 100%)
            marker.style.top = `${scrollProgress * 100}%`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollSpine);
            ticking = true;
        }
    }
    
    // Update on scroll
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Update on resize (viewport height changes)
    window.addEventListener('resize', requestTick, { passive: true });
    
    // Initial update
    updateScrollSpine();
})();

// Scroll-based fade effects for sections
(function() {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;
    
    let ticking = false;
    
    function updateSectionFades() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const viewportTop = scrollTop;
        const viewportBottom = scrollTop + windowHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollTop + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            // Calculate how much of the section is visible
            const visibleTop = Math.max(viewportTop, sectionTop);
            const visibleBottom = Math.min(viewportBottom, sectionBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Calculate opacity based on scroll position
            let opacity = 1;
            
            // If section is above viewport (scrolling up), fade it out
            if (sectionBottom < viewportTop) {
                // Section is completely above viewport
                const distanceAbove = viewportTop - sectionBottom;
                const fadeDistance = windowHeight * 1.5; // Fade over 1.5x viewport height for more dramatic effect
                const fadeProgress = Math.min(1, distanceAbove / fadeDistance);
                // Start from barely visible (0.1) and fade to 0
                opacity = Math.max(0, 0.1 * (1 - fadeProgress));
            }
            // If section is below viewport (scrolling in from bottom), keep it invisible
            else if (sectionTop > viewportBottom) {
                // Section is completely below viewport - stay invisible
                opacity = 0.1;
            }
            // Section is in viewport - check if it's entering or leaving
            else {
                // Calculate how much of section is visible
                const sectionHeight = rect.height;
                const visibleRatio = visibleHeight / sectionHeight;
                
                // If section is entering from bottom (top of section is below viewport top)
                if (rect.top > 0) {
                    // Calculate how much of the section has entered from the bottom
                    // rect.top tells us how far from the top of viewport the section starts
                    // We want to keep it invisible until it's already partially up the screen
                    const enterThreshold = windowHeight * 0.25; // Start fading when section top is 25% up the screen
                    
                    if (rect.top > enterThreshold) {
                        // Section hasn't moved up enough yet - keep invisible
                        opacity = 0.1;
                    } else {
                        // Section is high enough - fade in based on position
                        // rect.top decreases as section moves up (0 = at top of viewport)
                        const fadeStart = enterThreshold;
                        const fadeEnd = 0; // Fully visible when at top of viewport
                        const fadeRange = fadeStart - fadeEnd;
                        const fadeProgress = Math.min(1, Math.max(0, (fadeStart - rect.top) / fadeRange));
                        opacity = Math.max(0.1, 0.1 + (0.9 * fadeProgress));
                    }
                }
                // If section is leaving from top (bottom of section is above viewport bottom)
                else if (rect.bottom < windowHeight && visibleRatio < 0.5) {
                    const exitProgress = visibleRatio / 0.5; // 0 to 1 as it exits
                    opacity = Math.max(0.1, 0.1 + (0.9 * exitProgress));
                }
                // Section is fully in viewport - fully opaque
                else {
                    opacity = 1;
                }
            }
            
            // Apply opacity
            section.style.opacity = opacity;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateSectionFades);
            ticking = true;
        }
    }
    
    // Update on scroll
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', requestTick, { passive: true });
    
    // Initial update
    updateSectionFades();
})();