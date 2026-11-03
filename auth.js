import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const registerBtn = document.getElementById('register-btn');
const authError = document.getElementById('auth-error');

// 1. Proses saat tombol Login ("Access Dashboard") ditekan
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (authError) authError.textContent = '';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'index.html'; // Masuk ke dashboard utama
        } catch (error) {
            if (authError) authError.textContent = 'Email atau password salah!';
        }
    });
}

// 2. Proses saat tombol Register ("Register New Account") diklik
if (registerBtn) {
    registerBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (authError) authError.textContent = '';

        try {
            // Mendaftarkan akun baru ke Firebase
            await createUserWithEmailAndPassword(auth, email, password);
            // Jika berhasil daftar, otomatis langsung masuk ke dashboard
            window.location.href = 'index.html';
        } catch (error) {
            if (authError) {
                authError.textContent = 'Pendaftaran gagal: ' + error.message;
            } else {
                alert('Pendaftaran gagal: ' + error.message);
            }
        }
    });
}
