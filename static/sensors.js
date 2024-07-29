import { currentPosition, updateMap, updateDirection } from './map.js';

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let stepCount = 0;
let currentDirection = 0;
let lastAccZ = 0;
let isWalking = false;

function updateStepCountDisplay() {
    document.getElementById('step-count').innerText = `Steps: ${stepCount}`;
}

function estimatePosition() {
    console.log("Estimating position...");
    const stepLength = 0.5; // Average step length in meters
    const deltaLat = stepLength * Math.cos(currentDirection * Math.PI / 180) / 111320;
    const deltaLon = stepLength * Math.sin(currentDirection * Math.PI / 180) / (111320 * Math.cos(currentPosition.lat * Math.PI / 180));
    currentPosition.lat += deltaLat;
    currentPosition.lon += deltaLon;
    updateMap();
    stepCount++;
    updateStepCountDisplay();
}

function askDeviceMotionPermission() {
    DeviceMotionEvent.requestPermission()
        .then((response) => {
            if (response === "granted") {
                window.addEventListener("devicemotion", handleMotion, true);
            } else {
                alert("Permission is required!");
            }
        })
        .catch(() => alert("DeviceMotionEvent is not supported"));
}

function handleMotion(event) {
    console.log("DeviceMotionEvent supported.");
    window.addEventListener('devicemotion', (event) => {
        let accZ = event.acceleration.z;
        if (Math.abs(accZ - lastAccZ) > 1.5 && Math.abs(accZ - lastAccZ) < 4) {
            isWalking = !isWalking;
            if (isWalking) {
                // stepCount++;
                estimatePosition();
            }
        }
        lastAccZ = accZ;
    });
}

function askDeviceOrientationPermission() {
    DeviceOrientationEvent.requestPermission()
        .then((response) => {
            if (response === "granted") {
                window.addEventListener("deviceorientation", handleOrientation, true);
            } else {
                alert("Permission is required!");
            }
        })
        .catch(() => alert("DeviceOrientationEvent is not supported"));
}

function handleOrientation(e) {
    let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    currentDirection = Math.round(compass);
    updateDirection(currentDirection);
    console.log("Current direction:", currentDirection);
}

if (iOS) askDeviceMotionPermission();
window.addEventListener("devicemotion", handleMotion, true);

navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const point = { lat: 21.422487, lng: 39.826206 };
    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    let pointDegree = (180.0 / Math.PI) * Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
    if (pointDegree < 0) pointDegree += 360;

    if (iOS) askDeviceOrientationPermission();
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
});


export { stepCount, currentDirection };
