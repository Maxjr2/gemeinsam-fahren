let map, marker;
let selectedDestination = null;

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4anIyIiwiYSI6ImNsenBmdWR0eDE5Nmcya3F3MmU1Z2RqOG8ifQ.4vJLEFFCOICojbzKwG8gvg';

document.addEventListener('DOMContentLoaded', () => {
    const predefinedDestinations = document.getElementById('predefined-destinations');
    const customDestinationBtn = document.getElementById('custom-destination-btn');
    const mapContainer = document.getElementById('map-container');
    const confirmDestinationBtn = document.getElementById('confirm-destination-btn');

    predefinedDestinations.addEventListener('change', (e) => {
        if (e.target.value) {
            selectedDestination = { type: 'predefined', value: e.target.value };
            submitRide();
        }
    });

    customDestinationBtn.addEventListener('click', () => {
        mapContainer.style.display = 'block';
        initMap();
    });

    confirmDestinationBtn.addEventListener('click', () => {
        if (selectedDestination) {
            submitRide();
        } else {
            alert('Please select a destination on the map.');
        }
    });
});

function initMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2
    });

    // Add zoom and rotation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Add Mapbox Geocoder control
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false, // We'll add our own marker
    });
    map.addControl(geocoder);

    // Listen for the 'result' event from the Geocoder
    geocoder.on('result', (e) => {
        const coords = e.result.center;
        setMapMarker({ lng: coords[0], lat: coords[1] });
    });

    map.on('click', (e) => {
        setMapMarker(e.lngLat);
    });
}

function setMapMarker(lngLat) {
    if (marker) {
        marker.remove();
    }
    marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map);
    selectedDestination = { type: 'custom', value: lngLat };
    map.flyTo({ center: lngLat, zoom: 13 });
}

function submitRide() {
    fetch('/submit-ride', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination: selectedDestination }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('destination-selection').style.display = 'none';
        document.getElementById('map-container').style.display = 'none';
        document.getElementById('confirmation').style.display = 'block';
        
        const destinationDisplay = document.getElementById('destination-display');
        if (selectedDestination.type === 'predefined') {
            destinationDisplay.textContent = `Destination: ${selectedDestination.value}`;
        } else {
            destinationDisplay.textContent = `Destination: Custom location (${selectedDestination.value.lat.toFixed(6)}, ${selectedDestination.value.lng.toFixed(6)})`;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the ride.');
    });
}