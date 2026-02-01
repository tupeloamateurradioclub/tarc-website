export function initEasterEgg() {
  let typed = '';
  let clicks = 0;
  let clickTimer = null;
  const SECRET = 'KK5K';
  const CLICKS_NEEDED = 5;
  const CLICK_WINDOW = 2000;

  // Trigger 1: Type "KK5K" anywhere
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    typed += e.key.toUpperCase();
    if (typed.length > 20) typed = typed.slice(-20);
    if (typed.includes(SECRET)) {
      typed = '';
      showEasterEgg();
    }
  });

  // Trigger 2: Click callsign 5 times rapidly
  const callsign = document.querySelector('.navbar-brand .callsign');
  if (callsign) {
    callsign.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clicks++;
      if (clicks === 1) {
        clickTimer = setTimeout(() => { clicks = 0; }, CLICK_WINDOW);
      }
      if (clicks >= CLICKS_NEEDED) {
        clicks = 0;
        clearTimeout(clickTimer);
        showEasterEgg();
      }
    });
  }

  function showEasterEgg() {
    if (document.querySelector('.easter-egg-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'easter-egg-overlay';
    overlay.innerHTML = `
      <div class="easter-egg-modal">
        <img src="images/easter-egg.png" alt="Original TARC logo — KK5K">
        <p>You found the original TARC logo!</p>
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
}
