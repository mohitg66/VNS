let map;
let marker;
let path = [];
let currentPosition = { lat: 0, lon: 0 }; // Example starting point

// Get current position using geolocation
// navigator.geolocation.getCurrentPosition((position) => {
//     currentPosition.lat = position.coords.latitude;
//     currentPosition.lon = position.coords.longitude;
//     console.log("Current position:", currentPosition);
// });

async function initMap() {
    // Get current position using geolocation
    await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            currentPosition.lat = position.coords.latitude;
            currentPosition.lon = position.coords.longitude;
            console.log("Current position:", currentPosition);
            resolve();
        });
    });

    console.log("Initializing map with current position:", currentPosition);
    map = L.map('map').setView([currentPosition.lat, currentPosition.lon], 20);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create a custom icon for the marker
    const icon = L.divIcon({
        html: '<img src="static/images/compass.png" id="direction-icon" style="transform: rotate(0deg);">',
        iconSize: [32, 32],
        className: 'direction-icon'
    });

    marker = L.marker([currentPosition.lat, currentPosition.lon], { icon: icon }).addTo(map);
    path.push([currentPosition.lat, currentPosition.lon]);
    console.log("Map initialized.");
    updateMap();
}

function updateMap() {
    console.log("Updating map with new position:", currentPosition);
    document.getElementById('coordinates').innerText = `Latitude: ${currentPosition.lat}\n Longitude: ${currentPosition.lon}`;
    marker.setLatLng([currentPosition.lat, currentPosition.lon]);
    path.push([currentPosition.lat, currentPosition.lon]);
    L.polyline(path, { color: 'blue' }).addTo(map);
    map.panTo(new L.LatLng(currentPosition.lat, currentPosition.lon));

    // update database if time is divisible by 5
    const time = new Date().getSeconds();
    if (time % 5 === 0) {
        console.log("Updating database with new position:", currentPosition);
        fetch('https://192.168.0.163:8000/update-user-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentPosition)
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        
    }
}

function updateDirection(degree) {
    const icon = document.getElementById('direction-icon');
    if (icon) {
        icon.style.transform = `rotate(${degree}deg)`;
    }
}

export { initMap, updateMap, updateDirection, currentPosition };
