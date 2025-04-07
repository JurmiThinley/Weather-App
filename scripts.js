const apiKey = 'YOUR_API_KEY_HERE';
const weatherIcon = document.getElementById("weather-icon");
const locationElement = document.getElementById("location");
const desc = document.querySelector(".desc");
const celsius = document.querySelector(".c");
const fahrenheit = document.querySelector(".f");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

// Fetch weather by coordinates
function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

// Fetch weather by city name
function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

// Common fetch function
function fetchWeather(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = `${data.name}, ${data.sys.country}`;
            desc.textContent = data.weather[0].description;
            celsius.textContent = `${Math.round(data.main.temp)} °C`;
            fahrenheit.textContent = `${Math.round(data.main.temp * 9 / 5 + 32)} °F`;
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
            const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            sunrise.textContent = sunriseTime;
            sunset.textContent = sunsetTime;
        
            // Set background based on time
            setBackgroundByTime(data.dt, data.timezone);
        })
        
        .catch(error => {
            console.error("Error fetching weather data:", error);
            locationElement.textContent = "City not found";
            desc.textContent = "Please try another location.";
            celsius.textContent = "N/A";
            fahrenheit.textContent = "N/A";
            weatherIcon.src = "";
            sunrise.textContent = "N/A";
            sunset.textContent = "N/A";
        });
}

// Geolocation on page load
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        });
    }
});

// Search form event listener
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
        cityInput.value = '';
    }
});
function setBackgroundByTime(timestamp, timezoneOffset) {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    const hours = localTime.getUTCHours(); // Using UTC hours because timestamp includes timezoneOffset

    let period;
    if (hours >= 5 && hours < 11) {
        period = 'morning';
    } else if (hours >= 11 && hours < 17) {
        period = 'day';
    } else if (hours >= 17 && hours < 20) {
        period = 'evening';
    } else {
        period = 'night';
    }

    document.body.className = ''; // Clear previous class
    document.body.classList.add(period);
}
