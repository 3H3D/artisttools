document.addEventListener("DOMContentLoaded", () => {
  loadArtistData();
});

async function loadArtistData() {
  try {
    // Mengambil file data.json (Di masa depan, ganti URL ini dengan endpoint API backend)
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Gagal memuat data sistem.');
    }
    
    const data = await response.json();
    
    // Render Informasi Statistik ke Halaman
    document.getElementById('total-streams').textContent = data.stats.totalStreams;
    document.getElementById('monthly-listeners').textContent = data.stats.monthlyListeners;
    document.getElementById('total-earnings').textContent = data.stats.totalEarnings;
    
    // Render Tabel Daftar Rilis Katalog
    const tableBody = document.getElementById('releases-table-body');
    tableBody.innerHTML = ''; // Bersihkan kontainer
    
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
    console.error('Terjadi kesalahan:', error);
  }
}
