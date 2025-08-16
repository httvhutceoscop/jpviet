async function loadVocab(){
  const res = await fetch('data/vocab.json');
  const vocab = await res.json();
  const tbody = document.querySelector('#vocab-table tbody');
  const count = document.getElementById('count');

  function render(list){
    tbody.innerHTML = list.map(w => `
      <tr>
        <td>${w.kanji || ''}</td>
        <td>${w.kana}</td>
        <td>${w.romaji}</td>
        <td>${w.meaning}</td>
        <td><button onclick="playAudio('${w.audio || ''}')">🔊</button></td>
      </tr>
    `).join('');
    count.textContent = `${list.length} / ${vocab.length} từ`;
  }

  render(vocab);

  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    if(!q){ render(vocab); return; }
    const filtered = vocab.filter(w =>
      (w.kanji||'').toLowerCase().includes(q) ||
      w.kana.toLowerCase().includes(q) ||
      w.romaji.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q)
    );
    render(filtered);
  });
}

function playAudio(file){
  if(!file){ alert('Chưa gán file audio cho mục này.'); return; }
  const a = new Audio(`audio/${file}`);
  a.play().catch(()=>alert('Không phát được audio. Hãy thay file mp3 mẫu trong thư mục audio.'));
}
