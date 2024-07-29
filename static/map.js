let map;
let marker;
let path = [];
let currentPosition = { lat: 0, lon: 0 }; // Example starting point
// let count= 1;


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

    initDirection();    // Initialize the direction using geolocation and device orientation
    // updateMap();        // Update the map with the current position
}

// function initDirection() {
//     if (window.DeviceOrientationEvent) {
//         console.log("DeviceOrientationEvent supported.");
//         window.addEventListener('deviceorientation', (event) => {
//             const alpha = event.alpha; // The compass direction in degrees
//             const direction = getDirection(alpha);
//             console.log("Current direction:", direction);
//             updateDirection(alpha);
//         });
//     } else {
//         console.log("DeviceOrientationEvent not supported.");
//     }
// }

function updateMap() {
    console.log("Updating map with new position:", currentPosition);
    document.getElementById('coordinates').innerText = `Latitude: ${currentPosition.lat}\n Longitude: ${currentPosition.lon}`;
    marker.setLatLng([currentPosition.lat, currentPosition.lon]);
    // path.push([currentPosition.lat, currentPosition.lon]);
    // L.polyline(path, { color: 'blue' }).addTo(map);
    map.panTo(new L.LatLng(currentPosition.lat, currentPosition.lon));
    
    console.log("Sending current position to the server:", currentPosition);
    // Send the current position to the server
    fetch('/api/update_position/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPosition)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function updateDirection(degree) {
    const icon = document.getElementById('direction-icon');
    if (icon) {icon.style.transform = `rotate(${degree}deg)`;}
    // updateMap();
}

// update database every 20 seconds
setInterval(async () => {
    if (currentPosition.lat === 0 && currentPosition.lon === 0) return;
    
    // Get current position using geolocation
    await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            currentPosition.lat = position.coords.latitude;
            currentPosition.lon = position.coords.longitude;
            console.log("Current position:", currentPosition);
            resolve();
        });
    });
    
    console.log("Updating database with new position:", currentPosition);
    fetch('/api/update_position/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPosition)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
} , 20000);

export { initMap, updateMap, updateDirection, currentPosition };
