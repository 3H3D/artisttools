import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyBeVIIJ3nbCEuUhYPRvb21eofNSi4FlKl0",
  authDomain: "my-app-8edk2j.firebaseapp.com",
  projectId: "my-app-8edk2j",
  storageBucket: "my-app-8edk2j.firebasestorage.app",
  messagingSenderId: "116161205939",
  appId: "1:116161205939:web:8cb9de710880d65b3442c6",
  measurementId: "G-WZFWH40K5Q"
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
