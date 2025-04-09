
// Function for referall on other JS files
function goDirection() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let userLat = position.coords.latitude;  //gets users current position (may be wonky)
    let userLng = position.coords.longitude;
  });
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"

  var fridge = db.collection("fridges").doc(ID).get()
    .then(function (fridge) { //gets geolocation of fridge from db
      let address = doc.data().geolocation; //assigns it to address
      let cleanaddress = address.replace(/° [NW]/g, ''); //cleans the lat lng of any unnessary chars
      let [tarlat, tarlng] = cleanaddress.split(','); // splits lat lng into their own respective variables
    });

  let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
}

// Function to calculate the distance from the user's current location to the fridge.
function getDistance(userLat, userLng, tarlat, tarlng) {

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(tarlat - userLat);  // deg2rad below
  var dLon = deg2rad(tarlng - userLng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
getDistance();


