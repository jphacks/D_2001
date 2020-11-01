import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC3SF6gjp3OvKDKJ9mFvhY4d5FUarlJ_Iw",
    authDomain: "name-it-38fb8.firebaseapp.com",
    databaseURL: "https://name-it-38fb8.firebaseio.com",
    projectId: "name-it-38fb8",
    storageBucket: "name-it-38fb8.appspot.com",
    messagingSenderId: "769981424574",
    appId: "1:769981424574:web:5cf55b20aae1b1afe80fef",
    measurementId: "G-BL24RV2HJK"
});

export const db = firebaseApp.firestore();