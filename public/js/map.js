// Initialize the platform object:
const platform = new H.service.Platform({
  apikey : mapToken
});

// Obtain the default map types from the platform object:
const defaultLayers = platform.createDefaultLayers();

// Parse the coordinates from the server:
const markerCoords = { lat: parseFloat(coordinates[1]), lng: parseFloat(coordinates[0]) };

// Initialize a map centered over the coordinates:
let map = new H.Map(
  document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: markerCoords,
  zoom: 9,
  
});

// Enable map interactions:
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Handle window resizing:
window.addEventListener('resize', () => map.getViewPort().resize());

// Log the coordinates to verify they are correct:
console.log(markerCoords);

// Create a custom icon:
const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ff0000" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`
const icon = new H.map.Icon(svgMarkup,{size: {w: 30, h: 40}});
const marker = new H.map.Marker(markerCoords, { icon:icon });

// Add the marker to the map:
map.addObject(marker);

// Define the content for the popup
const popupContent = `<div>
<h4>${title}</h4>
<p>Exact location provided after booking</p></div>`;

// Create the InfoBubble
const bubble = new H.ui.InfoBubble(markerCoords, {
  content: popupContent
});

// Add a UI element to the map
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Add an event listener to the marker to display the popup when clicked
marker.addEventListener('tap', function () {
  ui.addBubble(bubble);
});