//Function to display user's name
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            
            db.collection("users").doc(user.uid).get().then((doc) => {
                console.log(user.uid); //print the uid in the browser console
                let userData = doc.data();
                let userName = userData.name;
                document.getElementById("name-goes-here").innerText = userName;    
            })


        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function