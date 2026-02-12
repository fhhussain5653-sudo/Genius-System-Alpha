// Multi Time Zone Digital Clock
(() => {
  // Popular timezone list (IANA names)
  const popular = [
    'Local',
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const tzSelect = document.getElementById('tz-select');
  const clocksRoot = document.getElementById('clocks');
  const addBtn = document.getElementById('add-btn');
  const formatToggle = document.getElementById('format-toggle');

  // Maintain a map of timezone -> element
  const clocks = new Map();

  // Populate select
  for (const tz of popular) {
    const opt = document.createElement('option');
    opt.value = tz;
    opt.textContent = tz;
    tzSelect.appendChild(opt);
  }

  // Helpers to format time & date
  function getTimeParts(now, tz, use12Hour) {
    // if tz === 'Local' don't set timeZone option (use local)
    const optionsTime = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !!use12Hour,
    };
    const optionsDate = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    try {
      const timeFormatter = tz === 'Local'
        ? new Intl.DateTimeFormat(undefined, optionsTime)
        : new Intl.DateTimeFormat(undefined, {...optionsTime, timeZone: tz});

      const dateFormatter = tz === 'Local'
        ? new Intl.DateTimeFormat(undefined, optionsDate)
        : new Intl.DateTimeFormat(undefined, {...optionsDate, timeZone: tz});

      const timeStr = timeFormatter.format(now);
      const dateStr = dateFormatter.format(now);
      return {timeStr, dateStr};
    } catch (e) {
      // invalid time zone
      return null;
    }
  }

  function createClockCard(tz) {
    const card = document.createElement('article');
    card.className = 'card';
    const row1 = document.createElement('div');
    row1.className = 'row';

    const name = document.createElement('div');
    name.className = 'tz-name';
    name.textContent = tz === 'Local' ? `${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local (system)'} (Local)` : tz;

    const timeEl = document.createElement('div');
    timeEl.className = 'time';
    timeEl.textContent = '--:--:--';

    row1.appendChild(name);
    row1.appendChild(timeEl);

    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = '';

    const actions = document.createElement('div');
    actions.className = 'actions';
    const remove = document.createElement('button');
    remove.className = 'remove-btn';
    remove.textContent = 'Remove';
    remove.title = 'Remove this timezone';
    remove.addEventListener('click', () => {
      clocksRoot.removeChild(card);
      clocks.delete(tz);
    });

    actions.appendChild(remove);

    card.appendChild(row1);
    card.appendChild(dateEl);
    card.appendChild(actions);

    return {card, timeEl, dateEl, name};
  }

  function addTimezone(tz) {
    if (clocks.has(tz)) return;
    // validate timezone by attempting to format
    const test = getTimeParts(new Date(), tz, formatToggle.checked);
    if (!test) {
      alert(`Invalid timezone: ${tz}`);
      return;
    }
    const {card, timeEl, dateEl, name} = createClockCard(tz);
    clocksRoot.appendChild(card);
    clocks.set(tz, {card, timeEl, dateEl, name});
  }

  // Initialize defaults
  addTimezone('Local');
  addTimezone('UTC');
  addTimezone('America/New_York');
  addTimezone('Europe/London');
  addTimezone('Asia/Tokyo');

  // Tick/update loop
  function updateAll() {
    const now = new Date();
    const use12Hour = formatToggle.checked;
    clocks.forEach((entry, tz) => {
      const parts = getTimeParts(now, tz, use12Hour);
      if (!parts) {
        entry.timeEl.textContent = 'Invalid TZ';
        entry.dateEl.textContent = '';
        return;
      }
      entry.timeEl.textContent = parts.timeStr;
      entry.dateEl.textContent = parts.dateStr;
    });
  }

  // Update immediately and then every 1s
  updateAll();
  setInterval(updateAll, 1000);

  // Events
  addBtn.addEventListener('click', () => {
    const tz = tzSelect.value.trim();
    if (!tz) return;
    addTimezone(tz);
  });

  // Allow adding arbitrary timezone via enter (in case user pastes name)
  tzSelect.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBtn.click();
    }
  });

  // When toggling format update immediately
  formatToggle.addEventListener('change', () => updateAll());

})();