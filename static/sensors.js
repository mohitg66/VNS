import { currentPosition, updateMap, updateDirection } from './map.js';

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

if (window.DeviceMotionEvent) {
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
} else {
    console.log("DeviceMotionEvent not supported.");
}

if (window.DeviceOrientationEvent) {
    console.log("DeviceOrientationEvent supported.");
    window.addEventListener('deviceorientation', (event) => {
        currentDirection = event.alpha; // Update currentDirection based on compass heading
        updateDirection(currentDirection);
        console.log("Current direction:", currentDirection);
    });
} else {
    console.log("DeviceOrientationEvent not supported.");
}

export { stepCount, currentDirection };
