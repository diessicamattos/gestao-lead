// admin/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDmITFZ6elPyEFMKFPNg_b1DKYRSvCMk8c",
  authDomain: "teste-860be.firebaseapp.com",
  projectId: "teste-860be",
  storageBucket: "teste-860be.firebasestorage.app",
  messagingSenderId: "572869829344",
  appId: "1:572869829344:web:0d09f9c522c32c1f9c6685"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { serverTimestamp };
