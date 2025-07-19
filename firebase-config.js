const firebaseConfig = {
  apiKey: "TA_CLÉ",
  authDomain: "ton-projet.firebaseapp.com",
  databaseURL: "https://ton-projet.firebaseio.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "XXX",
  appId: "1:XXX:web:XXX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();