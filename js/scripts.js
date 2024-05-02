//Setting up Mapbox

mapboxgl.accessToken = 'pk.eyJ1IjoiZWtzMjA4MCIsImEiOiJjbHVsdWNmbTExNGg0MmtsZHVlOHN2Zzd5In0.wEYw-sKV39S4NkqO8CDQBw';


var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-74.00011310930516, 40.72415607434748], // starting position [lng, lat]
    zoom: 10.5, // starting zoom,
}

// instantiate the map
const map = new mapboxgl.Map(mapOptions);


// add a navitation control
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// loop over the bookstoredata script to make a marker for each record
bookstoredata.forEach(function (bookstoreRecord) {

    var color

    // use if statements to assign colors based on borough

    if (bookstoreRecord.Borough === 'Manhattan') {
        color = '#9932CC'
    }
    if (bookstoreRecord.Borough === 'Queens') {
        color = '#556B2F'
    }
    if (bookstoreRecord.Borough === 'Bronx') {
        color = '#483D8B'
    }
    if (bookstoreRecord.Borough === 'Brooklyn') {
        color = '#E9967A'
    }

    // create a popup to attach to the marker

    const popup = new mapboxgl.Popup({
        offset: 24,
        anchor: 'bottom'
    }).setHTML(
        `<strong>${bookstoreRecord.Name}</strong> is located in <strong>${bookstoreRecord.Location}</strong>. The store opened in <strong>${bookstoreRecord.date}</strong>.`
    );

    // create a marker, set the coordinates, add the popup, add it to the map
    new mapboxgl.Marker({
        scale: 0.75,
        color: color,
    })
        .setLngLat([bookstoreRecord.Longitude, bookstoreRecord.Latitude])
        .setPopup(popup)
        .addTo(map);
})

map.on('load', function () {

    // add a geojson source for the borough boundaries
    map.addSource('borough-boundaries', {
        type: 'geojson',
        data: 'data/borough-boundaries-simplified.geojson',
        generateId: true // this will add an id to each feature, this is necessary if we want to use featureState (see below)
    })

    // first add the fill layer, using a match expression to give each a unique color based on its boro_code property
    map.addLayer({
        id: 'borough-boundaries-fill',
        type: 'fill',
        source: 'borough-boundaries',
        paint: {
            'fill-color': [
                'match',
                ['get', 'boro_code'],
                '1',
                '#f4cae4',
                '2',
                '#cbd5e8',
                '3',
                '#fdcdac',
                '4',
                '#b3e2cd',
/*                 '5',
                '#e6f5c9', */
                '#ccc'
            ],
            // use a case expression to set the opacity of a polygon based on featureState
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,  // opacity when hover is false
                0.5 // opacity when hover is true
            ]
        }
    })
    // add borough outlines after the fill layer, so the outline is "on top" of the fill
    map.addLayer({
        id: 'borough-boundaries-line',
        type: 'line',
        source: 'borough-boundaries',
        paint: {
            'line-color': '#6b6b6b'
        }
    })
})

// this is a variable to store the id of the feature that is currently being hovered.
/* let hoveredPolygonId = null 

// whenever the mouse moves on the 'borough-boundaries-fill' layer, we check the id of the feature it is on top of, and set featureState for that feature.  The featureState we set is hover:true or hover:false
map.on('mousemove', 'borough-boundaries-fill', (e) => {
    // don't do anything if there are no features from this layer under the mouse pointer
    if (e.features.length > 0) {
        // if hoveredPolygonId already has an id in it, set the featureState for that id to hover: false
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'borough-boundaries', id: hoveredPolygonId },
                { hover: false }
            );
        }

        // set hoveredPolygonId to the id of the feature currently being hovered
        hoveredPolygonId = e.features[0].id;

        // set the featureState of this feature to hover:true
        map.setFeatureState(
            { source: 'borough-boundaries', id: hoveredPolygonId },
            { hover: true }
        );

        // make the cursor a pointer to let the user know it is clickable
        map.getCanvas().style.cursor = 'pointer'

        // resets the feature state to the default (nothing is hovered) when the mouse leaves the 'borough-boundaries-fill' layer
        map.on('mouseleave', 'borough-boundaries-fill', () => {
            // set the featureState of the previous hovered feature to hover:false
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: 'borough-boundaries', id: hoveredPolygonId },
                    { hover: false }
                );
            }

            // clear hoveredPolygonId
            hoveredPolygonId = null;
            
            // set the cursor back to default
            map.getCanvas().style.cursor = ''
        });

    }
}); */
map.on('click', 'button-50', (e) => {
    // listen for a click on a specific button and use flyTo to change the map's camera view.
    $('#queens-button').on('click', function () {
        map.flyTo({
            center: [-73.89387763569168, 40.73104567408716],
            zoom: 9,
            duration: 1500
        })
    })

    $('#manhattan-button').on('click', function () {
        map.flyTo({
            center: [-74.15234, 40.57932],
            zoom: 9,
            duration: 1500
        })
    })

    $('#bronx-button').on('click', function () {
        map.flyTo({
            center: [-73.91579103266682, 40.81437684228872],
            zoom: 9,
            duration: 1500
        })
    })

    $('#brooklyn-button').on('click', function () {
        map.flyTo({
            center: [-73.95743869447674, 40.644049824373106],
            zoom: 9,
            duration: 1500
        })
    })
})
