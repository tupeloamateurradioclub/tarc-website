import { parseMarkdown, parseFrontMatter } from './markdown.js';

const POSTS_DIR = 'posts/';
const POSTS_INDEX = 'posts/index.json';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderBriefPost(post) {
  const imageHtml = post.meta.image
    ? `<img class="post-card-image" src="${post.meta.image}" alt="${post.meta.title}" loading="lazy">`
    : '';

  return `
    <details class="collapsible" open>
      ${imageHtml}
      <summary>
        <span>
          ${post.meta.title}
          <span class="post-card-meta" style="margin-left: var(--space-sm); font-weight: normal;">${formatDate(post.meta.date)}</span>
        </span>
      </summary>
      <div class="collapsible-content">
        ${parseMarkdown(post.body)}
      </div>
    </details>
  `;
}

function renderFullPostCard(post) {
  const imageHtml = post.meta.image
    ? `<img class="post-card-image" src="${post.meta.image}" alt="${post.meta.title}" loading="lazy">`
    : '';

  const excerpt = post.meta.excerpt || post.body.split('\n')[0];

  return `
    <article class="post-card">
      ${imageHtml}
      <div class="post-card-body">
        <div class="post-card-meta">${formatDate(post.meta.date)}</div>
        <h2 class="post-card-title">
          <a href="post.html?slug=${post.slug}">${post.meta.title}</a>
        </h2>
        <p class="post-card-excerpt">${excerpt}</p>
        <a href="post.html?slug=${post.slug}" class="read-more">Read more &rarr;</a>
      </div>
    </article>
  `;
}

async function loadAllPosts() {
  const response = await fetch(POSTS_INDEX);
  if (!response.ok) throw new Error('No posts index found');
  const postFiles = await response.json();
  if (!postFiles.length) return [];

  const posts = await Promise.all(
    postFiles.map(async (filename) => {
      const res = await fetch(POSTS_DIR + filename);
      const text = await res.text();
      const { meta, body } = parseFrontMatter(text);
      if (meta.image) meta.image = meta.image.replace(/^\//, '');
      const slug = filename.replace('.md', '');
      return { meta, body, slug, filename };
    })
  );

  posts.sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));
  return posts;
}

export async function initPosts() {
  const newsContainer = document.getElementById('posts-container');
  const pjContainer = document.getElementById('papajacks-post');

  if (!newsContainer && !pjContainer) return;

  try {
    const posts = await loadAllPosts();

    // Render news page
    if (newsContainer) {
      const newsPosts = posts;
      if (newsPosts.length) {
        newsContainer.innerHTML = newsPosts.map(post => {
          if (post.meta.type === 'brief') return renderBriefPost(post);
          return renderFullPostCard(post);
        }).join('');
      } else {
        newsContainer.innerHTML = '<p class="text-secondary">No posts yet. Check back soon!</p>';
      }
    }

    // Render latest Papa Jack's post
    if (pjContainer) {
      const pjPost = posts.find(p => p.meta.type === 'papajacks');
      if (pjPost) {
        pjContainer.innerHTML = renderFullPostCard(pjPost);
      }
    }

  } catch (err) {
    if (newsContainer) newsContainer.innerHTML = '<p class="text-secondary">No posts yet. Check back soon!</p>';
    console.error('Posts error:', err);
  }
}
