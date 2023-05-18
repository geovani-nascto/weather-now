const localSearchInput = document.getElementById('input-local-search');
const buttonLocalSearch = document.getElementById('btn-local-search');

const currentDate = document.getElementById('current-date');
const currentLocal = document.getElementById('current-local');
const currentWeather = document.getElementById('current-weather');
const currentTemperature = document.getElementById('current-temperature-celsius');
const weatherIcon = document.getElementById('weather-icon')

const windSpeed = document.getElementById('wind-speed');
const feelsLikeTemperature = document.getElementById('feels-like-temperature');
const currentHumidity = document.getElementById('current-humidity');
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');
const apiKey = 'ddc1fd55d529ed5072927d0c0c03df6e';


buttonLocalSearch.addEventListener('click', () => {
    //Fazer parte do enter tbm
    let cityName = localSearchInput.value;
    getCityWeather(cityName);
    localSearchInput.value = "";
})


localSearchInput.addEventListener('keyup', enterKey);

navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude
    getCurrentLocationWeather(lat, lon);
},
(err) => {
    if(err.code === 1){
        alert("Geolocalização negada pelo usuário, busque manualmente por uma cidade pela barra de pesquisa")
    } else{
        console.log(err);
    }
}
)

function getCurrentLocationWeather(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => displayWeather(data));
}

function getCityWeather(cityName){
    weatherIcon.src = `/assets/img/loading-icon.svg`

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => displayWeather(data));
}

function displayWeather(data){
    //console.log(data.base)
    let {
        dt,
        name,
        weather: [{icon, description}],
        main: {temp, feels_like, humidity},
        wind: {speed},
        sys: {sunrise, sunset},
    } = data;

    currentDate.innerText = formatDate(dt);
    currentLocal.textContent = name;
    weatherIcon.src = `../assets/img/${icon}.svg`
    currentWeather.textContent = firstUpperCase(description);
    currentTemperature.textContent = `${Math.round(temp)}°C`;
    windSpeed.textContent = `${Math.round(speed * 3.6)}km`;
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}°C`;
    currentHumidity.textContent = `${humidity}%`;
    sunriseTime.textContent = formatTime(sunrise);
    sunsetTime.textContent = formatTime(sunset);
}

function formatDate(epochTime){
    let date = new Date(epochTime * 1000);
    let formattedDate = date.toLocaleDateString('pt-br', {month: 'long', day: 'numeric'});
    return `Hoje, ${formattedDate}`;
}

function formatTime(epochTime){
    let date = new Date(epochTime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours}:${minutes}`;
}

function firstUpperCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

 function enterKey(event){
     if(event.key === 'Enter'){
         let cityName = localSearchInput.value;
         getCityWeather(cityName);
         console.log(cityName)

         localSearchInput.value = "";
     }
 }