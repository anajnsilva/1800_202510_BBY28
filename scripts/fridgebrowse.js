
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("fridgeliststemplate"); // Retrieve the HTML element with the ID "fridgeliststemplate" and store it in the cardTemplate variable. 
    navigator.geolocation.getCurrentPosition(function(position) {
        let userLat = position.coords.latitude;  //gets users current position (may be wonky)
        let userLng = position.coords.longitude;
  });
    db.collection(collection).get()   //the collection called "fridges"
        .then(allFridges => {
            //var i = 1;  //Optional: if you want to have a unique ID for each fridge
            allFridges.forEach(doc => { //iterate thru each doc
                var docID = doc.id;
                console.log(docID);
                var title = doc.data().name;       // get value of the fridge "name" key
                var fridgeCode = doc.data().code;    //get unique ID to each fridge to be used for fetching right image

               var fridge = db.collection(collection).doc(doc.id).get() 
                .then(function(fridge) { //gets geolocation of fridge from db
                  let address = fridge.data().geolocation; //assigns it to address
                  console.log(address);
                //let cleanaddress = address.replace(/° [NW]/g, ''); //cleans the lat lng of any unnessary chars
                //  let [tarlat, tarlng] = address.split(','); // splits lat lng into their own respective variables
                let { latitude: tarlat, longitude: tarlng } = fridge.data().geolocation || {};
        console.log(`Fridge at: ${tarlat}, ${tarlng}`);
            });
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                
                newcard.querySelector('.fridge-name').innerHTML = title;
                newcard.querySelector('.fridge-image').src = `./images/${fridgeCode}.png`; //Example: NV01.png
                newcard.querySelector('a').href = "contents.html?docID=" + docID;
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("fridges");  //input param is the name of the collection

