import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBMMl8bY4dZNKGw6Xx0ZV8cBzCHdJw6YlE",
    authDomain: "spotfy2.firebaseapp.com",
    databaseURL: "https://spotfy2-default-rtdb.firebaseio.com",
    projectId: "spotfy2",
    storageBucket: "spotfy2.firebasestorage.app",
    messagingSenderId: "618259174510",
    appId: "1:618259174510:web:2200022b34ee749e72027f",
    measurementId: "G-2EKL7HSTKT"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);