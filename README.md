# TARC — Tupelo Amateur Radio Club Website

Static website for the Tupelo Amateur Radio Club (K5TUP), hosted on GitHub Pages.

## Quick Start

1. Clone the repo
2. Run `python3 -m http.server` in the project root
3. Open `http://localhost:8000`

No build tools, no npm, no dependencies. Just static files.

---

## Site Structure

| Page | File | Description |
|------|------|-------------|
| News (home) | `index.html` | Landing page — latest posts, meeting banner |
| About | `about.html` | Club info, officers, history |
| Resources | `resources.html` | Band conditions, repeaters, nets, links |
| Contact | `contact.html` | Email, mailing address, how to join |
| Post (single) | `post.html` | Template for full-length posts |
| CMS Admin | `admin/index.html` | Decap CMS content editor |

## File Structure

```
TARCsite/
├── index.html              # News / landing page
├── about.html              # About page
├── resources.html          # Resources page
├── contact.html            # Contact page
├── post.html               # Single post template
├── admin/
│   ├── index.html          # Decap CMS admin UI
│   └── config.yml          # CMS configuration
├── css/
│   ├── variables.css       # Theme colors, spacing, fonts (edit this for theming)
│   ├── base.css            # Reset, base typography
│   ├── layout.css          # Page grid, containers
│   ├── components.css      # Navbar, cards, collapsibles, band widget
│   └── utilities.css       # Large-text overrides, helper classes
├── js/
│   ├── main.js             # Entry point — imports and initializes all modules
│   ├── theme.js            # Dark/light mode toggle
│   ├── text-size.js        # Large text mode toggle
│   ├── band-conditions.js  # HamQSL solar data widget
│   ├── posts.js            # Loads and renders Markdown posts
│   └── markdown.js         # Lightweight Markdown-to-HTML parser
├── posts/
│   ├── index.json          # List of post filenames (newest first)
│   └── *.md                # Post files (Markdown with front matter)
├── images/
│   └── uploads/            # Images uploaded via CMS
└── README.md
```

## How-To Guides

### Writing a Post (Decap CMS)

1. Go to `https://yoursite.com/admin/`
2. Log in with your GitHub account
3. Click **Posts → New Post**
4. Fill in the fields:
   - **Title**: Post title
   - **Date**: Publication date
   - **Post Type**: `brief` (inline expandable) or `full` (own page with preview card)
   - **Excerpt**: Preview text for full posts (optional)
   - **Featured Image**: Upload an image for full posts (optional)
   - **Body**: Write your content in the editor
5. Click **Publish**

The CMS commits the Markdown file to the `posts/` directory in your GitHub repo.

**Important:** After publishing via CMS, you must add the new filename to `posts/index.json` manually (in the GitHub web editor or locally). List newest files first.

### Writing a Post (Manually)

1. Create a new file in `posts/` named `YYYY-MM-DD-your-slug.md`
2. Add front matter at the top:

```yaml
---
title: "Your Post Title"
date: "2025-02-15"
type: "full"           # or "brief"
excerpt: "Preview text shown on News page"  # optional, for full posts
image: "images/uploads/photo.jpg"           # optional
---

Your post content in Markdown here.
```

3. Add the filename to `posts/index.json` (newest first)
4. Commit and push

### Adding a New Page

1. Copy any existing page (e.g., `about.html`)
2. Update the `<title>` and `<meta name="description">`
3. Change the `class="active"` in the navbar to your new page's link
4. Add a new `<li>` to the navbar `<ul class="navbar-nav">` in **every** HTML file
5. Replace the `<main>` content with your new page content
6. Use `<details class="collapsible" open>` for sections to maintain consistency

### Adding a Collapsible Section

Add this HTML anywhere in a page's content area:

```html
<details class="collapsible" open>
  <summary>Section Title</summary>
  <div class="collapsible-content">
    <p>Your content here.</p>
  </div>
</details>
```

Remove `open` to start collapsed.

### Adding a New CSS Module

1. Create a new file in `css/` (e.g., `css/my-feature.css`)
2. Add a `<link rel="stylesheet" href="css/my-feature.css">` to every HTML page's `<head>`, after `utilities.css`
3. Use existing CSS variables from `variables.css` for colors, spacing, and fonts

### Adding a New JS Module

1. Create a new file in `js/` (e.g., `js/my-feature.js`)
2. Export an init function: `export function initMyFeature() { ... }`
3. Import and call it in `js/main.js`:
   ```javascript
   import { initMyFeature } from './my-feature.js';
   initMyFeature();
   ```

## Theming

All theme values live in `css/variables.css`. To change colors, spacing, or font sizes, edit the CSS custom properties there. The file has three sections:

- `:root` — light mode (default) + shared values
- `[data-theme="dark"]` — dark mode overrides
- `[data-text-size="large"]` — large text overrides

Changes here cascade everywhere automatically.

## Dark Mode

- Auto-detects OS preference on first visit
- Manual toggle in navbar (moon/sun icon)
- Preference saved in localStorage (`tarc-theme`)
- Implemented via `data-theme` attribute on `<html>`

## Large Text Mode

- Toggle in navbar ("Aa" button)
- Increases base font from 16px to 22px
- Increases line height, letter spacing, and tap target sizes
- Preference saved in localStorage (`tarc-text-size`)
- Implemented via `data-text-size` attribute on `<html>`

## Band Conditions Widget

- Located on the Resources page
- Fetches live data from [HamQSL Solar XML](https://www.hamqsl.com/solarxml.php)
- Displays: SFI, Sunspot Number, A-Index, K-Index, and band-by-band conditions
- Color-coded: green (good), yellow (fair), red (poor)
- If the feed is unavailable, shows a graceful error message

## Deployment

This site is designed for GitHub Pages:

1. Push the repo to GitHub
2. Go to repo **Settings → Pages**
3. Set source to **main branch**, root directory
4. The site will be live at `https://username.github.io/repo-name/`

To use a custom domain (e.g., tupeloarc.org):
1. Add a `CNAME` file to the repo root containing your domain
2. Configure DNS with your domain registrar (CNAME to `username.github.io`)
3. Enable HTTPS in GitHub Pages settings

## Decap CMS Setup (One-Time)

1. Update `admin/config.yml` — set `repo` to your GitHub repo path (e.g., `k5tup/tarc-website`)
2. Register your site with [Decap CMS OAuth](https://decapcms.org/docs/github-backend/) or use the [Netlify Identity](https://decapcms.org/docs/add-to-your-site/#authentication) method for authentication
3. Alternatively, for simple setups, use the `git-gateway` backend with Netlify

---

Built with plain HTML, CSS, and JavaScript. No frameworks. No build tools. Fast and simple.
