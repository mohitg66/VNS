const directionValue = document.getElementById("direction-value");
const startBtn = document.querySelector(".start-btn");
const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

startBtn.addEventListener("click", () => {
  if (isIOS) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
          alert("Permission is required!");
        }
      })
      .catch(() => alert("Not supported"));
  }
});

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

  if (!isIOS) {
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
  }

  function handleOrientation(e) {
    let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    directionValue.textContent = Math.round(compass);
  }
});
