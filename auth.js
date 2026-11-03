import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "ISI_DENGAN_API_KEY_FIREBASE_ANDA",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    authError.textContent = '';

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Jika berhasil login, langsung arahkan ke halaman utama dashboard
        window.location.href = 'index.html';
    } catch (error) {
        authError.textContent = 'Email atau password salah!';
    }
});
