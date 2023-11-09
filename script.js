const searchInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const image = document.querySelector('.default-icon');

async function getWeather(city) { 
    let currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8a5a53c098309b3a520ec20c32eb71a5&units=metric`);

    // Handling error if city not found.
    if (currentRes.status == 404) {
        document.querySelector('.error').style.display = "block";
        document.querySelector('.celcius').innerHTML = "";
        document.querySelector('.city').innerHTML = "";
        document.querySelector('.HumidityP').innerHTML = "";
        document.querySelector('.WindS').innerHTML =  "";
        image.src = "./snaps/sun.png"

        return -1;
    } else {
        document.querySelector('.error').style.display = "none";

    }
    
    // code to display temp, humidity and wind.
    let currentData = await currentRes.json();
    console.log(currentData);
    const weatherCondition = currentData.weather[0].main;

    document.querySelector('.celcius').innerHTML = Math.round(currentData.main.temp) + "°c";
    document.querySelector('.city').innerHTML = currentData.name;
    document.querySelector('.HumidityP').innerHTML = Math.round(currentData.main.humidity) + "%";
    document.querySelector('.WindS').innerHTML = Math.round(currentData.wind.speed) + "km/h";

    // show icon corresponding with the current weather at that place.
    function setWeatherIcon(condition) {
        const iconMap = {
            "Clouds": "./snaps/cloud.png",
            "Clear": "./snaps/sun.png",
            "Rain": "./snaps/rain.png",
            "Snow": "./snaps/snow.png",
            "Thunderstorm": "./snaps/storm.png",
            "Mist": "./snaps/mist.png",
            "Partly Cloudy": "./snaps/cloudy.png"
        };

        const defaultIcon = "./snaps/default.png"; 

        image.src = iconMap[condition] || defaultIcon;
    }

    setWeatherIcon(weatherCondition);

    // Forecast data for 5 days
    let forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=66db9eb6c7652aa7ba9c63dd9d4d7d1d&units=metric`);
    let forecastData = await forecastRes.json();
    console.log(forecastData);

    const forecastList = forecastData.list;

    // Clear previous forecast data
    const forecastDisplay = document.querySelector('.forecast-data');
    forecastDisplay.innerHTML = '';

    let uniqueDates = {};
    let uniqueDays = [];

    // Loop through the forecast data to collect unique days
    for (let forecast of forecastList) {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleString("en-US", { weekday: "short", year: 'numeric', month: 'numeric', day: 'numeric' });
        
        if (!uniqueDates[day]) {
            uniqueDates[day] = true;
            uniqueDays.push({
                date: day,
                temperature: Math.round(forecast.main.temp) + "°C"
            });
        }
    }

    // Display 5 unique days
    for (let i = 0; i < 5; i++) {
        const forecast = uniqueDays[i];

        // Creating elements for each forecast entry
        const forecastEntry = document.createElement('div');
        forecastEntry.classList.add('forecast-entry');
        forecastEntry.innerHTML = `
            <p>${forecast.date}: ${forecast.temperature}</p>
        `;

        // Appending each forecast entry to the forecast display container
        forecastDisplay.appendChild(forecastEntry);
    }
}

        searchBtn.addEventListener('click', () => {
            getWeather(searchInput.value);
        })