import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For a more secure approach, use environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBpWkw9mKd3dpF0fw4rYR7HJJqJPDTrDBk",
  authDomain: "ftu-llm.firebaseapp.com",
  projectId: "ftu-llm",
  storageBucket: "ftu-llm.firebasestorage.app",
  messagingSenderId: "217326680609",
  appId: "1:217326680609:web:673f1435db766832844160",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider with Drive scope
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
