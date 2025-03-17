function displayFridgeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("fridges")
        .doc(ID)
        .get()
        .then(doc => {
            let Fridgecode = doc.data().code;
            console.log(Fridgecode);
            let title = doc.data().name;
            //let content = doc.data().details;

            var fridge = db.collection("fridges").doc(doc.id).get()
                .then(function (fridge) { //gets geolocation of fridge from db

                    //let cleanaddress = address.replace(/° [NW]/g, ''); //cleans the lat lng of any unnessary chars
                    //  let [tarlat, tarlng] = address.split(','); // splits lat lng into their own respective variables
                    let { latitude: tarlat, longitude: tarlng } = fridge.data().geolocation || {};
                    console.log(`Fridge at: ${tarlat}, ${tarlng}`);
                    let address = reverseGeocode(tarlat, tarlng);
                    // only populate title, and image
                    document.querySelector(".h5").innerHTML = title;
                    document.querySelector(".adsress").innerHTML = address;
                });
        }
        )
};
displayFridgeInfo();


function reverseGeocode(lat, lng) {

    const apiKey = AIzaSyDFRHchEyckYqeuZJNUADcAVbYZpsnC83w;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                const address = data.results[0].formatted_address;
                document.getElementById('address').innerText = address;
            } else {
                console.log('Geocoding failed: ' + data.status);
            }
        })
        .catch(error => console.log('Error:', error));
}
