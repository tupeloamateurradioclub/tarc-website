import { initTheme } from './theme.js';
import { initTextSize } from './text-size.js';
import { initBandConditions } from './band-conditions.js';
import { initPosts } from './posts.js';
import { initEasterEgg } from './easter-egg.js';

// Initialize core features
initTheme();
initTextSize();
initBandConditions();
initPosts();
initEasterEgg();

// Hamburger menu toggle
const hamburger = document.querySelector('.navbar-hamburger');
const navMenu = document.querySelector('.navbar-nav');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
