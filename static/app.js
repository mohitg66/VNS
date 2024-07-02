import { initMap } from './map.js';
import { currentPosition } from './map.js';

document.getElementById('coordinates').innerText = `Latitude: ${currentPosition.lat}\n Longitude: ${currentPosition.lon}`;

document.getElementById('start').addEventListener('click', () => {
    console.log("Start button clicked.");
    initMap();
});

