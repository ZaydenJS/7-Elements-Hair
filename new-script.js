// 4 Elements Hair - Optimized JavaScript

// Use passive event listeners for better performance
const passiveSupported = (() => {
  let passive = false;
  try {
    const options = Object.defineProperty({}, "passive", {
      get: () => (passive = true),
    });
    window.addEventListener("test", null, options);
    window.removeEventListener("test", null, options);
  } catch (err) {}
  return passive;
})();

const eventOptions = passiveSupported ? { passive: true } : false;

document.addEventListener("DOMContentLoaded", function () {
  // Respect reduced motion preference
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Optimized mobile detection
  const isMobile = window.innerWidth <= 768;

  // Function to detect mobile devices
  function isMobileDevice() {
    return (
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  // Function to scroll to element with custom positioning
  function scrollToElementCentered(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const elementTop = targetElement.offsetTop;
    const elementHeight = targetElement.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate position to center the element on screen
    const offsetPosition = elementTop - windowHeight / 2 + elementHeight / 2;

    window.scrollTo({
      top: Math.max(0, offsetPosition), // Ensure we don't scroll above the page
      behavior: "smooth",
    });
  }

  // Handle service card clicks and booking links
  function handleBookingLinks() {
    // Handle service card links
    const serviceCardLinks = document.querySelectorAll(".service-card-link");
    serviceCardLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (isMobileDevice()) {
          // On mobile, go directly to the "Ready to Book?" card and center it
          if (window.location.pathname.includes("contact.html")) {
            // If already on contact page, just scroll to centered position
            scrollToElementCentered("#ready-to-book");
          } else {
            // If on different page, navigate and let CSS handle positioning
            window.location.href = "contact.html#ready-to-book";
          }
        } else {
          // On desktop, go to the general booking section
          window.location.href = "contact.html#book";
        }
      });
    });

    // Handle "Book Now" buttons in navigation
    const bookButtons = document.querySelectorAll(".book-btn");
    bookButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.includes("#book")) {
          e.preventDefault();
          if (isMobileDevice()) {
            // On mobile, go directly to the "Ready to Book?" card and center it
            if (window.location.pathname.includes("contact.html")) {
              // If already on contact page, just scroll to centered position
              scrollToElementCentered("#ready-to-book");
            } else {
              // If on different page, navigate and let CSS handle positioning
              window.location.href = "contact.html#ready-to-book";
            }
          } else {
            // On desktop, go to the general booking section
            window.location.href = "contact.html#book";
          }
        }
      });
    });
  }

  // Smooth scrolling for navigation links (skip if reduced motion)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (reduceMotion) return; // allow default jump behavior
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
      e.preventDefault();
      const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });

  // Navbar scroll effect (class toggle to avoid style writes/reflow)
  const navbar = document.querySelector(".navbar");
  let lastScrollTop = 0;

  function onScrollNav() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (!navbar) return;
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScrollTop = scrollTop;
  }
  window.addEventListener("scroll", onScrollNav, eventOptions);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      }
    });
  }, observerOptions);

  // Animate elements on scroll
  const animateElements = document.querySelectorAll(
    ".element-card, .services-text, .services-image"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Stagger animation for element cards
  const elementCards = document.querySelectorAll(".element-card");
  elementCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add hover effects for interactive elements
  const interactiveElements = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .book-btn"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    el.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");

  function setMobileMenuTop() {
    const navbarEl = document.querySelector(".navbar");
    if (!navbarEl || !navMenu) return;
    const h = navbarEl.getBoundingClientRect().height;
    navMenu.style.top = `${Math.ceil(h)}px`;
  }

  function toggleMobileMenu() {
    const isActive = navMenu.classList.contains("mobile-active");

    if (isActive) {
      // Close menu
      navMenu.classList.remove("mobile-active");
      mobileMenuToggle.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.classList.remove("mobile-menu-open");
    } else {
      // Open menu
      setMobileMenuTop();
      navMenu.classList.add("mobile-active");
      mobileMenuToggle.classList.add("active");
      mobileMenuOverlay.classList.add("active");
      document.body.classList.add("mobile-menu-open");
    }
  }

  function closeMobileMenu() {
    navMenu.classList.remove("mobile-active");
    mobileMenuToggle.classList.remove("active");
    mobileMenuOverlay.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");
  }

  if (mobileMenuToggle && navMenu && mobileMenuOverlay) {
    // Toggle menu on hamburger click
    mobileMenuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking on overlay
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);

    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll(".nav-link, .book-btn");
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close menu on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("mobile-active")) {
        closeMobileMenu();
      }
    });

    // Close menu when window is resized to desktop and keep top in sync
    window.addEventListener("resize", function () {
      setMobileMenuTop();
      if (
        window.innerWidth > 768 &&
        navMenu.classList.contains("mobile-active")
      ) {
        closeMobileMenu();
      }
    });
  }

  // Optimized parallax effect for hero section (disable on mobile + respect reduced motion)
  if (!reduceMotion && window.innerWidth > 1024) {
    let ticking = false;
    const heroImage = document.querySelector(".hero-image-main");

    function updateParallax() {
      if (heroImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.1;
        heroImage.style.transform = `translateY(${rate}px)`;
      }
      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestParallaxUpdate, eventOptions);
  }

  // Form validation (if contact form is added later)
  function validateForm(form) {
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    return isValid;
  }

  // Add loading animation
  function showLoading() {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  }

  function hideLoading() {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.remove();
    }
  }

  // Initialize AOS (Animate On Scroll) alternative
  function initScrollAnimations() {
    const elements = document.querySelectorAll("[data-animate]");

    elements.forEach((el) => {
      const animationType = el.getAttribute("data-animate");
      el.classList.add("pre-animate");

      switch (animationType) {
        case "fadeInUp":
          el.classList.add("anim-fade-up");
          break;
        case "fadeInLeft":
          el.classList.add("anim-fade-left");
          break;
        case "fadeInRight":
          el.classList.add("anim-fade-right");
          break;
        default:
          el.classList.add("anim-fade-up");
      }

      observer.observe(el);
    });
  }

  // Handle hash navigation on page load
  function handleHashOnLoad() {
    const hash = window.location.hash;
    if (hash === "#book" || hash === "#ready-to-book") {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        if (
          hash === "#ready-to-book" ||
          (hash === "#book" && isMobileDevice())
        ) {
          // On mobile or when specifically targeting ready-to-book, scroll to the card
          scrollToElementCentered("#ready-to-book");
        } else {
          // On desktop, scroll to the general booking section
          const targetElement = document.querySelector("#book");
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100; // Account for fixed navbar
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }

  // Call initialization functions
  initScrollAnimations();
  handleBookingLinks();
  handleHashOnLoad();

  // Remove body opacity load hack to improve FCP/SI
  // (no-op)
  // Performance monitoring (Core Web Vitals)
  if ("PerformanceObserver" in window) {
    // Monitor Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log("LCP:", entry.startTime);
      }
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // Monitor First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log("FID:", entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ["first-input"] });

    // Monitor Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          console.log("CLS:", entry.value);
        }
      }
    }).observe({ entryTypes: ["layout-shift"] });
  }
});

// Utility functions
function debounce(func, wait) {
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function () {
  // Any scroll-based animations can go here
}, 10);

window.addEventListener("scroll", optimizedScrollHandler);

// Add CSS for loader (injected via JS)
const loaderStyles = `
    .loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #F4C2C2;
        border-top: 4px solid #2C2C2C;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
    }
`;

// Inject loader styles
const styleSheet = document.createElement("style");
styleSheet.textContent = loaderStyles;
document.head.appendChild(styleSheet);

// Scroll to top button functionality (mobile only)
const scrollToTopBtn = document.getElementById("scrollToTop");

if (scrollToTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  // Scroll to top when clicked
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
