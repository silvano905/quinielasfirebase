import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, updateProfile, signInWithPopup } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");

const firebaseConfig = {
    apiKey: "AIzaSyCKG_E2-J26370JoFMsMDeVhCFaqEC_k6A",
    authDomain: "quinielas-firebase.firebaseapp.com",
    projectId: "quinielas-firebase",
    storageBucket: "quinielas-firebase.appspot.com",
    messagingSenderId: "18184533126",
    appId: "1:18184533126:web:34a2c0c31e81b324a38d07"
};

const app = initializeApp(firebaseConfig)

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6Lef2CgkAAAAAOHBBvKIPfh8XEOPlgPhHds8_a9-'),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
});

// init services
const db = getFirestore()
const auth = getAuth()
const storage = getStorage();

const imageUploadPost = async (file) => {
    const fileRef = ref(storage, file.name+ '.png');

    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    return photoURL
}

const imageUploadUser = async (file, user, displayName) => {
    const fileRef = ref(storage, user.user.uid + '.png');

    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    await updateProfile(user.user, {photoURL: photoURL, displayName: displayName})
    return photoURL
}

const deleteImage = async (file) => {
    let r = ref(storage, file)
    await deleteObject(r)
}


export {db, auth, imageUploadUser, imageUploadPost, deleteImage}


