//Distance Target
var distanceLimit = 7;

//Function to convert timestamp to seconds
function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

//Fucnction to display data from fridge sub-collection contents on content page
// contentID added for second parameter when user adding new items
function addContentToPage(contentItem, contentID) {
    let item = contentItem.details; // grabs the name of the item
    let timestamp = contentItem.timestamp; // grabs the timestamp of the item

    let date = toDateTime(timestamp.seconds); // convert the timestamp to seconds
    let params = new URL(window.location.href); //get URL of search bar

    let newcard = document.querySelector('.fridge-item-card').cloneNode(true); // clone template to create an item card per document in the content collection
    let distance = params.searchParams.get("distance");

    newcard.classList.remove('d-none'); // removes class d-none so that card displays on page
    newcard.setAttribute("content-id", contentID); // store the content ID in the html to reference it later when removing
    newcard.querySelector('.fridge-item-title').innerHTML = item; // adds name of food item to card
    newcard.querySelector('.timestamp').innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString(); // adds timestamp to item card

    document.querySelector('#fridge-content-container').appendChild(newcard); //adds iem card to content container

    if (distance) {
        disableTake(distance);

    }
}

function displayFridgeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    let distance = params.searchParams.get("distance");
    console.log(ID);

    db.collection("fridges")
        .doc(ID)
        .get() // grabs fridge document for the specific fridge page
        .then(doc => {
            let fridgeData = doc.data(); // grabs data from fridge document
            let title = fridgeData.name; // grabs fridge name from fridge document
            let address = fridgeData.address;
            //let content = doc.data().details;
            //only populate title of the fridges
            document.querySelector('.h5').innerHTML = title; // replaces heading with fridge name
            document.querySelector('.address').innerHTML = "Address: " + address; // display address

        });

    db.collection("fridges")
        .doc(ID)
        .collection("contents")
        .get() // grabs the contents sub-collection from the fridge document 
        .then(docs => {
            docs.forEach(doc => {
                let contentItem = doc.data(); // grabs the data for each document in the contents subcollection

                addContentToPage(contentItem, doc.id); // calls previous function to add the item and its ID to the page.
            })
        })
    if (distance) {
        disableDonate(parseFloat(distance));
    } else {
        console.warn("Distance not found in URL.");




    }
}
displayFridgeInfo();

// Function to add new content items added by users into the database 
function addContentToDatabase() {

    let newItem = document.getElementById('donate-input').value; // grabs the item text input created by the user

    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID"); // gets the fridge document ID

    let date = new Date() // creates new date object

    let contentItem = { // creates new object with the corresponding key value pairs from the contents collection
        details: newItem,
        timestamp: {
            seconds: parseInt(date / 1000)
        }
    }

    db.collection("fridges")
        .doc(ID)
        .collection("contents")
        .doc()
        .set(contentItem) // creates new document inside the contents collectin with the corresponding item information
        .then(() => {
            addContentToPage(contentItem) // calls the function to create and display an item content card for the newly created item
        }).catch(_ => {
            alert("An error has occurred");
        })
}

let myModal = new bootstrap.Modal(document.getElementById('remove-confirm'), {});


//remove item from the fridge contents page
//pointing to the fridge content container and trigger a function when click
document.getElementById("fridge-content-container").addEventListener("click", (event) => {
    if (event.target.classList.contains("take-button")) {
        // click event target the element that have class contain "take button"
        let item = event.target.closest("li");// assign closet <li> contain the clicked take button to item

        myModal.show(); //show modal when click on take button

        document.getElementById('take-confirm-btn').addEventListener("click", () => {

            let contentID = item.getAttribute("content-id"); // grab the content ID from the attribute added in addContentToPage function
            // if contentID exist
            if (contentID) {
                let params = new URL(window.location.href);
                let fridgeID = params.searchParams.get("docID"); // grabing the fridge ID from the url

                db.collection("fridges") // go in the Fridge collection in database
                    .doc(fridgeID) // go to the fridge with specified ID 
                    .collection("contents") // go to the contents collection of that fridge
                    .doc(contentID) // go to the content with the ID stored in the attibute
                    .delete() // delete it when button was clicked
                    .then(() => {
                        console.log(`Item with ID ${contentID} deleted from Firestore`); //log it
                        item.remove(); // Remove from html after successful delete
                    })
                    .catch((error) => {
                        console.error("Error deleting item:", error);
                    });
            }
        })
    }

}
);
// adding address to database
function addAddress(fridgeID, address) {
    db.collection('fridges').doc(fridgeID).update({
        address: address
    });
}
addAddress('downtown eastside', '29 West Hastings Street');
addAddress('Kensington-Cedar Cottage', '4040 Victoria Drive');
addAddress('Kitsilano', '3066 West 13th Ave');
addAddress('Mount Pleasant', '273 East 4th Ave');
addAddress('Riley Park', '3718 Main Street');
addAddress('Kerrisdale', '2490 W 37th Ave');
addAddress('West Point Grey', '4405 W 8th Ave');


function sendFridgeId() {
    let params = new URL(window.location.href); // Get URL of the current page
    let ID = params.searchParams.get("docID"); // Get the value for the key "docID"

console.log(ID);

    if (ID) {
        window.location.href = `map.html?docID=${ID}`; // Redirect to map.html with the docID as a query parameter
    } else {
        console.error("No docID found in the URL");
    }
}

function disableDonate(distance) {
    let popoverWrapper = document.querySelector('#donate-btn-wrapper'); // Get the parent span
    let donateBtn = document.querySelector('#donate-btn'); // Get the actual button

    if (popoverWrapper && donateBtn) {
        if (distance > distanceLimit) {
            // Disable the button interaction visually
            donateBtn.disabled = true;
            donateBtn.style.opacity = "0.5"; // Make it visually disabled

            // Update popover content
            popoverWrapper.setAttribute('data-bs-content', 'This fridge is too far. You must be within 2km to donate to this fridge!');

            let popover = bootstrap.Popover.getInstance(popoverWrapper);
            if (!popover) {
                new bootstrap.Popover(popoverWrapper);
            }
        } else {
            // Re-enable the button interaction
            donateBtn.disabled = false;
            donateBtn.style.opacity = "1"; // Restore full opacity
            donateBtn.style.cursor = "pointer"; // Change cursor back to pointer
        }
    }
}

function disableTake(distance) {

    // Select all dynamically generated "Take" buttons
    let takeBtn = document.querySelectorAll('.take-button');

    // Iterate over each take button
    takeBtn.forEach(button => {

        let btnWrapper = button.closest('.take-btn-wrapper'); // Find the closest wrapper for each button

        if (distance > distanceLimit) { // Disable if distance is greater than 2km
            button.disabled = true;
            button.style.opacity = "0.5";
            button.style.cursor = "not-allowed";

            // popover message
            if (btnWrapper) {
                // Update the popover content dynamically
                btnWrapper.setAttribute('data-bs-content', 'You must be within 2km to take items from this fridge.');

                // Initialize popover if not already initialized
                let popover = bootstrap.Popover.getInstance(btnWrapper);
                if (!popover) {
                    new bootstrap.Popover(btnWrapper);
                }
            }
        } else {
            button.disabled = false;
            button.style.opacity = "1";
            button.style.cursor = "pointer";

        }
    });
}
