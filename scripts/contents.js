function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}
// contentID added for second parameter when user adding new items
function addContentToPage(contentItem, contentID) {
    let item = contentItem.details;
    let timestamp = contentItem.timestamp;

    let date = toDateTime(timestamp.seconds); // convert the timestamp to seconds
    let newcard = document.querySelector('.fridge-item-card').cloneNode(true);

    newcard.classList.remove('d-none');
    newcard.setAttribute("content-id", contentID); // store the content ID in the html to reference it later when removing
    newcard.querySelector('.fridge-item-title').innerHTML = item;
    newcard.querySelector('.timestamp').innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();

    document.querySelector('#fridge-content-container').appendChild(newcard);
}

function displayFridgeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("fridges")
        .doc(ID)
        .get()
        .then(doc => {
            let fridgeData = doc.data();
            let title = fridgeData.name;

            //let content = doc.data().details;
            //only populate title of the fridges
            document.querySelector(".h5").innerHTML = title;

        });

    db.collection("fridges")
        .doc(ID)
        .collection("contents")
        .get()
        .then(docs => {
            docs.forEach(doc => {
                let contentItem = doc.data();

                addContentToPage(contentItem, doc.id); // having it content ID 
            })
        })
}
displayFridgeInfo();

function addContentToDatabase() {

    let newItem = document.getElementById('donate-input').value;

    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    let date = new Date()

    let contentItem = {
        details: newItem,
        timestamp: {
            seconds: parseInt(date / 1000)
        }
    }

    db.collection("fridges")
        .doc(ID)
        .collection("contents")
        .doc()
        .set(contentItem)
        .then(() => {
            addContentToPage(contentItem)
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



