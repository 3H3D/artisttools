const SUPABASE_URL = 'https://fvzayaghmxskcvwbllpr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2emF5YWdobXhza2N2d2JsbHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTkzMDcsImV4cCI6MjEwOTYzNTMwN30.vbICKBavN-4lVBSm_oQfVK9Z9tmy18D4B7a_9YqgGhI';

// Inisialisasi Klien Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Pengecekan Sesi Login Artis (Aman dari Looping / Berkedip)
async function checkAuth() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session) {
      window.location.replace('login.html');
    } else {
      updateUserInfo(session);
    }
  } catch (err) {
    window.location.replace('login.html');
  }
}
checkAuth();

// Fungsi untuk menarik nama artis langsung dari database Supabase
async function updateUserInfo(session) {
  const userId = session.user.id;

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('artist_name')
    .eq('id', userId)
    .single();

  let artistName = "ARTIST";
  
  if (!error && data && data.artist_name) {
    artistName = data.artist_name.toUpperCase();
  } else {
    const userEmail = session.user.email || "Artist";
    artistName = userEmail.split('@')[0].toUpperCase();
  }

  const artistInitial = artistName.charAt(0);

  const nameElement = document.getElementById('user-display-name');
  const avatarElement = document.getElementById('user-avatar');

  if (nameElement) nameElement.innerText = artistName;
  if (avatarElement) avatarElement.innerText = artistInitial;
}

// ----------------------------------------------------
// FITUR KELUAR (LOGOUT) & KEAMANAN SESI OTOMATIS
// ----------------------------------------------------

async function handleLogout() {
  try {
    await supabaseClient.auth.signOut();
  } catch (e) {
    console.error(e);
  }
  window.location.replace('login.html');
}

// Auto-Logout jika tidak ada aktivitas selama 15 menit
let inactivityTimer;
const inactivityLimit = 15 * 60 * 1000; 

async function triggerAutoLogout() {
  try {
    await supabaseClient.auth.signOut();
  } catch (e) {
    console.error(e);
  }
  alert("Sesi Anda telah kedaluwarsa karena tidak ada aktivitas. Silakan login kembali.");
  window.location.replace('login.html');
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(triggerAutoLogout, inactivityLimit);
}

window.onload = resetInactivityTimer;
window.onmousemove = resetInactivityTimer;
window.onkeypress = resetInactivityTimer;
window.onclick = resetInactivityTimer;
window.onscroll = resetInactivityTimer;

// Navigasi Menu Dashboard
function navigateTo(sectionId, clickedElement) {
  const sections = document.querySelectorAll('.app-section');
  sections.forEach(sec => sec.style.display = 'none');

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }

  const navItems = document.querySelectorAll('.tc-nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  if (clickedElement) {
    clickedElement.classList.add('active');
  }

  if (sectionId === 'section-my-catalog') {
    loadCatalogData();
  }
}

// Ambil Data Katalog Rilis (Khusus Tampilan Artis)
async function loadCatalogData() {
  const catalogContainer = document.getElementById('catalog-list');
  if (!catalogContainer) return;
  catalogContainer.innerHTML = 'Loading catalog data...';

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    catalogContainer.innerHTML = 'Please sign in to view your catalog.';
    return;
  }

  const { data: releases, error } = await supabaseClient
    .from('releases')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) {
    catalogContainer.innerHTML = 'Failed to load catalog: ' + error.message;
    return;
  }

  if (releases.length === 0) {
    catalogContainer.innerHTML = 'No distributed releases found yet.';
    return;
  }

  let html = '<div style="display:flex; flex-direction:column; gap:12px;">';
  releases.forEach(rel => {
    html += `
      <div style="background:#111; border:1px solid #222; padding:16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="margin:0; color:#fff;">${rel.title || 'Untitled'}</h4>
          <span style="font-size:12px; color:#a0a0a0;">Artist: ${rel.artist || '-'}</span>
        </div>
        <div style="text-align:right; font-size:12px; color:#888;">
          <div>UPC: ${rel.upc || 'Pending (B2B Sync)'}</div>
          <div>ISRC: ${rel.isrc || 'Pending (B2B Sync)'}</div>
        </div>
      </div>
    `;
  });
  html += '</div>';

  catalogContainer.innerHTML = html;
}

// Validasi & Penanganan File Audio Tunggal/Dinamis
function handleSingleAudioSelect(input) {
  const statusText = input.parentElement.querySelector('.audio-status-text');
  if (input.files && input.files[0]) {
    statusText.innerText = `Selected: ${input.files[0].name}`;
    statusText.style.color = "#10b981";
  }
}

// Validasi Ketat Cover Art (Min 3000x3000px & Format Square)
function handleCoverSelect(input) {
  const statusText = document.getElementById('cover-status-text') || input.parentElement.querySelector('.cover-status-text');
  const nextBtn = document.getElementById('next-btn');

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = function() {
      URL.revokeObjectURL(objectUrl);
      if (img.width < 3000 || img.height < 3000) {
        alert(`Resolusi gambar terlalu kecil (${img.width}x${img.height}px). Standar DSP wajib minimal 3000 x 3000 pixels!`);
        if (statusText) {
          statusText.innerText = "Error: Resolusi minimal 3000x3000px!";
          statusText.style.color = "#ff5555";
        }
        if (nextBtn) {
          nextBtn.style.background = "#374151";
          nextBtn.style.color = "#aaa";
          nextBtn.style.pointerEvents = "none";
        }
        input.value = "";
        return;
      }

      if (img.width !== img.height) {
        alert("Cover art harus berbentuk persegi (Square 1:1 ratio)!");
        if (statusText) {
          statusText.innerText = "Error: Rasio harus 1:1 (Persegi)!";
          statusText.style.color = "#ff5555";
        }
        if (nextBtn) {
          nextBtn.style.background = "#374151";
          nextBtn.style.color = "#aaa";
          nextBtn.style.pointerEvents = "none";
        }
        input.value = "";
        return;
      }

      // Jika Validasi Berhasil
      if (statusText) {
        statusText.innerText = `Selected & Verified: ${file.name} (${img.width}x${img.height}px)`;
        statusText.style.color = "#10b981";
      }
      if (nextBtn) {
        nextBtn.style.background = "#ff2a2a";
        nextBtn.style.color = "#fff";
        nextBtn.style.pointerEvents = "auto";
        nextBtn.title = "Proceed to submit release";
      }
    };
    img.src = objectUrl;
  }
}

// ----------------------------------------------------
// FUNGSI DINAMIS: TAMBAH ARTIS & KREDIT KONTRIBUTOR
// ----------------------------------------------------

function addArtistField() {
  const container = document.getElementById('artists-container');
  
  const wrapper = document.createElement('div');
  wrapper.className = 'artist-row';
  wrapper.style.cssText = 'display: grid; grid-template-columns: 180px 1fr auto; gap: 10px; align-items: center;';

  wrapper.innerHTML = `
    <select class="artist-role" style="padding: 12px; background: #07090f; border: 1px solid #222; color: #fff; border-radius: 6px; font-size: 12px;">
      <option value="Featuring">Featured Artist (Ft.)</option>
      <option value="Primary Artist">Primary Artist</option>
      <option value="Remixer">Remixer</option>
    </select>
    <input type="text" class="artist-name-input" placeholder="Enter artist name (e.g. ANDER)" required style="width: 100%; padding: 12px; background: #07090f; border: 1px solid #222; color: #fff; border-radius: 6px; font-size: 12px; box-sizing: border-box;">
    <button type="button" onclick="this.parentElement.remove()" style="background: #1a1111; color: #ff5555; border: 1px solid #332222; padding: 12px 14px; border-radius: 6px; cursor: pointer;" title="Remove">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  container.appendChild(wrapper);
}

function addCreditField() {
  const container = document.getElementById('credits-container');
  
  const wrapper = document.createElement('div');
  wrapper.className = 'credit-row';
  wrapper.style.cssText = 'display: grid; grid-template-columns: 180px 1fr auto; gap: 10px; align-items: center;';

  wrapper.innerHTML = `
    <select class="credit-role" style="padding: 12px; background: #07090f; border: 1px solid #222; color: #fff; border-radius: 6px; font-size: 12px;">
      <option value="Composer">Composer (Pencipta)</option>
      <option value="Lyricist">Lyricist (Lirik)</option>
      <option value="Producer">Music Producer</option>
      <option value="Co-Producer">Co-Producer</option>
    </select>
    <input type="text" class="credit-name" placeholder="Enter legal full name" required style="width: 100%; padding: 12px; background: #07090f; border: 1px solid #222; color: #fff; border-radius: 6px; font-size: 12px; box-sizing: border-box;">
    <button type="button" onclick="this.parentElement.remove()" style="background: #1a1111; color: #ff5555; border: 1px solid #332222; padding: 12px 14px; border-radius: 6px; cursor: pointer;" title="Remove">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  container.appendChild(wrapper);
}

// Event Listener Submit: Upload File ke Storage + Simpan Metadata Lengkap ke Database
const releaseForm = document.getElementById('artist-release-form');
if (releaseForm) {
  releaseForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const releaseTitle = document.getElementById('title-input') ? document.getElementById('title-input').value : "Untitled Release";
    const trackGenre = document.getElementById('genre') ? document.getElementById('genre').value : "Electronic";
    const pLine = document.getElementById('pline-input') ? document.getElementById('pline-input').value : "2026 Ferwap Music Entertainment";
    const cLine = document.getElementById('cline-input') ? document.getElementById('cline-input').value : "2026 Ferwap Music Entertainment";
    
    // Mengambil data dari baris-baris artis dinamis
    const artistRows = document.querySelectorAll('.artist-row');
    let primaryArtist = "";
    let allArtistsSummary = [];
    
    artistRows.forEach(row => {
      const roleSelect = row.querySelector('.artist-role').value;
      const nameInput = row.querySelector('input').value.trim();
      if (nameInput) {
        if (roleSelect === 'Primary Artist' && !primaryArtist) {
          primaryArtist = nameInput;
        }
        allArtistsSummary.push(`${roleSelect}: ${nameInput}`);
      }
    });

    const singleArtistInput = document.getElementById('artist-input');
    if (!primaryArtist && singleArtistInput) {
      primaryArtist = singleArtistInput.value.trim();
    }

    // Mengambil data dari baris-baris kredit kontributor dinamis
    const creditRows = document.querySelectorAll('.credit-row');
    let creditsList = [];
    let primaryComposer = "";
    let primaryProducer = "";

    creditRows.forEach(row => {
      const role = row.querySelector('.credit-role').value;
      const name = row.querySelector('.credit-name').value.trim();
      if (name) {
        creditsList.push({ role, name });
        if ((role === 'Composer') && !primaryComposer) primaryComposer = name;
        if ((role === 'Producer' || role === 'Co-Producer') && !primaryProducer) primaryProducer = name;
      }
    });

    const audioInput = document.getElementById('audio-input');
    const coverInput = document.getElementById('cover-input');
    const audioFile = audioInput && audioInput.files ? audioInput.files[0] : null;
    const coverFile = coverInput && coverInput.files ? coverInput.files[0] : null;

    if (!releaseTitle || !primaryArtist) {
      alert("Mohon isi Judul Lagu dan Nama Artis Utama terlebih dahulu!");
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]') || document.getElementById('next-btn');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Release';
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading assets...';
      submitBtn.disabled = true;
    }

    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) {
      alert("Sesi login kedaluwarsa. Silakan sign in ulang.");
      window.location.replace('login.html');
      return;
    }

    let audioUrl = '';
    let coverUrl = '';

    // 1. Upload File Audio ke Supabase Storage
    if (audioFile) {
      const audioFileName = `${session.user.id}/${Date.now()}_${audioFile.name}`;
      const { data: audioData, error: audioError } = await supabaseClient.storage
        .from('releases')
        .upload(audioFileName, audioFile);

      if (audioError) {
        alert("Gagal mengunggah file audio: " + audioError.message);
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
        return;
      }
      audioUrl = audioData.path;
    }

    // 2. Upload Cover Art ke Supabase Storage
    if (coverFile) {
      const coverFileName = `${session.user.id}/${Date.now()}_${coverFile.name}`;
      const { data: coverData, error: coverError } = await supabaseClient.storage
        .from('releases')
        .upload(coverFileName, coverFile);

      if (coverError) {
        alert("Gagal mengunggah cover art: " + coverError.message);
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
        return;
      }
      coverUrl = coverData.path;
    }

    // 3. Simpan ke Database dengan Metadata Lengkap
    const { error: dbError } = await supabaseClient
      .from('releases')
      .insert([
        { 
          user_id: session.user.id, 
          title: releaseTitle, 
          artist: primaryArtist,
          genre: trackGenre,
          composer: primaryComposer || (creditsList.length > 0 ? creditsList[0].name : primaryArtist),
          producer: primaryProducer || '-',
          pline: pLine,
          cline: cLine,
          upc: null, 
          isrc: null,
          audio_url: audioUrl,
          cover_url: coverUrl
        }
      ]);

    if (submitBtn) {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }

    if (dbError) {
      alert("Gagal menyimpan ke database: " + dbError.message);
    } else {
      alert(`Berhasil! Rilis "${releaseTitle}" berhasil dikirim ke server. Menunggu sinkronisasi kode dari sistem B2B.`);
      this.reset();
      window.location.replace('index.html');
    }
  });
}
