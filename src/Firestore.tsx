import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBctQeYExNatBAs4TY1pduvTxoRFMEZYD4",
  authDomain: "pokladna2-3b00e.firebaseapp.com",
  databaseURL: "https://pokladna2-3b00e.firebaseio.com",
  projectId: "pokladna2-3b00e",
  storageBucket: "pokladna2-3b00e.appspot.com",
  messagingSenderId: "190043641931",
  appId: "1:190043641931:web:243496b8c7c75446c015ce"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

