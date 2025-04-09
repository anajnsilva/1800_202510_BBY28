
// Function to display the fridge cards for each fridge
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("fridgeliststemplate"); // Retrieve the HTML element with the ID "fridgeliststemplate" and store it in the cardTemplate variable. 
    navigator.geolocation.getCurrentPosition(function (position) {
        let userLat = position.coords.latitude;  //gets users current position (may be wonky)
        let userLng = position.coords.longitude;

        db.collection(collection).get()   //the collection called "fridges"
            .then(allFridges => {

                //var i = 1;  //Optional: if you want to have a unique ID for each fridge
                allFridges.forEach(doc => { //iterate thru each doc
                    var docID = doc.id;
                    var title = doc.data().name;       // get value of the fridge "name" key
                    var fridgeCode = doc.data().code;    //get unique ID to each fridge to be used for fetching right image

                    function FridgeLocation() {
                        db.collection("fridges").get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                console.log("Document ID:", doc.id); // Log each document's ID
                                console.log("Document data:", doc.data());
                            });
                        }).catch((error) => {
                            console.log("Error getting documents:", error);
                        });
                    }
                    FridgeLocation();

                    let address = doc.data().geolocation; //assigns latitude and longitude to address
                    let { latitude, longitude } = address; //splits up latitude and longitude into their respective values
                    let distance = getDistance(userLat, userLng, latitude, longitude); //calls getDistance with parameters of user position and fridge position

                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                    newcard.querySelector('.favourite-button').id = 'save-' + docID;

                    let button = newcard.querySelector('button');
                    button.setAttribute("data-docid", docID);

                    newcard.querySelector('button').onclick = favourite_button_onclick;

                    //update title and text and image
                    newcard.querySelector('.fridge-name').innerHTML = title;
                    newcard.querySelector('.fridge-image').src = `./images/${fridgeCode}.png`; //Example: NV01.png
                    newcard.querySelector('a').href = "contents.html?docID=" + docID + "&distance=" + distance;
                    newcard.querySelector('.fridge-distance').innerHTML = distance.toFixed(2) + "km";
                    // enableSeefridge(distance, newcard);
                    document.getElementById(collection + "-go-here").appendChild(newcard);

                    // display favourited fridges with red hearts
                    firebase.auth().onAuthStateChanged(user => {
                        if (user) {
                            let currentUser = db.collection("users").doc(user.uid)
                            currentUser.get().then(userDoc => {
                                let saved = userDoc.data().favourites;
                                if (saved.includes(docID)) {
                                    document.getElementById('save-' + docID).src = "../images/favourite-heart-after.png";
                                    button.setAttribute("data-isfav", "true");
                                }
                            })
                        }
                    })
                })
            })
    });
}

displayCardsDynamically("fridges");  //input param is the name of the collection

// Function to get distrance from the user to the fridge
function getDistance(userLat, userLng, tarlat, tarlng) {

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(tarlat - userLat);  // deg2rad below
    var dLon = deg2rad(tarlng - userLng);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(tarlat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

//Function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// Function to add fridge to user's favourites
function favourite_button_onclick() {
    let fridgeDocID = this.dataset.docid;
    let isfav = this.dataset.isfav

    if (!isfav) {
        addFavourite(fridgeDocID, this)
    } else {
        removeFavourite(fridgeDocID, this)
    }
}

//Function to add favourite fridges to user's collection
function addFavourite(fridgeDocID, currentBtn) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let currentUser = db.collection("users").doc(user.uid);
            currentUser.update({
                favourites: firebase.firestore.FieldValue.arrayUnion(fridgeDocID)
            })
                .then(function () {
                    let heartID = 'save-' + fridgeDocID;
                    document.getElementById(heartID).src = "../images/favourite-heart-after.png";
                    currentBtn.setAttribute("data-isfav", "true");
                })

            // Checks user's notification settings, and if enabled, adds them to the frdiges watchers
            db.collection("users").doc(user.uid).get().then(doc => {
                let userData = doc.data();
                if (userData.notifyDonate == true) {
                    let fridge = db.collection("fridges").doc(fridgeDocID);
                    fridge.update({
                        usersWatching: firebase.firestore.FieldValue.arrayUnion(user.uid)
                    })

                }
            })

        }
    })
}

// Function to remove favourite fridges from user's collection
function removeFavourite(fridgeDocID, currentBtn) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let currentUser = db.collection("users").doc(user.uid)
            currentUser.update({
                favourites: firebase.firestore.FieldValue.arrayRemove(fridgeDocID)
            })
                .then(function () {
                    let heartID = 'save-' + fridgeDocID;
                    document.getElementById(heartID).src = "../images/favourite-heart-before.png";

                    currentBtn.removeAttribute("data-isfav");
                })
            let fridge = db.collection("fridges").doc(fridgeDocID);
            fridge.update({
                usersWatching: firebase.firestore.FieldValue.arrayRemove(user.uid)
            })
        }
    })
}



