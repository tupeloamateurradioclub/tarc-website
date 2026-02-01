# TARC — Tupelo Amateur Radio Club Website

Static website for the Tupelo Amateur Radio Club (K5TUP), hosted on GitHub Pages.

**Live site:** https://k5tup.org

## Quick Start (Local Development)

1. Clone the repo
2. Run `python3 -m http.server` in the project root
3. Open `http://localhost:8000`

No build tools, no npm, no dependencies. Just static files.

---

## Site Structure

| Page | File | Description |
|------|------|-------------|
| News (home) | `index.html` | Landing page with welcome card and latest posts |
| About | `about.html` | Club info and history |
| Resources | `resources.html` | Band conditions, repeaters, nets, links |
| Calendar | `calendar.html` | Embedded Google Calendar with club events |
| Papa Jack's | `papajacks.html` | Annual Papa Jack's Trade Day event info |
| Contact | `contact.html` | Facebook, meetings, email info cards |
| Band Help | `band-help.html` | Guide to solar indices and propagation data |
| Post (single) | `post.html` | Template for full-length posts |
| CMS Admin | `admin/index.html` | Sveltia CMS content editor |

## File Structure

```
TARCsite/
├── index.html              # News / landing page
├── about.html              # About page
├── resources.html          # Resources page
├── calendar.html           # Calendar page (Google Calendar embed)
├── papajacks.html          # Papa Jack's Trade Day page
├── contact.html            # Contact page
├── post.html               # Single post template
├── band-help.html          # Band conditions educational guide
├── CNAME                   # Custom domain (k5tup.org)
├── .nojekyll               # Prevents GitHub Pages Jekyll processing
├── admin/
│   ├── index.html          # Sveltia CMS admin UI
│   └── config.yml          # CMS configuration
├── css/
│   ├── variables.css       # Theme colors, spacing, fonts (edit this for theming)
│   ├── base.css            # Reset, base typography
│   ├── layout.css          # Page grid, containers
│   ├── components.css      # Navbar, cards, collapsibles, band widget, calendar
│   └── utilities.css       # Large-text overrides, helper classes
├── js/
│   ├── main.js             # Entry point — imports and initializes all modules
│   ├── theme.js            # Dark/light mode toggle
│   ├── text-size.js        # Large text mode toggle
│   ├── band-conditions.js  # HamQSL solar data widget
│   ├── posts.js            # Loads and renders Markdown posts
│   ├── markdown.js         # Lightweight Markdown-to-HTML parser
│   └── easter-egg.js       # Hidden easter eggs
├── posts/
│   ├── index.json          # Auto-generated list of post files (do not edit manually)
│   └── *.md                # Post files (Markdown with front matter)
├── images/
│   └── uploads/            # Images uploaded via CMS (auto-optimized)
├── .github/
│   └── workflows/
│       ├── update-posts-index.yml  # Auto-updates posts/index.json
│       └── optimize-images.yml     # Auto-optimizes uploaded images
└── README.md
```

---

## Creating Posts

### Using the CMS (Recommended)

1. Go to https://k5tup.org/admin/
2. Click **Sign in with GitHub** and authorize the app
3. Click **Posts → New Post**
4. Fill in the fields:
   - **Title**: Post headline
   - **Date**: Publication date
   - **Post Type**: `brief` (inline expandable on News page) or `full` (own page with preview card)
   - **Excerpt**: Preview text shown on the News page (optional, for full posts)
   - **Featured Image**: Header image for the post (optional)
   - **Body**: Write your content — you can add images, links, bold, italic, lists, etc.
5. Click **Publish**

That's it. The post appears on the site automatically. A GitHub Action updates the post index whenever a new post is committed.

### Using GitHub Directly

1. Go to the repo on GitHub and navigate to the `posts/` folder
2. Click **Add file → Create new file**
3. Name it `YYYY-MM-DD-your-slug.md` (e.g., `2026-02-15-field-day-recap.md`)
4. Add front matter and content:

```yaml
---
title: "Your Post Title"
date: 2026-02-15
type: full
excerpt: "Preview text shown on the News page."
image: ""
---

Your post content in Markdown here.

Add images with ![description](images/uploads/photo.jpg)
```

5. Commit the file. The GitHub Action auto-updates `posts/index.json` — no manual editing needed.

### Post Types

- **Brief posts** (`type: brief`): Appear directly on the News page as expandable sections. Good for short announcements, meeting reminders, quick updates.
- **Full posts** (`type: full`): Show a preview card on the News page with a "Read more" link to a dedicated page. Good for longer articles, event recaps, photos.

Both types support an optional featured image.

---

## Components

### Info Cards

Reusable cards used across the site (News welcome card, Contact page). Two variants:

- **`.info-card`** — Accent-colored background with white text. Good for standout CTAs.
- **`.info-card .info-card-light`** — Surface background with accent headings. Good for stacking multiple cards.

```html
<div class="info-card info-card-light">
  <h3>Card Title</h3>
  <p>Card content here.</p>
</div>
```

### Collapsible Sections

```html
<details class="collapsible" open>
  <summary>Section Title</summary>
  <div class="collapsible-content">
    <p>Your content here.</p>
  </div>
</details>
```

Remove `open` to start collapsed.

---

## Calendar

The Calendar page embeds a Google Calendar iframe. Events are managed entirely through Google Calendar — no code changes needed to add, edit, or remove events. The calendar displays in month view in the America/Chicago timezone.

---

## Band Conditions Widget

Located on the **Resources** page. Fetches live solar data from [HamQSL](https://www.hamqsl.com/solarxml.php) (N0NBH).

### Custom View (default)
- **Solar indices**: SFI, Sunspot Number, A-Index, K-Index, X-Ray flux, Bz (IMF), Solar Wind, Signal Noise
- **Geomagnetic field status**: Color-coded badge (green = quiet, yellow = unsettled, red = storm)
- **SDO solar corona image**: Live image from NASA's Solar Dynamics Observatory
- **HF band conditions table**: Day and night ratings for 80m-40m, 30m-20m, 17m-15m, 12m-10m
- **VHF conditions**: E-Skip (North America) and Aurora status

### Classic View
- The traditional N0NBH solar widget image from hamqsl.com

### Controls
- **Refresh**: Re-fetches the latest data
- **Classic Widget / Custom View**: Toggles between views (preference saved)
- **Help**: Links to `band-help.html` — a guide explaining every index and what it means for operating

Data is fetched via a CORS proxy (allorigins.win) with a fallback to direct fetch. If all attempts fail, the widget falls back to the classic image view.

---

## Theming

All theme values live in `css/variables.css`. Edit the CSS custom properties there to change colors, spacing, or font sizes. The file has three sections:

- `:root` — light mode (default) + shared values (spacing, typography, layout)
- `[data-theme="dark"]` — dark mode color overrides
- `[data-text-size="large"]` — large text overrides

Changes cascade everywhere automatically.

### Dark Mode
- Auto-detects OS preference on first visit
- Manual toggle in navbar (moon/sun icon)
- Saved in localStorage (`tarc-theme`)

### Large Text Mode
- Toggle in navbar ("Aa" button)
- Increases base font from 16px to 22px with proportional scaling
- Increases line height, letter spacing, and tap target sizes
- Saved in localStorage (`tarc-text-size`)

---

## Adding Pages and Sections

### Adding a New Page

1. Copy any existing page (e.g., `about.html`)
2. Update the `<title>` and `<meta name="description">`
3. Move `class="active"` in the navbar to your new page's link
4. Add a `<li>` to the navbar `<ul class="navbar-nav">` in **every** HTML file
5. Replace the `<main>` content

### Adding a CSS Module

1. Create a new file in `css/` (e.g., `css/my-feature.css`)
2. Add `<link rel="stylesheet" href="css/my-feature.css">` to every HTML page's `<head>`, after `utilities.css`
3. Use existing CSS variables from `variables.css` for colors, spacing, and fonts

### Adding a JS Module

1. Create a new file in `js/` (e.g., `js/my-feature.js`)
2. Export an init function: `export function initMyFeature() { ... }`
3. Import and call it in `js/main.js`:
   ```javascript
   import { initMyFeature } from './my-feature.js';
   initMyFeature();
   ```

---

## Deployment

The site runs on GitHub Pages with a custom domain:

- **Domain:** k5tup.org
- **Registrar:** Namecheap
- **HTTPS:** Enforced via GitHub Pages

DNS is configured with four A records pointing to GitHub's IPs (`185.199.108-111.153`) and a CNAME for `www` pointing to `tupeloamateurradioclub.github.io`. The `CNAME` file in the repo root tells GitHub Pages to serve the site at `k5tup.org`.

## CMS Setup (One-Time, Already Done)

The site uses **Sveltia CMS** — a browser-based Git CMS that authenticates directly with GitHub (no external OAuth server needed).

Setup steps (already completed for this site):
1. Registered a GitHub OAuth App under the organization
2. Set the callback URL to the `/admin/` path
3. Added the OAuth App's Client ID as `app_id` in `admin/config.yml`
4. Sveltia CMS script loaded in `admin/index.html`

If the OAuth App needs to be recreated:
1. Go to **GitHub → Organization Settings → Developer Settings → OAuth Apps**
2. Create a new app with callback URL: `https://k5tup.org/admin/`
3. Copy the Client ID into `admin/config.yml` under `backend.app_id`

## GitHub Actions

### Auto-Update Posts Index

The workflow at `.github/workflows/update-posts-index.yml` automatically regenerates `posts/index.json` whenever `.md` files are added, changed, or deleted in the `posts/` folder. This means:

- Publishing via the CMS → index is updated automatically
- Creating a post file on GitHub → index is updated automatically
- Deleting a post → index is updated automatically
- **Nobody ever needs to edit `posts/index.json` manually**

### Auto-Optimize Images

The workflow at `.github/workflows/optimize-images.yml` runs whenever images are added to `images/uploads/`. It automatically:

- Resizes images to a max width of 1200px
- Strips EXIF/GPS metadata (for privacy)
- Compresses JPEGs to quality 85 and optimizes PNGs
- Tracks processed files in `.optimized` to avoid reprocessing

---

Built with plain HTML, CSS, and JavaScript. No frameworks. No build tools. Fast and simple.
