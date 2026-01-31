export function initTextSize() {
  const toggle = document.getElementById('text-size-toggle');
  if (!toggle) return;

  const apply = (size) => {
    document.documentElement.setAttribute('data-text-size', size);
    localStorage.setItem('tarc-text-size', size);
    toggle.classList.toggle('active', size === 'large');
  };

  const stored = localStorage.getItem('tarc-text-size') || 'normal';
  apply(stored);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-text-size');
    apply(current === 'large' ? 'normal' : 'large');
  });
}
