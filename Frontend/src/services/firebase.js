import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD9L0JDHT9s4sQNH09aYVBnlJ8jxqICbok",
    authDomain: "etutoring-14752.firebaseapp.com",
    databaseURL: "https://etutoring-14752-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "etutoring-14752",
    storageBucket: "etutoring-14752.firebasestorage.app",
    messagingSenderId: "900927595756",
    appId: "1:900927595756:web:3d7ff5d86c165dc83531c9"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Add authentication
const authenticate = async () => {
    try {
        const userCredential = await signInAnonymously(auth);
        console.log("Firebase authentication successful:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Firebase authentication failed:", error.message);
        throw error;
    }
};

export { db, ref, set, onValue, off, auth, authenticate };