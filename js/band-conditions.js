const HAMQSL_URL = 'https://www.hamqsl.com/solarxml.php';

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

export async function initBandConditions() {
  const container = document.getElementById('band-conditions');
  if (!container) return;

  try {
    const response = await fetch(HAMQSL_URL);
    const text = await response.text();
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

    renderConditions(data);
  } catch (err) {
    container.innerHTML = '<p class="text-secondary">Unable to load band conditions. Try refreshing the page.</p>';
    console.error('Band conditions error:', err);
  }
}
