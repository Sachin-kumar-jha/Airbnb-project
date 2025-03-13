

Radar.initialize('<%= MAP_TOKEN %>');

// Listing coordinates
const listingCoords = listing.geometry ? listing.geometry.coordinates : null;

// Initialize map — default to world view
const map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tiles (free)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Set map view to listing location or user's location
if (listingCoords) {
    map.setView([listingCoords[1], listingCoords[0]], 13); // [lat, lng]
    L.marker([listingCoords[1], listingCoords[0]]).addTo(map)
        .bindPopup(`<b>${listing.location}</b>`)
        .openPopup();
} else {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup('You are here')
            .openPopup();
    }, (error) => {
        console.error('Geolocation error:', error);
    });
}