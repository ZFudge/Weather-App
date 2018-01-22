("geolocation" in navigator) ? console.log('geolocation available') : alert('Geolocation is not supported in this browser.');

document.addEventListener("DOMContentLoaded", function(event) {
  navigator.geolocation.getCurrentPosition((pos) => app.position = pos);
  navigator.geolocation.watchPosition(() => update(), () => alert('There was an issue determining your location.'));
});

const app = {
  main: function() {
    sections.location();
    sections.description();
    sections.img();
    sections.temp();
    sections.highLow();
    sections.humidity();
    sections.wind();
    sections.colorize();
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
    "Snow": "#333",
    "Rain": "#141499"
  }
};

const sections = {
  location: () => weather.location.innerHTML = `${app.response.name}, ${app.response.sys.country}`,
  description: () => weather.description.innerHTML = app.response.weather[0].main,
  img: () => weather.icon.src = app.response.weather[0].icon,
  temp: () => weather.temp.innerHTML = `Current ${sections.detTemp(app.response.main.temp)}&#176;`,
  highLow: () => weather.highLow.innerHTML = `High ${sections.detTemp(app.response.main.temp_max)}&#176; Low ${sections.detTemp(app.response.main.temp_min)}&#176;`,
  createSpan: (d) => `<span onclick='sections.convertTemps()' style='cursor:pointer;'>${d}</span>`,
  detTemp: (c) => (weather.fahrenheit) ? `${(c * (9/5) + 32).toFixed(1)} ${sections.createSpan("F")}` : `${c} ${sections.createSpan("C")}`,
  humidity: () => weather.humidity.innerHTML = `Humidity ${app.response.main.humidity}%`,
  wind: function() {
    const arrow = document.createElement('img');
    arrow.src = 'arrow.png';
    arrow.id = 'arrow';
    arrow.style.transform = `rotate(${app.response.wind.deg}deg)`;
    weather.wind.innerHTML = `Wind ${app.response.wind.speed.toFixed(1)} MPH `;
    weather.wind.appendChild(arrow);
    weather.wind.innerHTML += ` ${sections.windDirection(app.response.wind.deg)}`;
  },
  windDirection: (deg) => (deg<22||deg>=337)?"N":(deg<67)?"NE":(deg<112)?"E":(deg<157)?"SE":(deg<202)?"S":(deg<247)?"SW":(deg<292)?"W":(deg<337)?"NW":null,
  colorize: () => document.body.style.backgroundColor = sections.assignColor(weather.colors[app.response.weather[0].main]),
  assignColor: (color) => color = color || "#222",
  convertTemps: function() {
    weather.fahrenheit = !weather.fahrenheit;
    sections.temp();
    sections.highLow();
  }
}

function update() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      app.response = JSON.parse(xhr.response);
      app.main();
    }
  }
  xhr.open("GET", `https://fcc-weather-api.glitch.me/api/current?lat=${(app.position.coords.latitude).toFixed(2)}&lon=${(app.position.coords.longitude).toFixed(2)}`);
  xhr.send();
}
