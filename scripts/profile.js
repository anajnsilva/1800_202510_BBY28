var currentUser;               
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            
            currentUser = db.collection("users").doc(user.uid)
            
            currentUser.get()
                .then(userDoc => {
                    
                    let userName = userDoc.data().name;
                    userDoc.data().notify-on-donate ; true;
                    userDoc.data().notify-on-take ; false;
                
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                })
        } else {
            
            console.log("No user is signed in");
        }
    });
}


populateUserInfo();

function editUserInfo() {
    
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {

    userName = document.getElementById('nameInput').value;      

    currentUser.update({
        name: userName,
        
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    document.getElementById('personalInfoFields').disabled = true;
}