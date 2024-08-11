let map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker;
let debounceTimer;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const suggestionsContainer = document.getElementById('suggestions');

searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = this.value;
        if (query.length > 2) {
            fetchSuggestions(query);
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }, 300);
});

searchButton.addEventListener('click', () => searchLocation(searchInput.value));

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchLocation(this.value);
    }
});

function fetchSuggestions(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            suggestionsContainer.innerHTML = '';
            data.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.display_name;
                div.classList.add('suggestion');
                div.addEventListener('click', () => {
                    searchInput.value = item.display_name;
                    suggestionsContainer.style.display = 'none';
                    updateMap(item.lat, item.lon);
                });
                suggestionsContainer.appendChild(div);
            });
            suggestionsContainer.style.display = data.length ? 'block' : 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            suggestionsContainer.style.display = 'none';
        });
}

function searchLocation(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateMap(data[0].lat, data[0].lon);
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while searching for the location');
        });
}

function updateMap(lat, lon) {
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    
    if (marker) {
        map.removeLayer(marker);
    }
    
    marker = L.marker([lat, lon]).addTo(map);
    map.setView([lat, lon], 13);

    const resultDiv = document.createElement('div');
    resultDiv.textContent = displayName;
    resultDiv.classList.add('search-result');
    resultDiv.addEventListener('click', () => {
        map.setView([lat, lon], 13);
    });
    const searchResults = document.getElementById('search-results');
    searchResults.insertBefore(resultDiv, searchResults.firstChild);
}

document.getElementById('menuToggle').addEventListener('click', function(e) {
    e.preventDefault();
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    map.invalidateSize();
});

