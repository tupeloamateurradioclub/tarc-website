const HAMQSL_URL = 'https://www.hamqsl.com/solarxml.php';
const FETCH_URLS = [
  `https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.hamqsl.com/solarxml.php')}`,
  'https://www.hamqsl.com/solarxml.php'
];

function conditionClass(condition) {
  const c = condition.toLowerCase();
  if (c === 'good') return 'condition-good';
  if (c === 'fair') return 'condition-fair';
  return 'condition-poor';
}

function renderConditions(data) {
  const container = document.getElementById('band-conditions');
  if (!container) return;

  container.innerHTML = `
    <div class="band-solar-indices">
      <div class="solar-index">
        <span class="solar-index-label">SFI</span>
        <span class="solar-index-value">${data.sfi}</span>
      </div>
      <div class="solar-index">
        <span class="solar-index-label">SN</span>
        <span class="solar-index-value">${data.sn}</span>
      </div>
      <div class="solar-index">
        <span class="solar-index-label">A-Index</span>
        <span class="solar-index-value">${data.aindex}</span>
      </div>
      <div class="solar-index">
        <span class="solar-index-label">K-Index</span>
        <span class="solar-index-value">${data.kindex}</span>
      </div>
    </div>
    <table class="band-table">
      <thead>
        <tr>
          <th>Band</th>
          <th>Day</th>
          <th>Night</th>
        </tr>
      </thead>
      <tbody>
        ${data.bands.map(b => `
          <tr>
            <td>${b.name}</td>
            <td><span class="condition-badge ${conditionClass(b.day)}">${b.day}</span></td>
            <td><span class="condition-badge ${conditionClass(b.night)}">${b.night}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="band-updated text-secondary">Updated: ${data.updated}</p>
  `;
}

function renderFallbackWidget(container) {
  container.innerHTML = `
    <div class="band-fallback">
      <a href="https://www.hamqsl.com/solar.html" target="_blank" rel="noopener">
        <img src="https://www.hamqsl.com/solar101vhfpic.php" alt="Solar-Terrestrial Data and Band Conditions" loading="lazy" style="width: 100%; max-width: 468px; border-radius: var(--border-radius-sm);">
      </a>
      <p class="text-secondary" style="margin-top: var(--space-sm); font-size: var(--font-size-sm);">
        Solar data provided by N0NBH — <a href="https://www.hamqsl.com/solar.html" target="_blank" rel="noopener">hamqsl.com</a>
      </p>
    </div>
  `;
}

function parseXML(text) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');

  const solar = xml.querySelector('solardata');
  if (!solar) throw new Error('No solar data found');

  const data = {
    sfi: solar.querySelector('solarflux')?.textContent || '—',
    sn: solar.querySelector('sunspots')?.textContent || '—',
    aindex: solar.querySelector('aindex')?.textContent || '—',
    kindex: solar.querySelector('kindex')?.textContent || '—',
    updated: solar.querySelector('updated')?.textContent || '—',
    bands: []
  };

  const bandNodes = solar.querySelectorAll('calculatedconditions band');
  bandNodes.forEach(band => {
    const name = band.getAttribute('name');
    const time = band.getAttribute('time');
    const condition = band.textContent;

    let existing = data.bands.find(b => b.name === name);
    if (!existing) {
      existing = { name, day: '—', night: '—' };
      data.bands.push(existing);
    }
    if (time === 'day') existing.day = condition;
    if (time === 'night') existing.night = condition;
  });

  return data;
}

async function fetchBandConditions() {
  const container = document.getElementById('band-conditions');
  if (!container) return;

  // Try CORS proxy first (needed on live site), then direct (works on localhost)
  for (const url of FETCH_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const text = await response.text();
      if (!text.includes('<solardata>')) continue;
      const data = parseXML(text);
      renderConditions(data);
      return;
    } catch (err) {
      continue;
    }
  }

  // All fetch attempts failed — fall back to the N0NBH image widget
  renderFallbackWidget(container);
}

export async function initBandConditions() {
  const container = document.getElementById('band-conditions');
  if (!container) return;

  await fetchBandConditions();

  // Wire up refresh button
  const refreshBtn = document.getElementById('band-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('spinning');
      container.innerHTML = '<p class="text-secondary">Refreshing...</p>';
      await fetchBandConditions();
      refreshBtn.classList.remove('spinning');
    });
  }
}
