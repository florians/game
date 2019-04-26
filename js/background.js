/*
  background layers
  - sky background
  - sky layers
  - grass layer
*/
function drawBackground() {
  // sky background
  context.fillStyle = "#91E0F2";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // sky layer
  game.sky.forEach(skyEl => {
    drawTerrain(skyEl.points, skyEl.color);
  });
  // grass layer
  game.grass.forEach(grassEl => {
    drawTerrain(grassEl.points, grassEl.color);
  });
}
// draws the terrain
function drawTerrain(points, color) {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, points[0]);
  for (var t = 1; t < points.length; t++) {
    context.lineTo(t, points[t]);
  }
  // finish creating the rect so we can fill it
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
}
// generate terrainPoints on game load
function generateTerrain(width, height, displace, roughness) {
  var points = [],
    // Gives us a power of 2 based on our width
    power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

  // Set the initial left point
  points[0] = height / 2 + (Math.random() * displace * 2) - displace;
  // set the initial right point
  points[power] = height / 2 + (Math.random() * displace * 2) - displace;
  displace *= roughness;

  // Increase the number of segments
  for (var i = 1; i < power; i *= 2) {
    // Iterate through each segment calculating the center point
    for (var j = (power / i) / 2; j < power; j += power / i) {
      points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
      points[j] += (Math.random() * displace * 2) - displace
    }
    // reduce our random range
    displace *= roughness;
  }
  return points;
}