// set the URL as a variable

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// set different map layers and layout

var str = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var sat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 15,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var baseMaps = {
    Satellite: sat,
    Street: str
};

var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [sat]
});


function getColor(eq_depth) {
    return eq_depth > 90 ? '#75040B' :
            eq_depth > 70 ? '#75272C' :
            eq_depth > 50 ? '#C20612' :
            eq_depth > 30 ? '#F50717' :
            eq_depth > 10 ? '#F7515C' :
            '#F7C3C4';
}


d3.json(url).then(function (data) {
    for (var i = 0; i < data.features.length; i++) {
        L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
            fillOpacity: 0.85,
            color: getColor(data.features[i].geometry.coordinates[2]),
            radius: Math.pow(data.features[i].properties.mag, 2)*7500
        })
        .bindPopup(`<h1> The Magnitude: ${data.features[i].properties.mag.toLocaleString()} md</h1> <hr> <h2>Located ${data.features[i].properties.place}</h2> <h3> With depth of ${data.features[i].geometry.coordinates[2].toLocaleString()} km </h3>`)
        .addTo(myMap);
    }
});

var lgnd = L.control({position: 'bottomright'});

lgnd.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depth = [0, 10, 30, 50, 70, 90];

    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<j style="background:' + getColor(depth[i] + 1) + '"></j> ' +
            depth[i] + (depth[i + 1] ? ' to ' + depth[i + 1] +  '<br>' : '+');
    }
    return div;
};
lgnd.addTo(myMap);

L.control.layers(baseMaps).addTo(myMap);