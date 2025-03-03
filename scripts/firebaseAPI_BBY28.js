//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyCbqMbJJFC02AD8decxAvfPlpl1VXnv96s",
    authDomain: "becool-bby28.firebaseapp.com",
    projectId: "becool-bby28",
    storageBucket: "becool-bby28.firebasestorage.app",
    messagingSenderId: "974149498988",
    appId: "1:974149498988:web:135f1649f5516af6cc4049"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

