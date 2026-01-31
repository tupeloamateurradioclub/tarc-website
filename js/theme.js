export function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle?.querySelector('.theme-icon');
  if (!toggle) return;

  const getPreferred = () => {
    const stored = localStorage.getItem('tarc-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tarc-theme', theme);
    if (icon) {
      icon.textContent = theme === 'dark' ? '\u2600' : '\u263D';
    }
    toggle.classList.toggle('active', theme === 'dark');
  };

  apply(getPreferred());

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    apply(current === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('tarc-theme')) {
      apply(e.matches ? 'dark' : 'light');
    }
  });
}
