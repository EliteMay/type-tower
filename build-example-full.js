const STEP_META = [
  ['3つの塔と画面切替', '現在の type-tower-a の index.html / main.js をそのまま基準にする。'],
  ['漢字問題をJSONから表示', '今の画面切替を残したまま、漢字問題を1問表示できるようにする。'],
  ['入力して正解 / MISS判定', '入力欄を追加してEnterで答えを判定する。'],
  ['正解 +1F / MISS -1F', '現在階を1F〜10Fで管理し、正解とMISSで上下させる。'],
  ['RESULTまで一本につなぐ', '正解数とMISS数を数え、10FでRESULTへ進める。'],
  ['TIME / COMBO / 難易度', '制限時間・コンボ・難易度を追加する。'],
  ['英訳 / 和訳の塔を接続', 'eiyaku / wayaku の値をそのまま使い、読み込むJSONを切り替える。'],
  ['RESULT詳細と記録保存', '正答率・最大COMBO・クリア時間とベスト記録を追加する。'],
  ['塔内部と階移動演出', '空は固定したまま塔内部だけ動かし、二重入力を防ぐ。'],
  ['最終テスト', 'STEP 9のコードを変えず、3モードを通して確認する。']
];

const USER_MAIN_STEP1 = `let selectedMode='kanji';

document.querySelectorAll('[data-mode]').forEach(button=>{
  button.addEventListener('click',()=>{
    startGame(button.dataset.mode);
  });
});

function startGame(mode) {
  selectedMode=mode;
  showScreen('game');
}

function showScreen(screenName) {
  document.querySelectorAll('[data-screen]').forEach(section => {
    section.hidden = (section.dataset.screen !== screenName);
  });
}
showScreen('select');`;

function buildIndex(step) {
  if (step === 1) {
    return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TYPE TOWER</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
 <section data-screen="select">
   <div class="tower-select">
     <article class="tower-option">
       <div class="tower-image">漢字の塔</div>
       <button data-mode="kanji">この塔に挑戦</button>
     </article>
     <article class="tower-option">
       <div class="tower-image">英訳の塔</div>
       <button data-mode="eiyaku">この塔に挑戦</button>
     </article>
     <article class="tower-option">
       <div class="tower-image">和訳の塔</div>
       <button data-mode="wayaku">この塔に挑戦</button>
     </article>
     </div>
  </section>
  <section data-screen="game" hidden></section>
<section data-screen="result" hidden></section>

  <script src="js/main.js"></script>
</body>
</html>`;
  }

  const difficulty = step >= 6 ? `
   <label class="difficulty-box">
     難易度
     <select id="difficultySelect">
       <option value="easy">EASY</option>
       <option value="normal" selected>NORMAL</option>
       <option value="hard">HARD</option>
     </select>
   </label>` : '';

  const floorRail = step >= 4 ? `
     <aside class="floor-rail">
       <span data-floor="10">10F</span><span data-floor="9">9F</span>
       <span data-floor="8">8F</span><span data-floor="7">7F</span>
       <span data-floor="6">6F</span><span data-floor="5">5F</span>
       <span data-floor="4">4F</span><span data-floor="3">3F</span>
       <span data-floor="2">2F</span><span data-floor="1">1F</span>
     </aside>` : '';

  const modeLabel = step >= 7 ? '<small id="modeLabel">漢字の塔</small>' : '';
  const floorText = step >= 4 ? '<strong id="floorText">1F</strong>' : '';
  const timer = step >= 6 ? '<div class="timer-box">TIME <strong id="timeText">10</strong></div>' : '';
  const questionHintId = step >= 7 ? ' id="questionHint"' : '';
  const form = step >= 3 ? `
       <form id="answerForm" class="answer-form">
         <input id="answerInput" type="text" autocomplete="off" placeholder="答えを入力してEnter">
       </form>
       <p id="judgeMessage" class="judge-message" aria-live="polite"></p>` : '';
  const combo = step >= 6 ? `
       <div class="combo-box">COMBO ×<strong id="comboText">0</strong></div>` : '';
  const scene = step >= 9 ? `
       <div id="towerScene" class="tower-scene" aria-hidden="true">
         <div class="stone-wall"></div>
         <div class="enemy-shape"><span></span></div>
       </div>` : '';

  const result = step >= 5 ? `
 <section data-screen="result" hidden>
   <div class="result-panel">
     <p class="result-kicker">TOWER CLEAR</p>
     <h1 id="resultTitle">漢字の塔 CLEAR</h1>
     <div class="result-grid">
       <div><span>正解</span><strong id="resultCorrect">0</strong></div>
       <div><span>MISS</span><strong id="resultMiss">0</strong></div>${step >= 8 ? `
       <div><span>正答率</span><strong id="resultAccuracy">0%</strong></div>
       <div><span>最大COMBO</span><strong id="resultMaxCombo">0</strong></div>
       <div><span>TIME</span><strong id="resultTime">0.0s</strong></div>` : ''}
     </div>${step >= 8 ? '\n     <p id="bestRecordText" class="best-record"></p>' : ''}
     <div class="result-actions">
       <button id="retryButton">もう一度挑戦</button>
       <button id="resultBackButton">塔選択へ戻る</button>
     </div>
   </div>
 </section>` : '<section data-screen="result" hidden></section>';

  const storageScript = step >= 8 ? '  <script src="js/storage.js"></script>\n' : '';
  const effectsScript = step >= 9 ? '  <script src="js/effects.js"></script>\n' : '';

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TYPE TOWER</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
 <section data-screen="select">${difficulty}
   <div class="tower-select">
     <article class="tower-option">
       <div class="tower-image tower-kanji">漢字の塔</div>
       <button data-mode="kanji">この塔に挑戦</button>
     </article>
     <article class="tower-option">
       <div class="tower-image tower-eiyaku">英訳の塔</div>
       <button data-mode="eiyaku">この塔に挑戦</button>
     </article>
     <article class="tower-option">
       <div class="tower-image tower-wayaku">和訳の塔</div>
       <button data-mode="wayaku">この塔に挑戦</button>
     </article>
   </div>
 </section>

 <section data-screen="game" hidden>${floorRail}
   <button id="gameBackButton" class="back-button">塔選択へ戻る</button>
   <div class="game-stage">${scene}
     <div class="game-hud">
       <div class="hud-top"><div>${modeLabel}${floorText}</div>${timer}</div>
       <div id="questionCard" class="question-card">
         <p${questionHintId}>読みを入力</p>
         <h2 id="questionText">読み込み中…</h2>
       </div>${form}${combo}
     </div>
   </div>
 </section>
${result}

${storageScript}${effectsScript}  <script src="js/game.js"></script>
  <script src="js/main.js"></script>
</body>
</html>`;
}

function buildCss(step) {
  let css = `* { box-sizing: border-box; }
html, body { min-height: 100%; }
body {
  margin: 0;
  font-family: "Yu Gothic UI", "Yu Gothic", sans-serif;
  color: #172034;
  background:
    radial-gradient(ellipse at 16% 22%, rgba(255,255,255,.85) 0 8%, transparent 9%),
    radial-gradient(ellipse at 78% 17%, rgba(255,255,255,.82) 0 9%, transparent 10%),
    linear-gradient(#75c9ff, #cceeff 62%, #effaff);
  background-attachment: fixed;
}
button, input, select { font: inherit; }
button { cursor: pointer; }
[hidden] { display: none !important; }

[data-screen] { min-height: 100vh; }
[data-screen="select"] {
  display: grid;
  align-content: center;
  padding: 34px clamp(18px, 4vw, 60px);
}
.tower-select {
  width: min(1080px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 3vw, 34px);
  align-items: end;
}
.tower-option { text-align: center; }
.tower-image {
  width: min(220px, 88%);
  height: clamp(260px, 44vh, 430px);
  margin: 0 auto 14px;
  display: grid;
  place-items: start center;
  padding-top: 18px;
  border: 5px solid #b79d76;
  border-bottom-width: 12px;
  border-radius: 28px 28px 5px 5px;
  background:
    repeating-linear-gradient(90deg, transparent 0 26px, rgba(90,60,35,.07) 27px 29px),
    repeating-linear-gradient(0deg, #e7d8bf 0 38px, #d1bea0 39px 42px);
  color: #17345f;
  font-weight: 900;
  box-shadow: 0 18px 28px rgba(33,73,105,.22);
}
.tower-option button,
.result-actions button,
.back-button {
  min-height: 44px;
  padding: 9px 16px;
  border: 2px solid #d8ae58;
  border-radius: 9px;
  background: #17345f;
  color: #fff;
  font-weight: 900;
}
.tower-option button:hover,
.result-actions button:hover,
.back-button:hover { background: #102744; }

@media (max-width: 620px) {
  .tower-select { grid-template-columns: 1fr; width: min(330px,100%); }
  .tower-image { width: 190px; height: 230px; }
}`;

  if (step >= 2) css += `

[data-screen="game"] {
  position: relative;
  display: grid;
  place-items: center;
  padding: 70px 24px 24px;
}
.back-button { position: absolute; top: 18px; left: 18px; z-index: 10; }
.game-stage {
  position: relative;
  width: min(920px, 100%);
  min-height: min(680px, 86vh);
  overflow: hidden;
  border: 7px solid #aa8d64;
  border-radius: 18px;
  background: #e7d8bf;
  box-shadow: 0 24px 50px rgba(31,73,108,.24);
}
.game-hud {
  position: relative;
  z-index: 3;
  min-height: min(680px, 86vh);
  display: grid;
  align-content: center;
  justify-items: center;
  padding: 28px;
}
.hud-top { width: min(650px,92%); display: flex; justify-content: space-between; align-items: flex-start; }
.question-card {
  width: min(650px, 92%);
  padding: clamp(24px,5vw,48px);
  border: 4px solid #d2b981;
  border-radius: 18px;
  background: rgba(255,250,240,.96);
  text-align: center;
}
.question-card p { margin: 0 0 6px; color: #77664e; font-weight: 800; }
.question-card h2 { margin: 0; font-size: clamp(2.4rem,7vw,5rem); }`;

  if (step >= 3) css += `

.answer-form { width: min(650px,92%); margin-top: 18px; }
.answer-form input {
  width: 100%;
  min-height: 58px;
  padding: 10px 18px;
  border: 3px solid #17345f;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  outline: none;
}
.answer-form input:focus { box-shadow: 0 0 0 4px rgba(216,174,88,.35); }
.judge-message { min-height: 1.5em; margin: 10px 0 0; font-weight: 900; }`;

  if (step >= 4) css += `

.floor-rail {
  position: fixed;
  left: 22px;
  top: 50%;
  z-index: 8;
  transform: translateY(-50%);
  display: grid;
  gap: 5px;
}
.floor-rail span {
  width: 62px;
  padding: 5px 8px;
  border-radius: 6px;
  background: rgba(255,255,255,.8);
  color: #5d6b78;
  text-align: center;
  font-size: .78rem;
  font-weight: 800;
}
.floor-rail span.is-current { background: #17345f; color: #fff; outline: 2px solid #d8ae58; }
#floorText { display: block; color: #17345f; font-size: clamp(2rem,5vw,3.5rem); }`;

  if (step >= 5) css += `

[data-screen="result"] { display: grid; place-items: center; padding: 28px; }
.result-panel {
  width: min(760px,100%);
  padding: clamp(24px,5vw,48px);
  border: 4px solid #d0b36e;
  border-radius: 18px;
  background: rgba(255,250,240,.96);
  text-align: center;
  box-shadow: 0 24px 50px rgba(31,73,108,.24);
}
.result-kicker { margin: 0; color: #856d37; font-weight: 900; letter-spacing: .14em; }
.result-panel h1 { color: #17345f; }
.result-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
.result-grid div { padding: 14px; border: 1px solid #dfd1b8; border-radius: 9px; background: #fff; }
.result-grid span { display: block; color: #766b5b; font-size: .8rem; }
.result-grid strong { display: block; margin-top: 4px; font-size: 1.4rem; }
.result-actions { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }`;

  if (step >= 6) css += `

.difficulty-box {
  justify-self: center;
  margin: 0 auto 22px;
  padding: 9px 12px;
  border-radius: 9px;
  background: rgba(255,255,255,.92);
  font-weight: 800;
}
.difficulty-box select { margin-left: 6px; padding: 5px 7px; }
.timer-box, .combo-box {
  padding: 8px 12px;
  border: 2px solid #d8ae58;
  border-radius: 9px;
  background: #17345f;
  color: #fff;
  font-weight: 900;
}
.combo-box { margin-top: 12px; }`;

  if (step >= 7) css += `

.tower-eiyaku { border-color: #9b829f; }
.tower-wayaku { border-color: #7e9a91; }
#modeLabel { display: block; color: #6c5a42; font-weight: 800; }`;

  if (step >= 8) css += `

.result-grid { grid-template-columns: repeat(5,1fr); }
.best-record { min-height: 1.6em; margin: 18px 0 0; color: #6b5a3f; font-weight: 800; }
@media (max-width: 820px) { .result-grid { grid-template-columns: repeat(2,1fr); } }`;

  if (step >= 9) css += `

.tower-scene { position: absolute; inset: 0; z-index: 1; }
.stone-wall {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent 0 65px, rgba(105,79,48,.16) 66px 69px),
    repeating-linear-gradient(90deg, transparent 0 110px, rgba(105,79,48,.11) 111px 114px),
    #e7d8bf;
}
.enemy-shape {
  position: absolute;
  left: 50%;
  top: 37%;
  width: 230px;
  height: 210px;
  transform: translate(-50%,-50%);
  border-radius: 48% 48% 38% 38%;
  background: #271b3f;
}
.enemy-shape span::before,
.enemy-shape span::after {
  content: "";
  position: absolute;
  top: 78px;
  width: 26px;
  height: 12px;
  border-radius: 50%;
  background: #ff7138;
  box-shadow: 0 0 14px #ff7138;
}
.enemy-shape span::before { left: 58px; }
.enemy-shape span::after { right: 58px; }
.tower-scene.move-up { animation: floorUp .34s ease; }
.tower-scene.move-down { animation: floorDown .34s ease; }
@keyframes floorUp {
  0% { transform: translateY(0); opacity: 1; }
  45% { transform: translateY(46px); opacity: .45; }
  46% { transform: translateY(-46px); opacity: .45; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes floorDown {
  0% { transform: translateY(0); opacity: 1; }
  45% { transform: translateY(-46px); opacity: .45; }
  46% { transform: translateY(46px); opacity: .45; }
  100% { transform: translateY(0); opacity: 1; }
}
.question-card.is-correct { animation: correctFlash .25s ease; }
.question-card.is-miss { animation: missFlash .25s ease; }
@keyframes correctFlash { 50% { transform: scale(1.025); box-shadow: 0 0 0 5px rgba(36,159,95,.25); } }
@keyframes missFlash { 50% { transform: translateX(8px); box-shadow: 0 0 0 5px rgba(204,69,69,.22); } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}`;

  return css;
}

function buildMain(step) {
  if (step === 1) return USER_MAIN_STEP1;

  let extraButtons = '';
  if (step >= 2) {
    extraButtons += `

const gameBackButton=document.getElementById('gameBackButton');
gameBackButton.addEventListener('click',()=>{
  ${step >= 6 ? 'stopGame();\n  ' : ''}showScreen('select');
});`;
  }
  if (step >= 5) {
    extraButtons += `

const resultBackButton=document.getElementById('resultBackButton');
resultBackButton.addEventListener('click',()=>{
  showScreen('select');
});

document.getElementById('retryButton').addEventListener('click',()=>{
  startGame(selectedMode);
});`;
  }

  return `let selectedMode='kanji';

document.querySelectorAll('[data-mode]').forEach(button=>{
  button.addEventListener('click',()=>{
    startGame(button.dataset.mode);
  });
});

async function startGame(mode) {
  selectedMode=mode;
  showScreen('game');
  await prepareGame();
}

function showScreen(screenName) {
  document.querySelectorAll('[data-screen]').forEach(section => {
    section.hidden = (section.dataset.screen !== screenName);
  });
}${extraButtons}
showScreen('select');`;
}

function buildGame(step) {
  if (step < 2) return null;

  const modeMaps = step >= 7 ? `const DATA_FILES={
  kanji:'./data/kanji.json',
  eiyaku:'./data/ja-en.json',
  wayaku:'./data/en-ja.json'
};
const MODE_LABELS={kanji:'漢字の塔',eiyaku:'英訳の塔',wayaku:'和訳の塔'};
const MODE_HINTS={kanji:'読みを入力',eiyaku:'英語を入力',wayaku:'日本語を入力'};` : `const DATA_FILES={kanji:'./data/kanji.json'};`;

  const state = [
    'let questions=[];',
    'let currentQuestion=null;',
    step >= 4 ? 'let floor=1;' : '',
    step >= 5 ? 'let correctCount=0;\nlet missCount=0;' : '',
    step >= 6 ? "const TIME_BY_DIFFICULTY={easy:12,normal:10,hard:8};\nlet selectedDifficulty='normal';\nlet combo=0;\nlet timeLeft=10;\nlet timerId=null;" : '',
    step >= 8 ? 'let maxCombo=0;\nlet startedAt=0;' : '',
    step >= 9 ? 'let questionLocked=false;' : ''
  ].filter(Boolean).join('\n');

  let prepare = `async function prepareGame(){`;
  if (step >= 4) prepare += '\n  floor=1;';
  if (step >= 5) prepare += '\n  correctCount=0;\n  missCount=0;';
  if (step >= 6) prepare += "\n  selectedDifficulty=document.getElementById('difficultySelect').value;\n  combo=0;\n  updateCombo();";
  if (step >= 8) prepare += '\n  maxCombo=0;\n  startedAt=performance.now();';
  if (step >= 9) prepare += '\n  questionLocked=false;';
  if (step >= 7) prepare += "\n  document.getElementById('modeLabel').textContent=MODE_LABELS[selectedMode];\n  document.getElementById('questionHint').textContent=MODE_HINTS[selectedMode];";
  if (step >= 4) prepare += '\n  updateFloor();';
  prepare += `
  const loaded=await loadQuestions();
  if(loaded) showNextQuestion();
}`;

  const fileExpr = step >= 7 ? 'DATA_FILES[selectedMode] || DATA_FILES.kanji' : 'DATA_FILES.kanji';
  const load = `async function loadQuestions(){
  try{
    const response=await fetch(${fileExpr});
    if(!response.ok) throw new Error('HTTP '+response.status);
    questions=await response.json();
    if(!Array.isArray(questions) || questions.length===0) throw new Error('問題データが空です');
    return true;
  }catch(error){
    console.error(error);
    document.getElementById('questionText').textContent='問題を読み込めませんでした';
    return false;
  }
}`;

  const pool = step >= 6 ? `  const filtered=questions.filter(q=>q.difficulty===selectedDifficulty);
  const pool=filtered.length ? filtered : questions;` : '  const pool=questions;';
  let next = `function showNextQuestion(){
${step >= 9 ? '  questionLocked=false;\n' : ''}${pool}
  currentQuestion=pool[Math.floor(Math.random()*pool.length)];
  document.getElementById('questionText').textContent=currentQuestion.question;`;
  if (step >= 3) next += "\n  document.getElementById('answerInput').value='';\n  document.getElementById('answerInput').focus();";
  if (step >= 6) next += '\n  startTimer();';
  next += '\n}';

  let answer = '';
  if (step >= 3) {
    answer = `

const answerForm=document.getElementById('answerForm');
const answerInput=document.getElementById('answerInput');
const judgeMessage=document.getElementById('judgeMessage');

answerForm.addEventListener('submit',async event=>{
  event.preventDefault();
  ${step >= 9 ? 'if(questionLocked) return;\n  ' : ''}if(!currentQuestion) return;
  const answer=normalizeAnswer(answerInput.value);
  if(!answer) return;
  if(answer===normalizeAnswer(currentQuestion.answer)){
    await handleCorrect();
  }else{
    await handleMiss();
  }
});

function normalizeAnswer(value){
  return value.trim().toLowerCase().replace(/\\s+/g,' ');
}`;
  }

  let handlers = '';
  if (step === 3) {
    handlers = `

async function handleCorrect(){
  judgeMessage.textContent='正解！';
  showNextQuestion();
}

async function handleMiss(){
  judgeMessage.textContent='MISS';
  showNextQuestion();
}`;
  } else if (step === 4) {
    handlers = `

async function handleCorrect(){
  floor+=1;
  updateFloor();
  judgeMessage.textContent='正解！ +1F';
  if(floor>=10){
    showScreen('result');
    return;
  }
  showNextQuestion();
}

async function handleMiss(){
  floor=Math.max(1,floor-1);
  updateFloor();
  judgeMessage.textContent='MISS -1F';
  showNextQuestion();
}

function updateFloor(){
  document.getElementById('floorText').textContent=floor+'F';
  document.querySelectorAll('[data-floor]').forEach(item=>{
    item.classList.toggle('is-current',Number(item.dataset.floor)===floor);
  });
}`;
  } else if (step >= 5) {
    const lockCorrect = step >= 9 ? '  if(questionLocked) return;\n  questionLocked=true;\n' : '';
    const lockMiss = step >= 9 ? '  if(questionLocked) return;\n  questionLocked=true;\n' : '';
    const stopTimer = step >= 6 ? '  clearInterval(timerId);\n' : '';
    const comboCorrect = step >= 6 ? '  combo+=1;\n  updateCombo();\n' : '';
    const comboMiss = step >= 6 ? '  combo=0;\n  updateCombo();\n' : '';
    const max = step >= 8 ? '  maxCombo=Math.max(maxCombo,combo);\n' : '';
    const effectCorrect = step >= 9 ? "  await Promise.all([flashAnswer('correct'),playFloorMove('up')]);\n" : '';
    const effectMiss = step >= 9 ? "  await Promise.all([flashAnswer('miss'),playFloorMove('down')]);\n" : '';
    handlers = `

async function handleCorrect(){
${lockCorrect}${stopTimer}  correctCount+=1;
${comboCorrect}${max}  floor+=1;
  updateFloor();
  judgeMessage.textContent='正解！ +1F';
${effectCorrect}  if(floor>=10){
    finishGame();
    return;
  }
  showNextQuestion();
}

async function handleMiss(){
${lockMiss}${stopTimer}  missCount+=1;
${comboMiss}  floor=Math.max(1,floor-1);
  updateFloor();
  judgeMessage.textContent='MISS -1F';
${effectMiss}  showNextQuestion();
}

function updateFloor(){
  document.getElementById('floorText').textContent=floor+'F';
  document.querySelectorAll('[data-floor]').forEach(item=>{
    item.classList.toggle('is-current',Number(item.dataset.floor)===floor);
  });
}`;
  }

  let timer = '';
  if (step >= 6) {
    timer = `

function startTimer(){
  clearInterval(timerId);
  timeLeft=TIME_BY_DIFFICULTY[selectedDifficulty] || 10;
  updateTimer();
  timerId=setInterval(async()=>{
    timeLeft-=1;
    updateTimer();
    if(timeLeft<=0){
      clearInterval(timerId);
      await handleMiss();
    }
  },1000);
}

function updateTimer(){
  document.getElementById('timeText').textContent=timeLeft;
}

function updateCombo(){
  document.getElementById('comboText').textContent=combo;
}

function stopGame(){
  clearInterval(timerId);
  timerId=null;
}`;
  }

  let finish = '';
  if (step >= 5) {
    const title = step >= 7 ? "  document.getElementById('resultTitle').textContent=MODE_LABELS[selectedMode]+' CLEAR';" : "  document.getElementById('resultTitle').textContent='漢字の塔 CLEAR';";
    const extended = step >= 8 ? `
  const elapsed=(performance.now()-startedAt)/1000;
  const answered=correctCount+missCount;
  const accuracy=answered===0 ? 0 : Math.round(correctCount/answered*100);
  document.getElementById('resultAccuracy').textContent=accuracy+'%';
  document.getElementById('resultMaxCombo').textContent=maxCombo;
  document.getElementById('resultTime').textContent=elapsed.toFixed(1)+'s';
  const best=saveRecord(selectedMode,selectedDifficulty,{time:elapsed,maxCombo,accuracy});
  document.getElementById('bestRecordText').textContent='BEST '+best.bestTime.toFixed(1)+'s / COMBO '+best.maxCombo+' / ACC '+best.bestAccuracy+'%';` : '';
    finish = `

function finishGame(){
  ${step >= 6 ? 'stopGame();\n  ' : ''}${title}
  document.getElementById('resultCorrect').textContent=correctCount;
  document.getElementById('resultMiss').textContent=missCount;${extended}
  showScreen('result');
}`;
  }

  return `${modeMaps}\n\n${state}\n\n${prepare}\n\n${load}\n\n${next}${answer}${handlers}${timer}${finish}`;
}

function buildStorage() {
  return `const RECORD_KEY='typeTowerRecordsV1';

function loadRecords(){
  try{
    return JSON.parse(localStorage.getItem(RECORD_KEY)) || {};
  }catch(error){
    console.warn('記録を読み込めませんでした',error);
    return {};
  }
}

function saveRecord(mode,difficulty,result){
  const records=loadRecords();
  const key=mode+':'+difficulty;
  const old=records[key] || {};
  const next={
    bestTime:old.bestTime==null ? result.time : Math.min(old.bestTime,result.time),
    maxCombo:Math.max(old.maxCombo || 0,result.maxCombo),
    bestAccuracy:Math.max(old.bestAccuracy || 0,result.accuracy)
  };
  records[key]=next;
  try{
    localStorage.setItem(RECORD_KEY,JSON.stringify(records));
  }catch(error){
    console.warn('記録を保存できませんでした',error);
  }
  return next;
}`;
}

function buildEffects() {
  return `function wait(ms){
  return new Promise(resolve=>setTimeout(resolve,ms));
}

async function playFloorMove(direction){
  const scene=document.getElementById('towerScene');
  const className=direction==='up' ? 'move-up' : 'move-down';
  scene.classList.remove('move-up','move-down');
  void scene.offsetWidth;
  scene.classList.add(className);
  await wait(340);
  scene.classList.remove(className);
}

async function flashAnswer(type){
  const card=document.getElementById('questionCard');
  const className=type==='correct' ? 'is-correct' : 'is-miss';
  card.classList.remove('is-correct','is-miss');
  void card.offsetWidth;
  card.classList.add(className);
  await wait(250);
  card.classList.remove(className);
}`;
}

function kanjiJson(step) {
  if (step < 2) return null;
  if (step < 6) return `[
  { "question": "紅葉", "answer": "こうよう" },
  { "question": "景色", "answer": "けしき" },
  { "question": "概念", "answer": "がいねん" },
  { "question": "憂鬱", "answer": "ゆううつ" }
]`;
  return `[
  { "question": "紅葉", "answer": "こうよう", "difficulty": "easy" },
  { "question": "景色", "answer": "けしき", "difficulty": "easy" },
  { "question": "概念", "answer": "がいねん", "difficulty": "normal" },
  { "question": "憂鬱", "answer": "ゆううつ", "difficulty": "normal" },
  { "question": "躊躇", "answer": "ちゅうちょ", "difficulty": "hard" },
  { "question": "彷徨", "answer": "ほうこう", "difficulty": "hard" }
]`;
}

function jaEnJson() {
  return `[
  { "question": "りんご", "answer": "apple", "difficulty": "easy" },
  { "question": "学校", "answer": "school", "difficulty": "easy" },
  { "question": "経験", "answer": "experience", "difficulty": "normal" },
  { "question": "環境", "answer": "environment", "difficulty": "normal" },
  { "question": "責任", "answer": "responsibility", "difficulty": "hard" }
]`;
}

function enJaJson() {
  return `[
  { "question": "apple", "answer": "りんご", "difficulty": "easy" },
  { "question": "school", "answer": "学校", "difficulty": "easy" },
  { "question": "experience", "answer": "経験", "difficulty": "normal" },
  { "question": "environment", "answer": "環境", "difficulty": "normal" },
  { "question": "responsibility", "answer": "責任", "difficulty": "hard" }
]`;
}

function testMd() {
  return `# TYPE TOWER 最終テスト

- [ ] 開いた瞬間に3つの塔が見える
- [ ] kanji / eiyaku / wayaku のボタンが反応する
- [ ] 3モードで別のJSONを読める
- [ ] Enterで回答できる
- [ ] 正解で +1F
- [ ] MISSで -1F
- [ ] 1F未満にならない
- [ ] TIME 0でMISSになる
- [ ] COMBOが正常に増減する
- [ ] 10FでRESULTへ進む
- [ ] RESULTの数字が実プレイと一致する
- [ ] ベスト記録がリロード後も残る
- [ ] 再挑戦できる
- [ ] 塔選択へ戻れる
- [ ] 階移動で空は固定されている
- [ ] 連打しても二重判定しない
- [ ] 狭い画面でも主要操作ができる`;
}

function filesForStep(step) {
  const files=[
    ['index.html',buildIndex(step),step===1],
    ['css/style.css',buildCss(step),false],
    ['js/main.js',buildMain(step),step===1]
  ];
  const game=buildGame(step);
  if(game) files.push(['js/game.js',game,false]);
  const kanji=kanjiJson(step);
  if(kanji) files.push(['data/kanji.json',kanji,false]);
  if(step>=7){
    files.push(['data/ja-en.json',jaEnJson(),false]);
    files.push(['data/en-ja.json',enJaJson(),false]);
  }
  if(step>=8) files.push(['js/storage.js',buildStorage(),false]);
  if(step>=9) files.push(['js/effects.js',buildEffects(),false]);
  if(step>=10) files.push(['TEST.md',testMd(),false]);
  return files;
}

function renderStep(step) {
  const [title,intro]=STEP_META[step-1];
  const section=document.createElement('section');
  section.className='section full-step';
  section.id='full-step-'+step;

  const wrap=document.createElement('div');
  wrap.className='wrap';
  wrap.innerHTML=`
    <div class="full-step-head">
      <div class="full-step-number">${String(step).padStart(2,'0')}</div>
      <div class="full-step-title"><p>STEP ${step} 終了時</p><h2>${title}</h2></div>
    </div>
    <p class="full-step-intro">${intro}</p>
    ${step===1 ? '<p class="full-step-note"><b>ここは実コード基準：</b> index.html と main.js は、現在の type-tower-a に自分たちで書いた内容を基準にしています。</p>' : '<p class="full-step-note"><b>見方：</b> 前STEPからの差分ではなく、このSTEP終了時にファイル全体がどうなっているかを掲載しています。</p>'}
  `;

  const list=document.createElement('div');
  list.className='full-files';
  filesForStep(step).forEach(([path,source,userOrigin],index)=>{
    const details=document.createElement('details');
    details.className='full-file';
    if(index===0) details.open=true;
    const summary=document.createElement('summary');
    summary.innerHTML=`<span>${path}${userOrigin ? '<span class="user-origin">現在の自分たちのコード基準</span>' : ''}</span><small>ファイル全文</small>`;
    const pre=document.createElement('pre');
    const code=document.createElement('code');
    code.textContent=source;
    pre.appendChild(code);
    details.append(summary,pre);
    list.appendChild(details);
  });

  const check=document.createElement('div');
  check.className='full-check';
  check.innerHTML=`<strong>STEP ${step}で確認</strong><ul>${step===10 ? '<li>新しい機能を増やさず、TEST.mdを上から確認する</li><li>重大な進行不能がなければ完成へ進む</li>' : '<li>このSTEPのファイルを保存してブラウザで開く</li><li>前STEPで動いていた機能が壊れていないか確認する</li>'}</ul>`;

  wrap.append(list,check);
  section.appendChild(wrap);
  return section;
}

const app=document.getElementById('fullExampleApp');
const jump=document.createElement('nav');
jump.className='full-jump';
jump.setAttribute('aria-label','STEP一覧');
for(let step=1;step<=10;step+=1){
  const link=document.createElement('a');
  link.href='#full-step-'+step;
  link.textContent='STEP '+step;
  jump.appendChild(link);
}
app.appendChild(jump);
for(let step=1;step<=10;step+=1){
  app.appendChild(renderStep(step));
}
