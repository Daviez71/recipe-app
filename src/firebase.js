import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyAiEP4szxYY4nVNypCGapYKW8fGlPZDBXE",
  authDomain: "recipe-app-88c06.firebaseapp.com",
  projectId: "recipe-app-88c06",
  storageBucket: "recipe-app-88c06.firebasestorage.app",
  messagingSenderId: "917952980317",
  appId: "1:917952980317:web:3c119a73ef702585bd34b4",
  measurementId: "G-PTE71JBVTE"
}


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);