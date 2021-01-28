// Initiate map
let mymap = L.map('mapid').setView([34.485613023219926, -118.1323220985485], 8);

// Add layer
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

// Define colors for each range of magnitudes
function colorPick(magnitude){
    let color = ""
    if(magnitude <= 1){
        color = "#63DC35"
    }else if(magnitude <= 2){
        color = "#A4EC13"
    }else if(magnitude <= 3){
        color = "#ECCB13"
    }else if(magnitude <= 4){
        color = "#EC8313"
    }else{
        color = "#EC4B13"
    }
    return color
}

// Create legend chart in bottom right corner
let legend = L.control({position: "bottomright"})

legend.onAdd = function(map){
    // Create div tag inside the bottom right tag from leaflet
    let div = L.DomUtil.create("div", "info legend"),
    magnitudes = [0, 1, 2, 3, 4, 5]
    labels = []

    // Loop through the range of magnitudes and add the text for each range as well as the color
    for(let i = 0; i <magnitudes.length; i++){
        div.innerHTML +=
        '<i style="background:' + colorPick(magnitudes[i] + 1) + '"></i>' +
        magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+ ');
    }
    return div
}

// Add the legend to the map
legend.addTo(mymap)

// Read data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(function(data){
    
    // Obtain array of data and looping
    data.features.forEach(d=>{
        // Converting magnitude to number
        d.properties.mag = +d.properties.mag
        // Excluding magnitudes lower than 0
        if(d.properties.mag > 0){
        // Creating a circle with each coordinate
        L.circle([d.geometry.coordinates[1], d.geometry.coordinates[0]], 
            // Adding a radius equal to the magnitude squared times 1000
            {radius: (d.properties.mag * d.properties.mag * 1000),
            // Using the function to obtain the proper color
            fillColor: colorPick(d.properties.mag),
            // Removing outside color
            color: "white",
            // Adding the border weight
            weight: 1,
            // Increasing circle color opacity
            fillOpacity: 0.9}).addTo(mymap)
        }
        
    })
    
})