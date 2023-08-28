const apiKey = '615c1500bfb0d331cf2e02a8e6d9219d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const apiURL2 = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&q=';

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const daySection = document.querySelector('.day-section');

const iconToImage = {
    '01d': 'clear_day',
    '01n': 'clear_night',
    '02d': 'clouds_day',
    '02n': 'clouds_night',
    '03d': 'clouds_day',
    '03n': 'clouds_night',
    '04d': 'clouds_day',
    '04n': 'clouds_night',
    '09d': 'rain_day',
    '09n': 'rain_night',
    '10d': 'rain_day',
    '10n': 'rain_night',
    '11d': 'thunderstorm_day',
    '11n': 'thunderstorm_night',
    '13d': 'snow_day',
    '13n': 'snow_night',
    '50d': 'mist_day',
    '50n': 'mist_night',
};


async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const response2 = await fetch(apiURL2 + city + `&appid=${apiKey}`);
    
    if (response.status && response2.status == 404) {
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.Weather').style.display = 'none';
    } else {
        let data = await response.json();
        let data2 = await response2.json();

        console.log(data)

        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
        document.querySelector('.wind').innerHTML = data.wind.speed + 'km/h';

        weatherIcon.src = getWeatherIconUrl(data.weather[0].icon);

        document.querySelector('.Weather').style.display = 'block';
        document.querySelector('.error').style.display = 'none';
        document.querySelector('.day-section').style.display = 'flex';
        
        daySection.innerHTML = '';

        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const daysToShow = 7;
        let daysCount = 0;

        const tempDataByDay = {};

        data2.list.forEach(item => {
            const forecastDateTime = new Date(item.dt_txt);
            const dayOfWeekIndex = forecastDateTime.getDay();
            const dayOfWeek = daysOfWeek[dayOfWeekIndex];
            const temp = Math.round(item.main.temp);
            let iconCode = item.weather[0].icon;
            if (dayOfWeek === 'Sábado' && iconCode.endsWith('n')) {
                iconCode = iconCode.replace('n', 'd');
            }
        
            if (!tempDataByDay[dayOfWeek]) {
                tempDataByDay[dayOfWeek] = {
                    minTemp: temp,
                    maxTemp: temp,
                    iconCode: iconCode,
                };
            } else {
                if (temp < tempDataByDay[dayOfWeek].minTemp) {
                    tempDataByDay[dayOfWeek].minTemp = temp;
                }
                if (temp > tempDataByDay[dayOfWeek].maxTemp) {
                    tempDataByDay[dayOfWeek].maxTemp = temp;
                    tempDataByDay[dayOfWeek].iconCode = iconCode;
                }
            }
        });

        for (const dayOfWeek in tempDataByDay) {
            const { minTemp, maxTemp, iconCode } = tempDataByDay[dayOfWeek];

            const dayCard = document.createElement('div');
            dayCard.classList.add('day-card', dayOfWeek.toLowerCase());

            dayCard.innerHTML = `
                <img src="images/${iconToImage[iconCode]}.png" class="weather-icon" />
                <div class="day-card-day">${dayOfWeek}</div>
                <div>
                    <span class="temp-min">${minTemp}°C</span>
                    <span class="temp-max">${maxTemp}°C</span>
                </div>
                `;

            if (minTemp !== maxTemp) {
                dayCard.querySelector('.temp-min').style.color = '#fff';
            }

            daySection.appendChild(dayCard);
        }
    }
}

searchBox.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        checkWeather(searchBox.value);
    }
});


searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value);
});

function getWeatherIconUrl(iconCode) {
    return `public/images/${iconToImage[iconCode]}.png`;
}
