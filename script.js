const apiKey = "fa6eb14e1fbb21a9c7d653da083d9966"; // آپ کی کنفرم شدہ کی

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data.cod === 200 ? `${data.main.temp}°C - ${data.weather[0].main}` : "Weather Error";
    } catch {
        return "N/A";
    }
}

async function addCity() {
    const city = document.getElementById('citySelect').value;
    const container = document.getElementById('clockContainer');
    
    const weather = await fetchWeather(city);
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <span class="delete-btn" onclick="this.parentElement.remove()">×</span>
        <div style="text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${city}</div>
        <div class="time" id="time-${city}">00:00:00</div>
        <div class="weather">🌡️ ${weather}</div>
    `;
    
    container.appendChild(card);
    updateTime(city);
}

function updateTime(city) {
    setInterval(() => {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        // یہاں آپ ٹائم زون بھی سیٹ کر سکتے ہیں، فی الحال یہ لوکل ٹائم دکھائے گا
        const timeString = new Date().toLocaleTimeString('en-US', options);
        const element = document.getElementById(`time-${city}`);
        if(element) element.innerText = timeString;
    }, 1000);
}

// ابتدائی طور پر کراچی اور لندن دکھانے کے لیے
window.onload = () => {
    document.getElementById('citySelect').value = "Karachi";
    addCity();
};
