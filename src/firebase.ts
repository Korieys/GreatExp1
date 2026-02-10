import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCXG1dNqCWvpSY6qrBX_m8ru5ktkvpBKEM",
    authDomain: "greatexp-a3b99.firebaseapp.com",
    projectId: "greatexp-a3b99",
    storageBucket: "greatexp-a3b99.firebasestorage.app",
    messagingSenderId: "318856053284",
    appId: "1:318856053284:web:74066c56a123aeeadeceb1",
    measurementId: "G-1W9SWTB5JD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, analytics };
export default app;
