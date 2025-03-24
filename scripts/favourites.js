/**
 * Populates page with favourite fridges
 * 
 * @returns void
 */
function populateFavourites() {
    //checks if user is logged in and returns user object
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users")
                .doc(user.uid) // creates a reference to the current user's document in the user store
                .get() // retrieves document from user store. 
                .then(user => {
                    if (user.exists) {
                        let userData = user.data(); // retrieves data from document

                        // iterates over 'favorites' values
                        userData.favourites.forEach(favourite => {
                            db.collection("fridges")
                                .doc(favourite) // creates a reference to the fridge's document with the corresponding name
                                .get() // retreives document from fridge store. 
                                .then(fridge => {
                                    if (fridge.exists) {
                                        let fridgeData = fridge.data(); // retrieves data from document

                                        let docID = fridgeData.name
                                        // get's html template
                                        let cardTemplate = document.getElementById("favourites-template");

                                        // clone into new element
                                        let newcard = cardTemplate.cloneNode(true);

                                        newcard.querySelector('.remove-favourite').id = docID;

                                        // remove display none from the class list of the new html
                                        newcard.classList.remove('d-none');

                                        //update title and text and image
                                        newcard.querySelector('#fridge-title').innerHTML = fridgeData.name;
                                        newcard.querySelector('#f-image').src = `./images/${fridgeData.code}.png`; 
                                        newcard.querySelector('#fridge-address').innerHTML = fridgeData.address;
                                        newcard.querySelector('a').href = "contents.html?docID=" + docID;
                                        document.getElementById("favourites-go-here").appendChild(newcard);
                                        
                                    } else {
                                        console.error(`Fridge ${favourite} was not found`);
                                    }
                                }).catch(err => {
                                    console.error(err);
                                });
                        });
                    } else {
                        // doc.data() will be undefined in this case
                        console.error("User not found");
                    }
                }).catch(err => {
                    console.error(err);
                });
        }
    })
}

populateFavourites();

let myModal = new bootstrap.Modal(document.getElementById('remove-confirm'), {});

// Function to remove favourite fridges from favourites page
function removeFavourite(fridgeDocID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let currentUser = db.collection("users").doc(user.uid);
            myModal.show();
            document.getElementById('remove-confirm-btn').addEventListener("click", () => {

                currentUser.update({
                    favourites: firebase.firestore.FieldValue.arrayRemove(fridgeDocID)
                })
                .then(function () {
                    location.reload();
                })
            })
        }

    })

}