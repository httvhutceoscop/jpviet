const STORAGE_KEY = 'jpviet_flashcard_known';

async function loadData(){
  const res = await fetch('data/vocab.json');
  return await res.json();
}

function getKnownSet(){
  const raw = localStorage.getItem(STORAGE_KEY);
  try { return new Set(JSON.parse(raw) || []); } catch { return new Set(); }
}

function saveKnownSet(set){
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

let words = [];
let idx = 0;
let known = getKnownSet();
let showMeaning = false;

function renderProgress(){
  const progress = document.getElementById('progress');
  progress.textContent = `Đã nhớ: ${known.size} | Đang ở thẻ ${idx+1}/${words.length}`;
}

function renderCard(){
  if(words.length === 0){
    document.getElementById('flashcard').textContent = 'Không có dữ liệu.';
    return;
  }
  const w = words[idx];
  const content = showMeaning
    ? `${w.meaning}`
    : `${w.kanji ? w.kanji + ' / ' : ''}${w.kana} (${w.romaji})`;
  document.getElementById('flashcard').textContent = content;
  renderProgress();
}

function nextWord(){
  idx = (idx + 1) % words.length;
  showMeaning = false;
  renderCard();
}

function rememberWord(){
  const w = words[idx];
  known.add(w.romaji);
  saveKnownSet(known);
  nextWord();
}

function toggleMeaning(){
  showMeaning = !showMeaning;
  renderCard();
}

async function initFlashcard(){
  words = await loadData();
  // Ưu tiên những từ chưa nhớ
  words.sort((a,b)=> (known.has(a.romaji) - known.has(b.romaji)) || a.romaji.localeCompare(b.romaji));
  idx = 0;
  renderCard();
  document.getElementById('btn-next').addEventListener('click', nextWord);
  document.getElementById('btn-remember').addEventListener('click', rememberWord);
  document.getElementById('btn-show').addEventListener('click', toggleMeaning);
}

document.addEventListener('DOMContentLoaded', initFlashcard);
