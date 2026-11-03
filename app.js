import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Konfigurasi Firebase dari Dashboard Anda
const firebaseConfig = {
    apiKey: "ISI_DENGAN_API_KEY_FIREBASE_ANDA",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elemen DOM
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');

// --- CTH KEAMANAN: Memeriksa Status Session Login ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User berhasil login: Tampilkan Dashboard & Ambil Data
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        loadArtistData();
    } else {
        // User belum/sudah logout: Tampilkan Form Login
        loginScreen.style.display = 'flex';
        dashboardScreen.style.display = 'none';
    }
});

// --- Fungsi Event Login ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    authError.textContent = '';

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = 'Email atau password salah!';
    }
});

// --- Fungsi Logout ---
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// --- Fungsi Memuat Data dari data.json ---
async function loadArtistData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Gagal mengambil data.');

        const data = await response.json();

        document.getElementById('total-streams').textContent = data.stats.totalStreams;
        document.getElementById('monthly-listeners').textContent = data.stats.monthlyListeners;
        document.getElementById('total-earnings').textContent = data.stats.totalEarnings;

        const tableBody = document.getElementById('releases-table-body');
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

    } catch (error) {
        console.error('Error:', error);
    }
}
