let pos, response;
const para = document.getElementById('response');
const icon = document.getElementById('icon');
const temp = document.getElementById('temp');

navigator.geolocation.getCurrentPosition((p)=>pos=p);

function update() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      response = JSON.parse(xhr.response);
      writeResponse();
      writePic();
      writeTemp();
    }
  }
  xhr.open("GET", `https://fcc-weather-api.glitch.me/api/current?lat=${Math.round(pos.coords.latitude)}&lon=${Math.round(pos.coords.longitude)}`);
  xhr.send();
}

const writeResponse = () => para.innerHTML = response.weather[0].description;
const writePic = () => icon.src = response.weather[0].icon;
const writeTemp = () => temp.innerHTML = response.main.temp;
