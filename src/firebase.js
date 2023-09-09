import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDJD63j0tXMzU5RTR90HNVsPVy7ykp60go",
  authDomain: "disneyplus-311db.firebaseapp.com",
  projectId: "disneyplus-311db",
  storageBucket: "disneyplus-311db.appspot.com",
  messagingSenderId: "1007933097048",
  appId: "1:1007933097048:web:894074c61421d5c9f0b62d",
  measurementId: "G-5NZ0CX61X9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export { auth, provider, storage };
export default db;

