// Function to grab the location of the specified fridge and invokes showMap function
function FridgeLocation() {


    let ID = new URL(window.location.href).searchParams.get("docID");

    console.log(ID);
    if (ID) {
        db.collection("fridges").doc(ID).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let address = { longitude: doc.data().geolocation.longitude, latitude: doc.data().geolocation.latitude };
                // let { latitude, longitude } = address; //splits up latitude and longitude into their respective values
                console.log(address);
                showMap(address);   //call showMap with "end" location
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

}
FridgeLocation();

//------------------------------------------------------------------------
// This function will launch a map, centred on the user's location.
// And show the route from the user's location to the end point.
//
// @param  endLocation is the [lng, lat] of the route destination
//------------------------------------------------------------------------
function showMap(address) {

    // ---------------------------------------------------------------------------------
    // STEP ONE:  Find out where the user is first
    // If the user allows location access, use their location to initialize the map;
    // Otherwise, use the default location.
    // ---------------------------------------------------------------------------------
    // Default location (YVR city hall) 49.26504440741209, -123.11540318587558
    let defaultCoords = { lat: 49.26504440741209, lng: -123.11540318587558 };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Location object as a key-value pair
                let userCoords = {
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                };
                console.log(userCoords);
                initializeMap(userCoords, address);
            }, (error) => {
                console.warn("Geolocation error:", error);
                initializeMap(defaultCoords, address); // Load with default location
            }
        )
    } else {
        console.error("Geolocation is not supported.");
        initializeMap(defaultCoords, address); // Load with default location
    }

    function initializeMap(coords, end) {

        var userLocation = [coords.lng, coords.lat];   //user's location 
        var address = [end.longitude, end.latitude];       //clicked location
        console.log(coords);
        console.log(end);


        mapboxgl.accessToken = 'pk.eyJ1Ijoib3JyNSIsImEiOiJja3cwYWo2b2w3cGk1MzFzMXkwaGU0eXcxIn0.OeBYTlCaeCY45IjTbh01sA';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: userLocation, // center the map at the user's location
            zoom: 12
        });

        //---------------------------------------------------------------------------------
        // Add the user's location to the map
        //---------------------------------------------------------------------------------
        showPoint(map, userLocation);

        //---------------------------------------------------------------------------------
        // Get the route
        //---------------------------------------------------------------------------------
        console.log(address);
        getRoute(map, userLocation, address);
    }
}

// ---------------------------------------------------------------------
// Add a pin for point that is provided as a parameter point (lat, long)
// when the map loads. Note map.on is an event listener. 
//
// @params   map:  the map object;
//           point:  an array of [lng, lat] coordinates
// ---------------------------------------------------------------------
function showPoint(map, point) {
    map.on('load', () => {
        //a point is added via a layer
        map.addLayer({
            id: 'point',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: point
                            }
                        }
                    ]
                }
            },
            paint: {
                'circle-radius': 10,
                'circle-color': '#3887be'
            }
        });
    });
}

// --------------------------------------------------------------
// This is an asynchronous function that will use the API to get
// the route from start to end. It will display the route on the map
// and provide turn-by-turn directions in the sidebar.
//
// @params   map:  the start and end coordinates;
//           start and end:  arrays of [lng, lat] coordinates
// -------------------------------------------------------------
async function getRoute(map, start, end) {
    console.log("Start coordinates:", start);
    console.log("End coordinates:", end);
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    console.log("route is " + route);
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };
    // if the route already exists on the map, we'll reset it using setData
    map.on('load', () => {
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
    });
    //--------------------------------------------
    // display the turn-by-turn legs of the route
    // get the sidebar and add the instructions
    //--------------------------------------------
    const instructions = document.getElementById('instructions');
    const steps = data.legs[0].steps;

    let tripInstructions = '';
    for (const step of steps) {
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
    }
    instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
        data.duration / 60
    )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;

    console.log("Start coordinates:", start);
    console.log("End coordinates:", end);
    console.log("GeoJSON data:", geojson);

}