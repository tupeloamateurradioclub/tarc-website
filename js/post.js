import { parseMarkdown, parseFrontMatter } from './markdown.js';

export function initPost() {
  const slug = new URLSearchParams(window.location.search).get('slug');
  const container = document.getElementById('post-content');

  if (!container) return;
  if (!slug) {
    container.innerHTML = '<p class="text-secondary">Post not found.</p>';
    return;
  }

  loadPost(slug, container);
}

async function loadPost(slug, container) {
  try {
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error('Post not found');
    const text = await res.text();
    const { meta, body } = parseFrontMatter(text);
    if (meta.image) meta.image = meta.image.replace(/^\//, '');

    document.title = `${meta.title} — TARC`;

    const imageHtml = meta.image
      ? `<img src="${meta.image}" alt="${meta.title}" style="border-radius: var(--border-radius); margin-bottom: var(--space-lg);" loading="lazy">`
      : '';

    container.innerHTML = `
      <div class="post-card-meta mb-md">${new Date(meta.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <h1>${meta.title}</h1>
      ${imageHtml}
      <div class="mt-lg">${parseMarkdown(body)}</div>
    `;
  } catch (err) {
    container.innerHTML = '<p class="text-secondary">Post not found.</p>';
  }
}
