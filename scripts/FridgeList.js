function writeFridges(){
    // define a variable for collection "Frisdges" in datastore
    var fridgesRef = db.collection("fridges");
    
    fridgesRef.add({
        code:DEF,
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
        code:DEF,
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