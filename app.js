// Memuat data dari data.json (khusus halaman dashboard)
async function loadArtistData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Gagal mengambil data.');

        const data = await response.json();

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

// Jalankan fungsi data saat halaman dashboard dibuka
loadArtistData();
