import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZniPhpWq1oUuBSXLemtH4Du7XClsRPmY",
  authDomain: "prepgenius-ai-63236.firebaseapp.com",
  projectId: "prepgenius-ai-63236",
  storageBucket: "prepgenius-ai-63236.firebasestorage.app",
  messagingSenderId: "462205670063",
  appId: "1:462205670063:web:6c3919ed9fc0da2bcbba5a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
