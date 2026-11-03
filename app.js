import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
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

// Elemen DOM (Pastikan id ini ada di file HTML Anda)
const loginForm = document.getElementById('login-form');
const registerBtn = document.getElementById('register-btn'); // Tombol daftar (opsional jika dipisah)
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');

// Proteksi: Jika user belum login, arahkan kembali ke halaman login.html
// (Hanya aktifkan blok ini jika file ini dipakai di halaman index.html/dashboard)
if (window.location.pathname.includes('index.html')) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'login.html';
        } else {
            loadArtistData();
        }
    });
}

// Proses Login
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
            if (authError) authError.textContent = 'Gagal masuk: Email atau password salah!';
        }
    });
}

// ----------------------------------------------------
// FUNGSI TAMBAHAN: Pendaftaran Akun Baru (Sign Up)
// ----------------------------------------------------
async function registerNewAccount(email, password) {
    try {
        // Membuat akun baru di Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Akun berhasil didaftarkan:", userCredential.user);
        
        // Setelah berhasil daftar, langsung arahkan ke dashboard
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Gagal mendaftar:", error.message);
        if (authError) {
            authError.textContent = 'Pendaftaran gagal: ' + error.message;
        } else {
            alert('Pendaftaran gagal: ' + error.message);
        }
    }
}

// Contoh jika Anda punya tombol khusus "Daftar" di HTML dengan id="register-btn"
if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        registerNewAccount(email, password);
    });
}

// Tombol Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        });
    });
}

// Memuat data dari data.json (untuk dashboard)
async function loadArtistData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Gagal mengambil data.');

        const data = await response.json();

        // Pastikan elemen ID ini ada di file HTML dashboard Anda
        if(document.getElementById('total-streams')) document.getElementById('total-streams').textContent = data.stats.totalStreams;
        if(document.getElementById('monthly-listeners')) document.getElementById('monthly-listeners').textContent = data.stats.monthlyListeners;
        if(document.getElementById('total-earnings')) document.getElementById('total-earnings').textContent = data.stats.totalEarnings;

        const tableBody = document.getElementById('releases-table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
            data.releases.forEach(release => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${release.title}</strong></td>
                    <td><code>${release.isrc}</code></td>
                    <td>${release.streams}</td>
                    <td>${release.releaseDate}</td>
                `;
                tableBody.appendChild(row);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
