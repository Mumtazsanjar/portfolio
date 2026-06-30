/* ===== MUMTAZ SANJAR PORTFOLIO - main.js ===== */

// ===== VISITOR TRACKER — disabled on static hosting =====
// (PHP backend not available on Vercel — removed)

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 600);
});

// ===== AOS INIT =====
AOS.init({
  once: true,
  offset: 60,
  duration: 800,
  easing: 'ease-out',
  anchorPlacement: 'top-bottom',
  disable: false
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Scroll top button
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
  // Active nav link
  updateActiveNav();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV ON SCROLL =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
}
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ===== TYPED TEXT EFFECT =====
const roles = [
  'Web Developer',
  'PHP Developer',
  'Laravel Expert',
  'WordPress Developer',
  'SEO Specialist',
  'Bootstrap Designer',
  'Full Stack Developer'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex--);
  } else {
    typedEl.textContent = current.substring(0, charIndex++);
  }
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length + 1) {
    speed = 1800; isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }
  setTimeout(typeEffect, speed);
}
typeEffect();

// ===== SKILL BARS ANIMATION =====
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width + '%';
  });
}
const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateSkills();
    skillsObserver.disconnect();
  }
}, { threshold: 0.3 });
if (skillsSection) skillsObserver.observe(skillsSection);

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current) + '+';
    }, 16);
  });
}
const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCounters();
    statsObserver.disconnect();
  }
}, { threshold: 0.4 });
if (statsSection) statsObserver.observe(statsSection);

// ===== PROJECT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM — Web3Forms (no PHP needed) =====
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const formData = new FormData(contactForm);

    // Build JSON object from form
    const object = {};
    formData.forEach((value, key) => { object[key] = value; });
    const json = JSON.stringify(object);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });
      const data = await res.json();

      if (data.success) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank you, ' + (object.name || 'there') + '! Your message has been sent. I will get back to you soon.';
        contactForm.reset();
      } else {
        formStatus.className = 'form-status error';
        formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      formStatus.className = 'form-status error';
      formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    setTimeout(() => { formStatus.className = 'form-status'; formStatus.innerHTML = ''; }, 6000);
  });
}

// ===== SCROLL TO TOP =====
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== IMAGE LIGHTBOX =====
(function initLightbox() {
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxTitle   = document.getElementById('lightboxTitle');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  if (!lightbox) return;

  // Open lightbox on eye icon click
  document.querySelectorAll('.project-view').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const img   = this.getAttribute('data-img');
      const title = this.getAttribute('data-title');
      lightboxImg.src       = img;
      lightboxImg.alt       = title;
      lightboxTitle.textContent = title;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close on X button or overlay click
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

// ===== TESTIMONIALS SLIDER =====
(function initTestimonials() {
  const slider   = document.getElementById('testiSlider');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  if (!slider) return;

  const cards = Array.from(slider.querySelectorAll('.testi-card'));
  let current  = 0;
  let perPage  = getPerPage();
  let total    = Math.ceil(cards.length / perPage);
  let autoTimer;

  function getPerPage() {
    if (window.innerWidth <= 640)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    total = Math.ceil(cards.length / perPage);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    current = (index + total) % total;
    const offset = current * perPage;
    cards.forEach((card, i) => {
      const visible = i >= offset && i < offset + perPage;
      card.style.display = visible ? 'flex' : 'none';
      card.style.flexDirection = 'column';
      if (visible) {
        setTimeout(() => card.classList.add('active-testi'), 10);
      } else {
        card.classList.remove('active-testi');
      }
    });
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  }

  function setup() {
    perPage = getPerPage();
    total   = Math.ceil(cards.length / perPage);
    if (current >= total) current = 0;
    buildDots();
    goTo(current);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', resetAuto);

  // Responsive resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 200);
  });

  setup();
})();

// ===== WHATSAPP PRE-FILLED MESSAGE =====
document.querySelectorAll('.wa-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    window.open('https://wa.me/923013301875?text=I%20saw%20your%20portfolio%20and%20want%20to%20contact%20with%20you%20%F0%9F%91%8B%0A%0A*Please%20write%20your%20message%20below%3A*%0A', '_blank');
  });
});
