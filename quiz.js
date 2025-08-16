async function loadQuizData(){
  const [vocabRes, grammarRes] = await Promise.all([
    fetch('data/vocab.json'),
    fetch('data/grammar.json')
  ]);
  const vocab = await vocabRes.json();
  const grammar = await grammarRes.json();
  return { vocab, grammar };
}

function makeVocabQuestion(w, all){
  // Hỏi nghĩa của từ
  const correct = w.meaning;
  const distractors = all
    .filter(x => x.meaning !== correct)
    .sort(()=>Math.random()-0.5)
    .slice(0, 3)
    .map(x=>x.meaning);
  const options = [correct, ...distractors].sort(()=>Math.random()-0.5);
  const stem = `Nghĩa của “${w.kana}${w.kanji ? ' / '+w.kanji : ''} (${w.romaji})” là gì?`;
  return { stem, options, answer: options.indexOf(correct) };
}

function renderQuiz(questions){
  const wrap = document.getElementById('quiz-container');
  wrap.innerHTML = questions.map((q,i)=>`
    <div class="card q">
      <h3>Câu ${i+1}</h3>
      <p>${q.stem}</p>
      ${q.options.map((opt,idx)=>`
        <label class="opt">
          <input type="radio" name="q${i}" value="${idx}"> ${opt}
        </label>
      `).join('')}
    </div>
  `).join('');

  document.getElementById('btn-check').onclick = () => {
    let score = 0;
    questions.forEach((q,i)=>{
      const sel = document.querySelector(`input[name="q${i}"]:checked`);
      if(sel && Number(sel.value) === q.answer) score++;
    });
    document.getElementById('result').textContent = `Bạn đúng ${score}/${questions.length} câu`;
  };
}

async function initQuiz(){
  const { vocab } = await loadQuizData();
  // Lấy tối đa 8 câu từ vocab
  const pool = vocab.slice().sort(()=>Math.random()-0.5).slice(0, Math.min(8, vocab.length));
  const questions = pool.map(w => makeVocabQuestion(w, vocab));
  renderQuiz(questions);
}

document.addEventListener('DOMContentLoaded', initQuiz);
