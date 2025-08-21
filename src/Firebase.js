import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable analytics only in production
let analytics;
if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  analytics = getAnalytics(app);
}

// Functions
const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await updateProfile(user, { displayName: name });

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email
    });

    return user;
  } catch (err) {
    console.error(err);
    let message;
    switch (err.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered. Please sign in.";
        break;
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters.";
        break;
      default:
        message = "Error during signup. Please try again.";
    }
    throw new Error(message);
  }
};


const login = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Firebase login error:", err.code, err.message);
    let message;
    switch (err.code) {
      case "auth/user-not-found":
        message = "No account found with this email.";
        break;
      case "auth/wrong-password":
      case "auth/invalid-credential": // <-- handle new Firebase v9+ error
        message = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled. Contact support.";
        break;
      default:
        message = "Error during login. Please try again.";
    }
    throw new Error(message);
  }
};

const signOutUser = () => signOut(auth);

export { auth, db, signup, login, signOutUser };