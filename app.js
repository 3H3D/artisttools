import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const logoutBtn = document.getElementById('logout-btn');

// Proteksi: Jika user belum login, tendang kembali ke halaman login.html
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        loadArtistData();
    }
});

// Tombol Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    });
});

// Memuat data dari data.json
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
