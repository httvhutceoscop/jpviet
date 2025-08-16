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
        <td class="${w.kanji ? 'kanji-cell' : ''}" ${w.kanji ? `onclick="playAudio('${w.kanji}', 'kanji')" title="Click để nghe: ${w.kanji}"` : ''}>${w.kanji || ''}</td>
        <td class="kana-cell" onclick="playAudio('${w.kana}', 'kana')" title="Click để nghe: ${w.kana}">${w.kana}</td>
        <td>${w.romaji}</td>
        <td>${w.meaning}</td>
        <td><span class="jlpt-badge jlpt-${w.jlpt_level.toLowerCase()}">${w.jlpt_level}</span></td>
        <td>
          <button class="audio-btn" onclick="playAudio('${w.kana}', 'kana')" title="Phát âm: ${w.kana}">
            🔊
          </button>
        </td>
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

// Web Speech API cho phát âm tiếng Nhật
let speechSynthesis = window.speechSynthesis;
let voices = [];

// Load voices khi trang load
function loadVoices() {
  voices = speechSynthesis.getVoices();
  
  // Filter Japanese voices nếu có
  const japaneseVoices = voices.filter(voice => 
    voice.lang.includes('ja') || voice.lang.includes('JP')
  );
  
  // Sử dụng Japanese voice nếu có, nếu không thì dùng voice đầu tiên
  if (japaneseVoices.length > 0) {
    return japaneseVoices[0];
  }
  return voices.length > 0 ? voices[0] : null;
}

// Khởi tạo voices
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

function playAudio(text, type = 'kana') {
  // Dừng audio đang phát
  speechSynthesis.cancel();
  
  // Lấy text để phát âm
  let textToSpeak = text;
  
  // Nếu type là 'file', sử dụng tên file để lấy text từ vocab
  if (type === 'file' && text) {
    // Tìm vocab theo audio file
    const vocabTable = document.querySelector('#vocab-table tbody');
    const rows = vocabTable.querySelectorAll('tr');
    
    for (let row of rows) {
      const cells = row.querySelectorAll('td');
      const audioCell = cells[5]; // Cột audio
      const audioButton = audioCell.querySelector('button');
      
      if (audioButton && audioButton.onclick.toString().includes(text)) {
        const kanaCell = cells[1]; // Cột kana
        textToSpeak = kanaCell.textContent;
        break;
      }
    }
  }
  
  if (!textToSpeak) {
    showNotification('Không có text để phát âm', 'error');
    return;
  }
  
  try {
    // Tìm button đang được click để thêm visual feedback
    const clickedButton = event.target;
    if (clickedButton && clickedButton.classList.contains('audio-btn')) {
      clickedButton.classList.add('playing');
    }
    
    // Tạo utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Chọn voice
    const voice = loadVoices();
    if (voice) {
      utterance.voice = voice;
    }
    
    // Cài đặt thuộc tính
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8; // Tốc độ chậm hơn để dễ nghe
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Event handlers
    utterance.onstart = () => {
      showNotification(`Đang phát âm: ${textToSpeak}`, 'info');
    };
    
    utterance.onend = () => {
      showNotification(`Đã phát âm xong: ${textToSpeak}`, 'success');
      // Xóa visual feedback
      if (clickedButton) {
        clickedButton.classList.remove('playing');
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      showNotification('Lỗi khi phát âm', 'error');
      // Xóa visual feedback
      if (clickedButton) {
        clickedButton.classList.remove('playing');
      }
    };
    
    // Phát âm
    speechSynthesis.speak(utterance);
    
  } catch (error) {
    console.error('Error playing audio:', error);
    showNotification('Lỗi khi phát âm: ' + error.message, 'error');
    // Xóa visual feedback
    if (clickedButton) {
      clickedButton.classList.remove('playing');
    }
  }
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
  // Tạo notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style cho notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Màu sắc theo type
  switch (type) {
    case 'success':
      notification.style.background = '#10b981';
      break;
    case 'error':
      notification.style.background = '#ef4444';
      break;
    case 'info':
      notification.style.background = '#3b82f6';
      break;
    default:
      notification.style.background = '#6b7280';
  }
  
  // Thêm vào body
  document.body.appendChild(notification);
  
  // Hiển thị với animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}
