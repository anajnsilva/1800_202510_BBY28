// Function to display red badge on bell icon when there are user notifications

// Function to display red bade on bell icon when there are user notifications
function displayBadge() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users").doc(user.uid).collection("notifications").get().then(docs => {
          let badge = document.getElementById('red-badge');
        
          console.log(docs.docs);
          if (docs.docs.length > 0) {
            console.log("removing d-none")
            badge.classList.remove("d-none");
          } else {
            console.log("adding d-none")
            badge.classList.add("d-none");
          }
        })
        .catch(error => {
            console.error(error);
        })
      }
    })
  } displayBadge();

// Function to populate user notifications in the off canvas element

function populateNotifications() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users")
            .doc(user.uid)
            .collection("notifications")
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    let docData = doc.data();
                    let body = docData.message;
                    let newcard = document.querySelector('.notification-template').cloneNode(true);

                    newcard.querySelector('.notif-body').innerHTML = body;

                    document.querySelector('.offcanvas-body').appendChild(newcard);
                })
            })
        }
    })
}
populateNotifications();


// Function for user to dismiss all notifications when clicking the dismiss button in the offcanvas element

function dismissNotifications() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users").doc(user.uid).collection("notifications").get().then(docs => {
          docs.forEach(doc => {
            let docID = doc.id;
            db.collection("users").doc(user.uid).collection("notifications").doc(docID).delete();
          })
  
          displayBadge();
          location.reload();
        })    
      } 
    }) 
  }

    
