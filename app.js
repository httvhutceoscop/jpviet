async function loadVocab(){
  const res = await fetch('data/vocab.json');
  const vocab = await res.json();
  const tbody = document.querySelector('#vocab-table tbody');
  const count = document.getElementById('count');

  // Create JLPT level filter
  createJLPTFilter();

  function render(list){
    tbody.innerHTML = list.map(w => `
      <tr>
        <td>${w.kanji || ''}</td>
        <td>${w.kana}</td>
        <td>${w.romaji}</td>
        <td>${w.meaning}</td>
        <td><span class="jlpt-badge jlpt-${w.jlpt_level.toLowerCase()}">${w.jlpt_level}</span></td>
        <td><button onclick="playAudio('${w.audio || ''}')">🔊</button></td>
      </tr>
    `).join('');
    count.textContent = `${list.length} / ${vocab.length} từ`;
  }

  render(vocab);

  // Search functionality
  document.getElementById('search').addEventListener('input', e => {
    filterVocab();
  });

  // JLPT filter functionality
  document.querySelectorAll('.jlpt-filter input').forEach(input => {
    input.addEventListener('change', filterVocab);
  });

  function filterVocab() {
    const searchQuery = document.getElementById('search').value.trim().toLowerCase();
    const selectedLevels = Array.from(document.querySelectorAll('.jlpt-filter input:checked'))
      .map(input => input.value);

    let filtered = vocab;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(w =>
        (w.kanji||'').toLowerCase().includes(searchQuery) ||
        w.kana.toLowerCase().includes(searchQuery) ||
        w.romaji.toLowerCase().includes(searchQuery) ||
        w.meaning.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by JLPT level
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(w => selectedLevels.includes(w.jlpt_level));
    }

    render(filtered);
  }
}

function createJLPTFilter() {
  const toolbar = document.querySelector('.toolbar');
  const jlptFilter = document.createElement('div');
  jlptFilter.className = 'jlpt-filter';
  jlptFilter.innerHTML = `
    <div class="jlpt-options">
      <label><input type="checkbox" value="N5" checked> N5</label>
      <label><input type="checkbox" value="N4" checked> N4</label>
      <label><input type="checkbox" value="N3" checked> N3</label>
      <label><input type="checkbox" value="N2" checked> N2</label>
      <label><input type="checkbox" value="N1" checked> N1</label>
    </div>
  `;
  toolbar.appendChild(jlptFilter);
}

function playAudio(file){
  if(!file){ alert('Chưa gán file audio cho mục này.'); return; }
  const a = new Audio(`audio/${file}`);
  a.play().catch(()=>alert('Không phát được audio. Hãy thay file mp3 mẫu trong thư mục audio.'));
}
