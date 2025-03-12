function writeFridges() {
    // define a variable for collection "Frisdges" in datastore
    var fridgesRef = db.collection("fridges");

    fridgesRef.add({
        code: DEF,
        name: "Downtown Eastside",
        geolocation: {
            lat: 49.282166872982415,
            lng: -123.10561440000001
        }
    })
    var contentsRef = fridgesRef.collection("contents");

    contentsRef.add({
        details: "2 bananas",
        tinmestamp: firebase.firestore.FieldValue.serverTimestamp() // time when the food was donated
    })

    contentsRef.add({
        details: "1 liter milk",
        tinmestamp: firebase.firestore.FieldValue.serverTimestamp() // time when the food was donated
    })

    fridgesRef.add({
        code: DEF,
        name: "Kensington-Cedar Cottage",
        geolocation: {
            lat: 49.24910810831875,
            lng: -123.06473884232807
        }
    })
    var contentsRef = fridgesRef.collection("contents");

    contentsRef.add({
        details: "2 bananas",
        tinmestamp: firebase.firestore.FieldValue.serverTimestamp() // time when the food was donated
    })

    contentsRef.add({
        details: "1 liter milk",
        tinmestamp: firebase.firestore.FieldValue.serverTimestamp() // time when the food was donated
    })

}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("fridgeliststemplate"); // Retrieve the HTML element with the ID "fridgeliststemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "fridges"
        .then(allFridges => {
            //var i = 1;  //Optional: if you want to have a unique ID for each fridge
            allFridges.forEach(doc => { //iterate thru each doc
                var docID = doc.id;
                console.log(docID);
                var title = doc.data().name;       // get value of the fridge "name" key
                var fridgeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image

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

