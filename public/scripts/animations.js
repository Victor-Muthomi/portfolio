// Smooth scroll-triggered animations using Intersection Observer
// Lightweight, performant, no dependencies required

class ScrollAnimations {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupObservers());
    } else {
      this.setupObservers();
    }
  }

  setupObservers() {
    // Fade in animations
    this.createObserver('[data-animate="fade-in"]', {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }, (entry) => {
      entry.target.classList.add('animate-fade-in');
    });

    // Fade up animations
    this.createObserver('[data-animate="fade-up"]', {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }, (entry) => {
      entry.target.classList.add('animate-fade-up');
    });

    // Fade left animations
    this.createObserver('[data-animate="fade-left"]', {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }, (entry) => {
      entry.target.classList.add('animate-fade-left');
    });

    // Fade right animations
    this.createObserver('[data-animate="fade-right"]', {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }, (entry) => {
      entry.target.classList.add('animate-fade-right');
    });

    // Scale animations
    this.createObserver('[data-animate="scale"]', {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }, (entry) => {
      entry.target.classList.add('animate-scale');
    });

    // Stagger animations
    this.setupStaggerAnimations();
  }

  createObserver(selector, options, callback) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Apply delay if specified
          const delay = entry.target.dataset.delay || 0;
          
          setTimeout(() => {
            callback(entry);
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
          }, delay);
        }
      });
    }, options);

    elements.forEach((el) => {
      // Add initial hidden state
      el.classList.add('animate-hidden');
      observer.observe(el);
    });

    this.observers.set(selector, observer);
  }

  setupStaggerAnimations() {
    const staggerGroups = document.querySelectorAll('[data-animate="stagger"]');
    
    staggerGroups.forEach((group) => {
      const children = Array.from(group.children);
      const staggerDelay = parseInt(group.dataset.staggerDelay) || 100;
      
      children.forEach((child, index) => {
        child.setAttribute('data-animate', 'fade-up');
        child.setAttribute('data-delay', index * staggerDelay);
      });
    });

    // Re-run observer setup for stagger children
    this.createObserver('[data-animate="fade-up"][data-delay]', {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }, (entry) => {
      entry.target.classList.add('animate-fade-up');
    });
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

// Smooth scroll for anchor links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (href === '#') return;
      
      const element = document.querySelector(href);
      
      if (element) {
        e.preventDefault();
        
        const headerOffset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
      }
    });
  }
}

// Parallax effect for decorative elements
class ParallaxEffect {
  constructor() {
    this.elements = [];
    this.isScrolling = false;
    this.init();
  }

  init() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      this.elements.push({ el, speed });
    });

    if (this.elements.length > 0) {
      this.addScrollListener();
    }
  }

  addScrollListener() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial update
    this.updateParallax();
  }

  updateParallax() {
    const scrollY = window.pageYOffset;

    this.elements.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        const yPos = scrollY * speed;
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
  }
}

// Mouse move effect for cards
class MouseMoveEffect {
  constructor() {
    this.init();
  }

  init() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach((card) => {
      card.addEventListener('mousemove', this.handleMouseMove.bind(this));
      card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    });
  }

  handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  handleMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
  }
}

// Magnetic button effect
class MagneticButtons {
  constructor() {
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('[data-magnetic]');
    
    buttons.forEach((button) => {
      button.addEventListener('mousemove', this.handleMouseMove.bind(this));
      button.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    });
  }

  handleMouseMove(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      const moveX = x * strength * 0.3;
      const moveY = y * strength * 0.3;
      
      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }

  handleMouseLeave(e) {
    const button = e.currentTarget;
    button.style.transform = 'translate(0, 0)';
  }
}

// Initialize all animations
function initAnimations() {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Add class to disable animations
    document.documentElement.classList.add('reduced-motion');
    return;
  }

  // Initialize animation systems
  new ScrollAnimations();
  new SmoothScroll();
  new ParallaxEffect();
  new MouseMoveEffect();
  new MagneticButtons();
}

// Auto-initialize
if (typeof window !== 'undefined') {
  initAnimations();
}
