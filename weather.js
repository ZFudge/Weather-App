const app = {
  main: function() {
      writeResponse();
      writePic();
      writeTemp();
  }
};

const weather = {
  para: document.getElementById('response'),
  icon: document.getElementById('icon'),
  temp: document.getElementById('temp'),
  fahrenheit: true
};

navigator.geolocation.getCurrentPosition((p)=>app.position=p);

function update() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      app.response = JSON.parse(xhr.response);
      app.main();
    }
  }
  xhr.open("GET", `https://fcc-weather-api.glitch.me/api/current?lat=${Math.round(app.position.coords.latitude)}&lon=${Math.round(app.position.coords.longitude)}`);
  xhr.send();
}

const writeResponse = () => weather.para.innerHTML = app.response.weather[0].description;
const writePic = () => weather.icon.src = app.response.weather[0].icon;
const writeTemp = () => weather.temp.innerHTML = `Temp: ${detTemp(app.response.main.temp)}  High: ${detTemp(app.response.main.temp_max)}  Low: ${detTemp(app.response.main.temp_min)}`;
const detTemp = (c) => (weather.fahrenheit) ? (c * (9/5) + 32).toFixed(1) : c;

function convert() {
  weather.fahrenheit = ! weather.fahrenheit;
  writeTemp();
}