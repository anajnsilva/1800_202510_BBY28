var currentUser;  

// Function to display the user's information
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            currentUser = db.collection("users").doc(user.uid)
            
            currentUser.get()
                .then(userDoc => {
                    
                    let userName = userDoc.data().name;
                    let userDonateNotification = userDoc.data().notifyDonate;
                                    
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }

                    if (userDonateNotification == true) {
                        document.getElementById("notif-donations").checked = true;
                    } else {
                        document.getElementById("notif-donations").checked = false;
                    }
                })
        } else {
            
            console.log("No user is signed in");
        }
    });
}
populateUserInfo();

// Function to edit the user's information on the user's collection document
function editUserInfo() {
    
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {

    userName = document.getElementById('nameInput').value; 

    if (document.getElementById('notif-donations').checked == true) {
        userDonateNotification = true;
    } else {
        userDonateNotification = false;
    }     

    currentUser.update({
        name: userName,
        notifyDonate: userDonateNotification,
    })


    .then(() => {
        console.log("Document successfully updated!");
    })

    document.getElementById('personalInfoFields').disabled = true;
}