



function goDirection() {
    navigator.geolocation.getCurrentPosition(function(position) {
      let userLat = position.coords.latitude;
      let userLng = position.coords.longitude;

      let location = 
  
      db.collection("fridges").doc(location).get().then(function(doc) {
        let address = doc.data().address;
      });
    });
    let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;




  }
  