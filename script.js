// ====================================
// PARALLAX EFFECT
// ====================================

function initParallax() {
    const bgImage = document.querySelector('.bg-image');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                
                // Slow vertical parallax movement
                if (bgImage) {
                    bgImage.style.transform = `translate(-50%, calc(-50% + ${scrolled * parallaxSpeed}px))`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ====================================
// SCROLL ANIMATIONS
// ====================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-scroll attribute
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(el => observer.observe(el));
}

// ====================================
// NAVIGATION SCROLL EFFECT
// ====================================

function initNavScroll() {
    const nav = document.querySelector('.glass-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.08)';
            nav.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.background = 'var(--crystal-white)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ====================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.glass-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================================
// GLASS CARD TILT EFFECT
// ====================================

function initCardTilt() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ====================================
// CRYSTAL SHIMMER EFFECT
// ====================================

function initCrystalShimmer() {
    const cards = document.querySelectorAll('.glass-card, .glass-panel');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const shimmer = document.createElement('div');
            shimmer.className = 'shimmer-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            shimmer.style.width = size + 'px';
            shimmer.style.height = size + 'px';
            shimmer.style.left = (e.clientX - rect.left - size / 2) + 'px';
            shimmer.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(shimmer);
            
            setTimeout(() => shimmer.remove(), 600);
        });
    });
    
    // Add shimmer CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .shimmer-effect {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
            pointer-events: none;
            animation: shimmerPulse 0.6s ease-out;
            z-index: 10;
        }
        
        @keyframes shimmerPulse {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// SQUARE PAYMENT CONFIGURATION
// ====================================

// IMPORTANT: Replace these with your actual Square credentials
const SQUARE_APPLICATION_ID = 'sandbox-sq0idb-YOUR_APPLICATION_ID'; // Replace with your Square Application ID
const SQUARE_LOCATION_ID = 'YOUR_LOCATION_ID'; // Replace with your Square Location ID

let payments;
let card;

// ====================================
// SHOPPING CART
// ====================================

let cart = [];

function initShoppingCart() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartButton = document.getElementById('cartButton');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Add to cart functionality
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            // Add to cart
            cart.push({
                name: productName,
                price: productPrice
            });
            
            updateCartUI();
            
            // Visual feedback
            this.textContent = 'Added! ✓';
            this.style.background = 'rgba(100, 255, 150, 0.2)';
            this.style.borderColor = 'rgba(100, 255, 150, 0.5)';
            
            // Show notification
            showNotification(`${productName} added to cart!`);
            
            // Reset button after delay
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
                this.style.borderColor = '';
            }, 2000);
        });
    });
    
    // Open cart
    cartButton.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        updateCartDisplay();
    });
    
    // Close cart
    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });
    
    // Close cart on overlay click
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartOverlay.classList.remove('active');
            openPaymentModal();
        }
    });
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add remove item listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCartUI();
            updateCartDisplay();
        });
    });
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

// ====================================
// SQUARE PAYMENT INTEGRATION
// ====================================

async function initializeSquarePayments() {
    try {
        if (!window.Square) {
            console.error('Square.js failed to load properly');
            return;
        }
        
        payments = window.Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);
        
        // Initialize card payment method
        card = await payments.card();
        await card.attach('#card-container');
        
        console.log('Square Payments initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize Square Payments:', error);
        showPaymentStatus('Failed to load payment form. Please refresh the page.', 'error');
    }
}

function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const paymentSummary = document.getElementById('paymentSummary');
    
    // Build summary
    let summaryHTML = '';
    cart.forEach(item => {
        summaryHTML += `
            <div class="summary-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `;
    });
    
    const total = getCartTotal();
    summaryHTML += `
        <div class="summary-item summary-total">
            <strong>Total</strong>
            <strong>$${total.toFixed(2)}</strong>
        </div>
    `;
    
    paymentSummary.innerHTML = summaryHTML;
    paymentModal.classList.add('active');
    
    // Initialize Square payments if not already done
    if (!card) {
        initializeSquarePayments();
    }
}

function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.classList.remove('active');
    document.getElementById('payment-status').textContent = '';
    document.getElementById('payment-status').className = '';
}

async function handlePayment() {
    const cardButton = document.getElementById('card-button');
    const statusContainer = document.getElementById('payment-status');
    
    try {
        cardButton.disabled = true;
        cardButton.textContent = 'Processing...';
        statusContainer.textContent = '';
        statusContainer.className = '';
        
        // Tokenize the card
        const result = await card.tokenize();
        
        if (result.status === 'OK') {
            // In production, send result.token to your server
            // For now, we'll simulate a successful payment
            console.log('Payment token:', result.token);
            
            // Simulate server processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showPaymentStatus('Payment successful! Thank you for your purchase.', 'success');
            
            // Clear cart after successful payment
            setTimeout(() => {
                cart = [];
                updateCartUI();
                closePaymentModal();
                showNotification('Order confirmed! Check your email for details.');
            }, 2000);
            
        } else {
            let errorMessage = 'Payment failed. Please try again.';
            
            if (result.errors) {
                errorMessage = result.errors.map(error => error.message).join(', ');
            }
            
            showPaymentStatus(errorMessage, 'error');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        showPaymentStatus('Payment error. Please try again.', 'error');
        
    } finally {
        cardButton.disabled = false;
        cardButton.textContent = 'Pay Now';
    }
}

function showPaymentStatus(message, type) {
    const statusContainer = document.getElementById('payment-status');
    statusContainer.textContent = message;
    statusContainer.className = type;
}

// ====================================
// PAYMENT MODAL CONTROLS
// ====================================

function initPaymentModalControls() {
    const closePaymentBtn = document.getElementById('closePayment');
    const paymentModal = document.getElementById('paymentModal');
    const cardButton = document.getElementById('card-button');
    
    closePaymentBtn.addEventListener('click', closePaymentModal);
    
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    cardButton.addEventListener('click', handlePayment);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(100, 255, 150, 0.2);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(100, 255, 150, 0.4);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        color: white;
        font-size: 0.95rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add animations
    if (!document.getElementById('notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ====================================
// FORM ENHANCEMENT
// ====================================

function initFormEnhancements() {
    const inputs = document.querySelectorAll('.glass-input');
    
    inputs.forEach(input => {
        // Add focus ripple effect
        input.addEventListener('focus', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        // Floating label effect (if needed in future)
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // Form submission handler (customize based on your needs)
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const submitBtn = bookingForm.querySelector('.glass-btn');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add loading state
                this.style.opacity = '0.7';
                this.textContent = 'Processing...';
                
                // Simulate form submission (replace with actual submission logic)
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.textContent = 'Appointment Requested!';
                    this.style.background = 'rgba(100, 255, 150, 0.2)';
                    
                    setTimeout(() => {
                        this.textContent = 'Book Your Appointment';
                        this.style.background = '';
                    }, 3000);
                }, 2000);
            });
        }
    }
}

// ====================================
// MOUSE GLOW EFFECT (OPTIONAL)
// ====================================

function initMouseGlow() {
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    // Add glow CSS
    const style = document.createElement('style');
    style.textContent = `
        .mouse-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            mix-blend-mode: screen;
            transition: opacity 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .mouse-glow {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// TESTIMONIAL ROTATION (OPTIONAL)
// ====================================

function initTestimonialRotation() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Add subtle pulse to active testimonial
    function highlightTestimonial() {
        testimonialCards.forEach((card, index) => {
            if (index === currentIndex) {
                card.style.transform = 'scale(1.02)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            } else {
                card.style.transform = '';
                card.style.borderColor = '';
            }
        });
        
        currentIndex = (currentIndex + 1) % testimonialCards.length;
    }
    
    // Rotate every 5 seconds
    setInterval(highlightTestimonial, 5000);
}

// ====================================
// LAZY LOAD OPTIMIZATION
// ====================================

function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ====================================
// PERFORMANCE: REDUCE MOTION
// ====================================

function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        // Disable parallax
        const bgImage = document.querySelector('.bg-image');
        if (bgImage) {
            bgImage.style.transform = 'translate(-50%, -50%)';
        }
    }
}

// ====================================
// MOBILE MENU
// ====================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (!menuToggle) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content') && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    checkReducedMotion();
    
    // Initialize all features
    initParallax();
    initScrollAnimations();
    initNavScroll();
    initSmoothScroll();
    initCardTilt();
    initCrystalShimmer();
    initFormEnhancements();
    initMouseGlow();
    initTestimonialRotation();
    initLazyLoad();
    initMobileMenu();
    initShoppingCart();
    initPaymentModalControls();
    
    // Initialize Square Payments when the page loads
    if (window.Square) {
        initializeSquarePayments();
    }
    
    // Add loaded class for entrance animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    console.log('✨ Jazzy\'s Boutique - Website Loaded');
});

// ====================================
// WINDOW RESIZE HANDLER
// ====================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize mobile menu on resize
        initMobileMenu();
    }, 250);
});

// ====================================
// PERFORMANCE MONITORING (OPTIONAL)
// ====================================

if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}
