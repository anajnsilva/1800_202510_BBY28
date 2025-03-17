var currentUser;               
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            
            currentUser = db.collection("users").doc(user.uid)
            
            currentUser.get()
                .then(userDoc => {
                    
                    let userName = userDoc.data().name;
                    let userDonateNotification = userDoc.data().notifyDonate;
                    let userTakeNotification = userDoc.data().notifyTake;
                
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }

                    if (userDonateNotification == true) {
                        document.getElementById("notif-donations").checked = true;
                    } else {
                        document.getElementById("notif-donations").checked = false;
                    }

                    if (userTakeNotification == true) {
                        document.getElementById("notif-taken").checked = true;
                    } else {
                        document.getElementById("notif-taken").checked = false;
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
    if (document.getElementById('notif-donations').checked = true) {
        userDonateNotification = true;
    } else {
        userDonateNotification = false;
    }     

    if (document.getElementById('notif-taken').checked = true) {
        userTakeNotification = true;
    }  else {
        userTakeNotification = false;
    }

    currentUser.update({
        name: userName,
        notifyDonate: userDonateNotification,
        notifyTake: userTakeNotification
    })


    .then(() => {
        console.log("Document successfully updated!");
    })

    document.getElementById('personalInfoFields').disabled = true;
}