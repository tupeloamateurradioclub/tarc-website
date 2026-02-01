const EGGS = [
  {
    keyword: 'KK5K',
    clickSelector: '.navbar-brand .callsign',
    clickCount: 5,
    image: 'images/kk5k.png',
    alt: 'Original TARC logo — KK5K',
    message: 'You found the original TARC logo!'
  },
  {
    keyword: 'CQCQCQ',
    clickSelector: '.ee-footer-callsign',
    clickCount: 5,
    image: 'images/cqcqcq.gif',
    alt: 'CQ CQ CQ',
    message: 'CQ CQ CQ!'
  },
  {
    keyword: 'WJ5K',
    clickSelector: '.ee-seasoned',
    clickCount: 1,
    image: 'images/Rob.jpg',
    alt: 'WJ5K',
    message: 'WJ5K'
  }
];

const CLICK_WINDOW = 2000;

export function initEasterEgg() {
  let typed = '';

  // Keyboard triggers
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    typed += e.key.toUpperCase();
    if (typed.length > 20) typed = typed.slice(-20);
    for (const egg of EGGS) {
      if (typed.includes(egg.keyword)) {
        typed = '';
        showEasterEgg(egg);
        return;
      }
    }
  });

  // Click triggers
  for (const egg of EGGS) {
    const el = document.querySelector(egg.clickSelector);
    if (!el) continue;

    let clicks = 0;
    let timer = null;

    el.style.cursor = 'default';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clicks++;
      if (clicks === 1 && egg.clickCount > 1) {
        timer = setTimeout(() => { clicks = 0; }, CLICK_WINDOW);
      }
      if (clicks >= egg.clickCount) {
        clicks = 0;
        clearTimeout(timer);
        showEasterEgg(egg);
      }
    });
  }
}

function showEasterEgg(egg) {
  if (document.querySelector('.easter-egg-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.innerHTML = `
    <div class="easter-egg-modal">
      <img src="${egg.image}" alt="${egg.alt}">
      <p>${egg.message}</p>
      <span class="easter-egg-dismiss">Click anywhere to close</span>
    </div>
  `;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('visible'));

  overlay.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
  });
}
