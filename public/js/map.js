mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
container: 'map',
style:'mapbox://styles/mapbox/streets-v12',
center:listing.geometry.coordinates, // starting position [lng, lat]
zoom:8 // starting zoom
});


const marker1 = new mapboxgl.Marker({color:'red'})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.location}</h4> <P>Exact Location provided after booking</P>`))
.addTo(map);
 
