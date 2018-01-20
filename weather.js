if ("geolocation" in navigator) {
  console.log('geolocation available')
} else {
  alert('Geolocation is not supported in this browser.')
}

const app = {
  main: function() {
    writeLocation();
    writeResponse();
    writePic();
    writeTemp();
    writeHighLow();
    writeHumidity();
    writeWind();
    colorize();
  }
};

const weather = {
  location: document.getElementById('location'),
  description: document.getElementById('description'),
  icon: document.getElementById('icon'),
  temp: document.getElementById('temp'),
  highLow: document.getElementById('high-low'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  fahrenheit: true,
  colors: {
    "Clear": "#07AEE6",
    "Clouds": "#555",
    "Haze": "#A5B3A2",
    "Snow": "#636363",
    "Rain": "#141499"
  }
};

function update() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      app.response = JSON.parse(xhr.response);
      app.main();
    }
  }
  xhr.open("GET", `https://fcc-weather-api.glitch.me/api/current?lat=${(app.position.coords.latitude).toFixed(2)}&lon=${(app.position.coords.longitude).toFixed(2)}`);
  xhr.send();
}

const writeLocation = () => weather.location.innerHTML = `${app.response.name}, ${app.response.sys.country}`;
const writeResponse = () => weather.description.innerHTML = app.response.weather[0].main;
const writePic = () => weather.icon.src = app.response.weather[0].icon;
const writeTemp = () => weather.temp.innerHTML = `Temp: ${detTemp(app.response.main.temp)}&#176; `;
const writeHighLow = () => weather.highLow.innerHTML = `High: ${detTemp(app.response.main.temp_max)}&#176; Low: ${detTemp(app.response.main.temp_min)}&#176;`;
const createSpan = (d) => `<span onclick='convertTemps()' style='cursor:pointer;'>${d}</span>`;
const detTemp = (c) => (weather.fahrenheit) ? `${(c * (9/5) + 32).toFixed(1)} ${createSpan("F")}` : `${c} ${createSpan("C")}`;
const writeHumidity = () => weather.humidity.innerHTML = `Humidity: ${app.response.main.humidity}`;
const writeWind = () => weather.wind.innerHTML = `Wind: ${app.response.wind.speed} mph ${Math.round(app.response.wind.deg)}&#176; ${windDirection(app.response.wind.deg)}`;
const windDirection = (deg) => (deg<22||deg>=337)?"N":(deg<67)?"NE":(deg<112)?"E":(deg<157)?"SE":(deg<202)?"S":(deg<247)?"SW":(deg<292)?"W":(deg<337)?"NW":null;
const colorize = () => document.body.style.backgroundColor = assignColor(weather.colors[app.response.weather[0].main]);

function convertTemps() {
  weather.fahrenheit = ! weather.fahrenheit;
  writeTemp();
  writeHighLow();
}

function assignColor(color) {
  color = color || "purple";
  return color;
}

document.addEventListener("DOMContentLoaded", function(event) {
  navigator.geolocation.getCurrentPosition((p)=>app.position=p)
  navigator.geolocation.watchPosition(() => update(), () => alert('There was an issue determining your location.'))
});
