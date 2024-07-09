import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "codeophile-69940.firebaseapp.com",
  projectId: "codeophile-69940",
  storageBucket: "codeophile-69940.appspot.com",
  messagingSenderId: "1075231610994",
  appId: "1:1075231610994:web:86f226c4fe0b3c6e5b0aeb"
};


const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export default app;