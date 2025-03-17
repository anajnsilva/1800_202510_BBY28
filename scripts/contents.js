function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

function addContentToPage(contentItem) {
    let item = contentItem.details;
    let timestamp = contentItem.timestamp;

    let date = toDateTime(timestamp.seconds);
    let newcard = document.querySelector('.fridge-item-card').cloneNode(true);

    newcard.classList.remove('d-none');
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
            // only populate title, and image
            document.querySelector(".h5").innerHTML = title;

        });

    db.collection("fridges")
        .doc(ID)
        .collection("contents")
        .get()
        .then(docs => {
            docs.forEach(doc => {
                let contentItem = doc.data();

                addContentToPage(contentItem);
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
