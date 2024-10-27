import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDaCSNH86fj-91A9-IlQ8cBA2H2GP01YvM",
  authDomain: "codingtask-bde07.firebaseapp.com",
  databaseURL:
    "https://codingtask-bde07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codingtask-bde07",
  storageBucket: "codingtask-bde07.appspot.com",
  messagingSenderId: "754819618462",
  appId: "1:754819618462:web:79d3c969046814d9d08d8f",
  measurementId: "G-HB924PHSZN",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
