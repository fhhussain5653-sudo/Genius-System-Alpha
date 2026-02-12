const popularTimezones = [
    'Local', 'Asia/Karachi', 'Asia/Dubai', 'Europe/London', 
    'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'
];

const clocksContainer = document.getElementById('clocks');
const tzSelect = document.getElementById('tz-select');

// Populate Dropdown
popularTimezones.forEach(tz => {
    const opt = document.createElement('option');
    opt.value = tz;
    opt.textContent = tz;
    tzSelect.appendChild(opt);
});

function updateClocks() {
    const cards = document.querySelectorAll('.card');
    const now = new Date();

    cards.forEach(card => {
        const tz = card.dataset.timezone;
        const timeEl = card.querySelector('.time');
        const dateEl = card.querySelector('.date');

        const options = {
            timeZone: tz === 'Local' ? undefined : tz,
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true
        };

        const dateOptions = {
            timeZone: tz === 'Local' ? undefined : tz,
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
        };

        timeEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
        dateEl.textContent = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    });
}

function addClock() {
    const tz = tzSelect.value;
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.timezone = tz;
    card.innerHTML = `
        <div class="tz-name">${tz.replace('_', ' ')}</div>
        <div class="time">00:00:00</div>
        <div class="date">Loading...</div>
        <button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    clocksContainer.appendChild(card);
    updateClocks();
}

// Initial Call & Interval
setInterval(updateClocks, 1000);
document.getElementById('add-btn').onclick = addClock;

// Add local clock by default
window.onload = () => {
    tzSelect.value = 'Local';
    addClock();
    tzSelect.value = 'Asia/Karachi';
    addClock();
};
})();
