function displayFridgeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("fridges")
        .doc(ID)
        .get()
        .then( doc => {
            let Fridgecode = doc.data().code;
            console.log(Fridgecode);
            let title = doc.data().name;
            //let content = doc.data().details;
            
            // only populate title, and image
            document.getElementById("fridgename").innerHTML = title;
            let imgEvent = document.querySelector(".fridge-img");
            imgEvent.src = "./images/" + Fridgecode + ".png";
        } );
}
displayFridgeInfo();