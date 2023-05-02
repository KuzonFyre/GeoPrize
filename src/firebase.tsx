// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp, } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import {connectAuthEmulator, getAuth, onAuthStateChanged} from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, initializeFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_authDomain,
  projectId: import.meta.env.VITE_FIREBASE_projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_appId,
  measurementId: import.meta.env.VITE_FIREBASE_measurementId
};


console.log(firebaseConfig.apiKey, firebaseConfig.authDomain, firebaseConfig.projectId, firebaseConfig.storageBucket, firebaseConfig.messagingSenderId, firebaseConfig.appId, firebaseConfig.measurementId)
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true// this line
})
//const analytics: Analytics = getAnalytics(app);
const auth = getAuth(app);
// const db = getFirestore();

connectFirestoreEmulator(db, '127.0.0.1', 8080);
connectAuthEmulator(auth, "http://127.0.0.1:9099");

export {app, auth, db}