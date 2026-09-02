const STEP_META = [
  ['HOME / GAME / RESULT + 3つの塔', '空背景と3つの塔を最初から表示し、ボタンで仮GAMEへ移動できる。'],
  ['漢字問題をJSONから表示', '漢字の塔を押すとkanji.jsonを読み込み、問題カードへ1問表示する。'],
  ['入力と正解 / MISS判定', '入力欄とEnter判定を追加し、正解かMISSかを判断できる。'],
  ['階数を1F〜10Fで管理', '正解で+1F、MISSで-1F、1F未満にはならない。'],
  ['漢字の塔をRESULTまで通す', '正解数・MISS数を数え、10FでRESULTへ進み、再挑戦できる。'],
  ['TIME / COMBO / 難易度', '制限時間、COMBO、EASY / NORMAL / HARDを追加する。'],
  ['英訳・和訳の塔を接続', '3つの塔で別々のJSONを使い、同じゲーム処理を再利用する。'],
  ['記録保存を追加', '正答率、最大COMBO、クリア時間を表示し、ベスト記録をlocalStorageへ保存する。'],
  ['塔内部・敵・階移動演出', '空は固定したまま塔内部だけ動かし、二重入力も防止する。'],
  ['最終テスト', 'コードを増やさず、3モードを通して重大なバグがないか確認する。']
];

function esc(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildIndex(step) {
  const difficulty = step >= 6 ? String.raw`
        <label class="difficulty-control">
          難易度
          <select id="difficultySelect">
            <option value="easy">EASY</option>
            <option value="normal" selected>NORMAL</option>
            <option value="hard">HARD</option>
          </select>
        </label>` : '';

  const floorRail = step >= 4 ? String.raw`
      <aside class="floor-rail" aria-label="現在階">
        <span data-floor="10">10F</span><span data-floor="9">9F</span>
        <span data-floor="8">8F</span><span data-floor="7">7F</span>
        <span data-floor="6">6F</span><span data-floor="5">5F</span>
        <span data-floor="4">4F</span><span data-floor="3">3F</span>
        <span data-floor="2">2F</span><span data-floor="1">1F</span>
      </aside>` : '';

  let gameContent = '<div class="game-placeholder">GAME</div>';
  if (step >= 2) {
    const scene = step >= 9 ? String.raw`
        <div class="tower-scene" id="towerScene" aria-hidden="true">
          <div class="stone-wall"></div>
          <div class="enemy-shape"><span></span></div>
        </div>` : '';
    const modeLabel = step >= 7 ? '<small id="modeLabel">漢字の塔</small>' : '';
    const floor = step >= 4 ? '<strong id="floorText">1F</strong>' : '';
    const timer = step >= 6 ? '<div class="timer-box">TIME <strong id="timeText">10</strong></div>' : '';
    const form = step >= 3 ? String.raw`
          <form id="answerForm" class="answer-form">
            <label class="sr-only" for="answerInput">答え</label>
            <input id="answerInput" type="text" autocomplete="off" placeholder="答えを入力してEnter">
          </form>` : '';
    const combo = step >= 6 ? String.raw`
          <div class="hud-bottom">
            <strong>COMBO ×<span id="comboText">0</span></strong>
            <span>MISSで -1F / 正解で +1F</span>
          </div>` : '';
    const hintId = step >= 7 ? ' id="questionHint"' : '';
    gameContent = String.raw`<div class="game-stage">${scene}
        <div class="game-hud">
          <div class="hud-top"><div>${modeLabel}${floor}</div>${timer}</div>
          <div class="question-card" id="questionCard">
            <p${hintId}>読みを入力</p>
            <h2 id="questionText">読み込み中…</h2>
          </div>${form}${combo}
        </div>
      </div>`;
  }

  let resultContent = '<div class="result-placeholder">RESULT</div>';
  if (step >= 5) {
    const extra = step >= 8 ? String.raw`
          <div><span>正答率</span><strong id="resultAccuracy">0%</strong></div>
          <div><span>最大COMBO</span><strong id="resultMaxCombo">0</strong></div>
          <div><span>TIME</span><strong id="resultTime">0.0s</strong></div>` : '';
    const best = step >= 8 ? '<p id="bestRecordText" class="best-record"></p>' : '';
    resultContent = String.raw`<div class="result-panel">
        <p class="result-kicker">TOWER CLEAR</p>
        <h1 id="resultTitle">漢字の塔 CLEAR</h1>
        <div class="result-grid">
          <div><span>正解</span><strong id="resultCorrect">0</strong></div>
          <div><span>MISS</span><strong id="resultMiss">0</strong></div>${extra}
        </div>${best}
        <div class="result-actions">
          <button id="retryButton" class="primary-action" type="button">もう一度挑戦</button>
          <button id="resultHomeButton" class="secondary-action" type="button">塔選択へ戻る</button>
        </div>
      </div>`;
  }

  const storageScript = step >= 8 ? '  <script src="js/storage.js"></script>\n' : '';
  const effectsScript = step >= 9 ? '  <script src="js/effects.js"></script>\n' : '';

  return String.raw`<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TYPE TOWER</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="sky-layer" aria-hidden="true"></div>

  <main class="app-shell">
    <section class="screen home-screen" data-screen="home">
      <header class="home-title">
        <p>TYPE TOWER</p>
        <h1>挑戦する塔を選ぶ</h1>${difficulty}
      </header>

      <div class="tower-select" aria-label="挑戦する塔を選択">
        <article class="tower-option">
          <div class="tower-art tower-kanji"><span>KANJI</span></div>
          <h2>漢字の塔</h2><p>漢字 → 読み</p>
          <button class="tower-start" data-mode="kanji" type="button">この塔に挑戦</button>
        </article>
        <article class="tower-option">
          <div class="tower-art tower-ja-en"><span>JA → EN</span></div>
          <h2>英訳の塔</h2><p>日本語 → 英語</p>
          <button class="tower-start" data-mode="jaEn" type="button">この塔に挑戦</button>
        </article>
        <article class="tower-option">
          <div class="tower-art tower-en-ja"><span>EN → JA</span></div>
          <h2>和訳の塔</h2><p>英語 → 日本語</p>
          <button class="tower-start" data-mode="enJa" type="button">この塔に挑戦</button>
        </article>
      </div>
    </section>

    <section class="screen game-screen" data-screen="game" hidden>
      <button id="gameHomeButton" class="small-button top-left" type="button">塔選択へ戻る</button>${floorRail}
      ${gameContent}
    </section>

    <section class="screen result-screen" data-screen="result" hidden>
      ${resultContent}
    </section>
  </main>

  <script src="js/main.js"></script>
${storageScript}${effectsScript}  <script src="js/game.js"></script>
</body>
</html>`;
}

function buildCss(step) {
  let css = String.raw`:root {
  --navy: #17345f;
  --navy-dark: #102744;
  --gold: #d8ae58;
  --stone: #e7d8bf;
  --paper: #fffaf0;
  --ink: #172034;
}

* { box-sizing: border-box; }
html, body { min-height: 100%; }
body {
  margin: 0;
  font-family: "Yu Gothic UI", "Yu Gothic", system-ui, sans-serif;
  color: var(--ink);
  overflow-x: hidden;
}
button, input, select { font: inherit; }
button { cursor: pointer; }
[hidden] { display: none !important; }

.sky-layer {
  position: fixed;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(ellipse at 16% 25%, rgba(255,255,255,.85) 0 8%, transparent 9%),
    radial-gradient(ellipse at 78% 18%, rgba(255,255,255,.85) 0 9%, transparent 10%),
    linear-gradient(#74c8ff, #c9edff 62%, #eefaff);
}
.app-shell, .screen { min-height: 100vh; }

.home-screen {
  display: grid;
  align-content: center;
  gap: 34px;
  padding: 42px clamp(18px, 4vw, 64px);
}
.home-title { text-align: center; color: #fff; text-shadow: 0 2px 10px rgba(20,55,90,.3); }
.home-title p { margin: 0; font-weight: 900; letter-spacing: .18em; }
.home-title h1 { margin: 5px 0 0; font-size: clamp(2rem, 4vw, 3.4rem); }

.tower-select {
  width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 3vw, 34px);
  align-items: end;
}
.tower-option { text-align: center; }
.tower-option h2 { margin: 14px 0 2px; color: #fff; }
.tower-option p { margin: 0 0 10px; color: rgba(255,255,255,.92); font-weight: 700; }
.tower-art {
  width: min(220px, 86%);
  height: clamp(260px, 42vh, 430px);
  margin: 0 auto;
  display: grid;
  place-items: start center;
  padding-top: 18px;
  border: 5px solid #b79d76;
  border-bottom: 12px solid #9e805b;
  border-radius: 28px 28px 5px 5px;
  background:
    repeating-linear-gradient(90deg, transparent 0 26px, rgba(90,60,35,.07) 27px 29px),
    repeating-linear-gradient(0deg, #e7d8bf 0 38px, #d1bea0 39px 42px);
  box-shadow: 0 18px 28px rgba(33,73,105,.22);
}
.tower-art span { padding: 6px 10px; border-radius: 7px; background: var(--navy); color: #fff; font-weight: 900; }
.tower-start, .primary-action {
  min-height: 46px;
  padding: 10px 18px;
  border: 2px solid var(--gold);
  border-radius: 9px;
  background: var(--navy);
  color: #fff;
  font-weight: 900;
}
.tower-start:hover, .primary-action:hover { background: var(--navy-dark); }

.game-screen, .result-screen { position: relative; display: grid; place-items: center; padding: 70px 24px 24px; }
.small-button, .secondary-action {
  padding: 9px 12px;
  border: 1px solid rgba(20,45,70,.25);
  border-radius: 9px;
  background: rgba(255,255,255,.92);
  color: var(--ink);
  font-weight: 800;
}
.top-left { position: fixed; top: 16px; left: 16px; z-index: 10; }
.game-placeholder, .result-placeholder { padding: 40px; border-radius: 14px; background: rgba(255,255,255,.9); font-size: 2rem; font-weight: 900; }
`;

  if (step >= 2) css += String.raw`
.game-stage {
  width: min(920px, 100%);
  min-height: min(680px, 86vh);
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 7px solid #aa8d64;
  border-radius: 18px;
  background: var(--stone);
  box-shadow: 0 24px 50px rgba(31,73,108,.24);
}
.game-hud {
  position: relative;
  z-index: 3;
  width: 100%;
  min-height: min(680px, 86vh);
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  align-items: center;
  padding: 24px clamp(18px, 5vw, 64px) 30px;
}
.hud-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; }
.question-card {
  width: min(650px, 92%);
  margin: auto;
  padding: clamp(24px, 5vw, 48px);
  border: 4px solid #d2b981;
  border-radius: 18px;
  background: rgba(255,250,240,.96);
  text-align: center;
  box-shadow: 0 16px 30px rgba(66,48,28,.2);
}
.question-card p { margin: 0 0 6px; color: #77664e; font-weight: 800; }
.question-card h2 { margin: 0; font-size: clamp(2.4rem, 7vw, 5rem); line-height: 1.2; }
`;

  if (step >= 3) css += String.raw`
.answer-form { width: min(650px, 92%); margin: 0 auto; }
.answer-form input {
  width: 100%;
  min-height: 58px;
  padding: 10px 18px;
  border: 3px solid var(--navy);
  border-radius: 12px;
  background: #fff;
  color: var(--ink);
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  text-align: center;
  outline: none;
}
.answer-form input:focus { box-shadow: 0 0 0 4px rgba(216,174,88,.35); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
`;

  if (step >= 4) css += String.raw`
.floor-rail {
  position: fixed;
  left: 22px;
  top: 50%;
  z-index: 5;
  transform: translateY(-50%);
  display: grid;
  gap: 5px;
}
.floor-rail span { width: 62px; padding: 5px 8px; border-radius: 6px; background: rgba(255,255,255,.78); color: #5d6b78; text-align: center; font-size: .78rem; font-weight: 800; }
.floor-rail span.is-current { background: var(--navy); color: #fff; outline: 2px solid var(--gold); }
#floorText { display: block; font-size: clamp(2rem, 5vw, 3.6rem); color: var(--navy); }
`;

  if (step >= 5) css += String.raw`
.result-panel {
  width: min(720px, 100%);
  padding: clamp(24px, 5vw, 48px);
  border: 4px solid #d0b36e;
  border-radius: 18px;
  background: rgba(255,250,240,.96);
  box-shadow: 0 24px 50px rgba(31,73,108,.24);
  text-align: center;
}
.result-kicker { margin: 0; color: #856d37; font-weight: 900; letter-spacing: .14em; }
.result-panel h1 { margin: 6px 0 26px; color: var(--navy); }
.result-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
.result-grid div { padding: 12px 6px; border: 1px solid #dfd1b8; border-radius: 9px; background: #fff; }
.result-grid span { display: block; color: #766b5b; font-size: .78rem; }
.result-grid strong { display: block; margin-top: 4px; font-size: 1.35rem; }
.result-actions { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
`;

  if (step >= 6) css += String.raw`
.difficulty-control { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; padding: 8px 12px; border-radius: 10px; background: rgba(255,255,255,.92); color: var(--ink); text-shadow: none; font-weight: 800; }
.difficulty-control select { border: 1px solid #b9c7d2; border-radius: 7px; background: #fff; padding: 5px 8px; }
.timer-box { padding: 8px 12px; border: 2px solid var(--gold); border-radius: 9px; background: var(--navy); color: #fff; font-weight: 900; }
.hud-bottom { display: flex; justify-content: space-between; gap: 16px; padding-top: 14px; color: var(--navy); font-weight: 800; }
`;

  if (step >= 8) css += String.raw`
.result-grid { grid-template-columns: repeat(5,1fr); }
.best-record { min-height: 1.6em; margin: 18px 0 0; color: #6b5a3f; font-weight: 800; }
`;

  if (step >= 9) css += String.raw`
.tower-scene { position: absolute; inset: 0; z-index: 1; }
.stone-wall {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent 0 65px, rgba(105,79,48,.16) 66px 69px),
    repeating-linear-gradient(90deg, transparent 0 110px, rgba(105,79,48,.11) 111px 114px),
    var(--stone);
}
.enemy-shape {
  position: absolute;
  left: 50%; top: 37%;
  width: 230px; height: 210px;
  transform: translate(-50%, -50%);
  border-radius: 48% 48% 38% 38%;
  background: #271b3f;
  box-shadow: 0 14px 28px rgba(54,36,72,.28);
}
.enemy-shape::before, .enemy-shape::after { content: ""; position: absolute; top: -40px; width: 70px; height: 82px; background: #271b3f; clip-path: polygon(0 100%,50% 0,100% 100%); }
.enemy-shape::before { left: 18px; transform: rotate(-16deg); }
.enemy-shape::after { right: 18px; transform: rotate(16deg); }
.enemy-shape span::before, .enemy-shape span::after { content: ""; position: absolute; top: 78px; width: 26px; height: 12px; border-radius: 50%; background: #ff7138; box-shadow: 0 0 14px #ff7138; }
.enemy-shape span::before { left: 58px; }
.enemy-shape span::after { right: 58px; }
.tower-scene.move-up { animation: floorUp .34s ease; }
.tower-scene.move-down { animation: floorDown .34s ease; }
@keyframes floorUp { 0%{transform:translateY(0);opacity:1} 45%{transform:translateY(46px);opacity:.45} 46%{transform:translateY(-46px);opacity:.45} 100%{transform:translateY(0);opacity:1} }
@keyframes floorDown { 0%{transform:translateY(0);opacity:1} 45%{transform:translateY(-46px);opacity:.45} 46%{transform:translateY(46px);opacity:.45} 100%{transform:translateY(0);opacity:1} }
.question-card.is-correct { animation: correctFlash .25s ease; }
.question-card.is-miss { animation: missFlash .25s ease; }
@keyframes correctFlash { 50% { transform: scale(1.025); box-shadow: 0 0 0 5px rgba(36,159,95,.25); } }
@keyframes missFlash { 50% { transform: translateX(8px); box-shadow: 0 0 0 5px rgba(204,69,69,.22); } }
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
`;

  css += String.raw`
@media (max-width: 820px) {
  .tower-select { gap: 10px; }
  .tower-art { height: 280px; width: 92%; }
  ${step >= 8 ? '.result-grid { grid-template-columns: repeat(2,1fr); }' : ''}
}
@media (max-width: 620px) {
  .tower-select { grid-template-columns: 1fr; width: min(330px,100%); }
  .tower-art { width: 190px; height: 230px; }
  .game-screen { padding: 70px 10px 20px; }
  ${step >= 6 ? '.hud-bottom { flex-direction: column; align-items: center; gap: 2px; font-size: .84rem; }' : ''}
  ${step >= 5 ? '.result-actions { flex-direction: column; }' : ''}
}
`;
  return css;
}

function buildMain(step) {
  return String.raw`const screens = [...document.querySelectorAll('[data-screen]')];

function showScreen(name) {
  screens.forEach(screen => {
    screen.hidden = screen.dataset.screen !== name;
  });
}

document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => {
    startGame(button.dataset.mode);
  });
});

const gameHomeButton = document.getElementById('gameHomeButton');
if (gameHomeButton) {
  gameHomeButton.addEventListener('click', () => {
    cancelGame();
    showScreen('home');
  });
}

const resultHomeButton = document.getElementById('resultHomeButton');
if (resultHomeButton) {
  resultHomeButton.addEventListener('click', () => {
    cancelGame();
    showScreen('home');
  });
}

const retryButton = document.getElementById('retryButton');
if (retryButton) {
  retryButton.addEventListener('click', () => {
    startGame(getCurrentMode());
  });
}

showScreen('home');`;
}

function buildGame(step) {
  if (step === 1) return String.raw`let selectedMode = 'kanji';

function getCurrentMode() {
  return selectedMode;
}

function startGame(mode) {
  selectedMode = mode;
  console.log('選んだモード:', selectedMode);
  showScreen('game');
}

function cancelGame() {
  // STEP 6でタイマー停止処理を追加する
}`;

  const modeData = step >= 7 ? String.raw`const DATA_FILES = {
  kanji: './data/kanji.json',
  jaEn: './data/ja-en.json',
  enJa: './data/en-ja.json'
};

const MODE_LABELS = {
  kanji: '漢字の塔',
  jaEn: '英訳の塔',
  enJa: '和訳の塔'
};

const MODE_HINTS = {
  kanji: '読みを入力',
  jaEn: '英語を入力',
  enJa: '日本語を入力'
};` : "const DATA_FILES = { kanji: './data/kanji.json' };";

  const difficultyData = step >= 6 ? String.raw`
const TIME_BY_DIFFICULTY = { easy: 12, normal: 10, hard: 8 };` : '';
  const state = [
    "let selectedMode = 'kanji';",
    step >= 6 ? "let selectedDifficulty = 'normal';" : '',
    'let questions = [];',
    'let currentQuestion = null;',
    step >= 4 ? 'let floor = 1;' : '',
    step >= 5 ? 'let correctCount = 0;\nlet missCount = 0;' : '',
    step >= 6 ? 'let combo = 0;\nlet timeLeft = 10;\nlet timerId = null;' : '',
    step >= 8 ? 'let maxCombo = 0;\nlet startedAt = 0;' : '',
    step >= 9 ? 'let questionLocked = false;' : ''
  ].filter(Boolean).join('\n');

  const dom = step >= 3 ? String.raw`
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');` : '';

  let startReset = "  selectedMode = mode;";
  if (step >= 4) startReset += '\n  floor = 1;';
  if (step >= 5) startReset += '\n  correctCount = 0;\n  missCount = 0;';
  if (step >= 6) startReset += "\n  selectedDifficulty = document.getElementById('difficultySelect').value;\n  combo = 0;";
  if (step >= 8) startReset += '\n  maxCombo = 0;\n  startedAt = performance.now();';
  if (step >= 9) startReset += '\n  questionLocked = false;';

  let startUi = '';
  if (step >= 7) startUi += "\n  document.getElementById('modeLabel').textContent = MODE_LABELS[selectedMode];\n  document.getElementById('questionHint').textContent = MODE_HINTS[selectedMode];";
  if (step >= 4) startUi += '\n  updateFloorUI();';
  if (step >= 6) startUi += '\n  updateComboUI();';

  const loadFilter = step >= 6 ? String.raw`  const filtered = questions.filter(question => question.difficulty === selectedDifficulty);
  const pool = filtered.length ? filtered : questions;` : '  const pool = questions;';

  const focus = step >= 3 ? "\n  answerInput.value = '';\n  answerInput.focus();" : '';
  const timerStart = step >= 6 ? '\n  startQuestionTimer();' : '';
  const unlock = step >= 9 ? '  questionLocked = false;\n' : '';

  let submit = '';
  if (step >= 3) {
    const lockGuard = step >= 9 ? '  if (questionLocked || !currentQuestion) return;' : '  if (!currentQuestion) return;';
    submit = String.raw`
answerForm.addEventListener('submit', async event => {
  event.preventDefault();
${lockGuard}
  const answer = normalizeAnswer(answerInput.value);
  if (!answer) return;

  if (answer === normalizeAnswer(currentQuestion.answer)) {
    await handleCorrect();
  } else {
    await handleMiss();
  }
});

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}`;
  }

  let handlers = '';
  if (step === 2) {
    handlers = '';
  } else if (step === 3) {
    handlers = String.raw`
async function handleCorrect() {
  console.log('正解');
  showNextQuestion();
}

async function handleMiss() {
  console.log('MISS');
  showNextQuestion();
}`;
  } else if (step === 4) {
    handlers = String.raw`
async function handleCorrect() {
  floor += 1;
  updateFloorUI();
  if (floor >= 10) {
    showScreen('result');
    return;
  }
  showNextQuestion();
}

async function handleMiss() {
  floor = Math.max(1, floor - 1);
  updateFloorUI();
  showNextQuestion();
}

function updateFloorUI() {
  document.getElementById('floorText').textContent = floor + 'F';
  document.querySelectorAll('[data-floor]').forEach(item => {
    item.classList.toggle('is-current', Number(item.dataset.floor) === floor);
  });
}`;
  } else if (step >= 5) {
    const beforeCorrect = step >= 9 ? "  if (questionLocked) return;\n  questionLocked = true;\n" : '';
    const clearTimer = step >= 6 ? '  clearInterval(timerId);\n' : '';
    const comboCorrect = step >= 6 ? '  combo += 1;\n  updateComboUI();\n' : '';
    const maxCombo = step >= 8 ? '  maxCombo = Math.max(maxCombo, combo);\n' : '';
    const effectsCorrect = step >= 9 ? "  await Promise.all([flashAnswer('correct'), playFloorMove('up')]);\n" : '';
    const beforeMiss = step >= 9 ? "  if (questionLocked) return;\n  questionLocked = true;\n" : '';
    const comboMiss = step >= 6 ? '  combo = 0;\n  updateComboUI();\n' : '';
    const effectsMiss = step >= 9 ? "  await Promise.all([flashAnswer('miss'), playFloorMove('down')]);\n" : '';
    handlers = String.raw`
async function handleCorrect() {
${beforeCorrect}${clearTimer}  correctCount += 1;
${comboCorrect}${maxCombo}  floor += 1;
  updateFloorUI();
${effectsCorrect}  if (floor >= 10) {
    finishGame();
    return;
  }
  showNextQuestion();
}

async function handleMiss() {
${beforeMiss}${clearTimer}  missCount += 1;
${comboMiss}  floor = Math.max(1, floor - 1);
  updateFloorUI();
${effectsMiss}  showNextQuestion();
}

function updateFloorUI() {
  document.getElementById('floorText').textContent = floor + 'F';
  document.querySelectorAll('[data-floor]').forEach(item => {
    item.classList.toggle('is-current', Number(item.dataset.floor) === floor);
  });
}`;
  }

  let timerCode = '';
  if (step >= 6) timerCode = String.raw`
function updateComboUI() {
  document.getElementById('comboText').textContent = combo;
}

function startQuestionTimer() {
  clearInterval(timerId);
  timeLeft = TIME_BY_DIFFICULTY[selectedDifficulty] || 10;
  updateTimerUI();

  timerId = setInterval(async () => {
    timeLeft -= 1;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      await handleMiss();
    }
  }, 1000);
}

function updateTimerUI() {
  document.getElementById('timeText').textContent = timeLeft;
}`;

  let finishCode = '';
  if (step >= 5) {
    const title = step >= 7 ? "  document.getElementById('resultTitle').textContent = MODE_LABELS[selectedMode] + ' CLEAR';" : "  document.getElementById('resultTitle').textContent = '漢字の塔 CLEAR';";
    const extended = step >= 8 ? String.raw`
  const elapsedSeconds = (performance.now() - startedAt) / 1000;
  const answered = correctCount + missCount;
  const accuracy = answered === 0 ? 0 : Math.round((correctCount / answered) * 100);
  document.getElementById('resultAccuracy').textContent = accuracy + '%';
  document.getElementById('resultMaxCombo').textContent = maxCombo;
  document.getElementById('resultTime').textContent = elapsedSeconds.toFixed(1) + 's';

  const best = saveRecord(selectedMode, selectedDifficulty, {
    time: elapsedSeconds,
    maxCombo: maxCombo,
    accuracy: accuracy
  });
  document.getElementById('bestRecordText').textContent =
    'BEST TIME ' + best.bestTime.toFixed(1) + 's / MAX COMBO ' + best.maxCombo + ' / ACC ' + best.bestAccuracy + '%';` : '';
    finishCode = String.raw`
function finishGame() {
  cancelGame();
${title}
  document.getElementById('resultCorrect').textContent = correctCount;
  document.getElementById('resultMiss').textContent = missCount;${extended}
  showScreen('result');
}`;
  }

  const cancel = step >= 6 ? String.raw`
function cancelGame() {
  clearInterval(timerId);
  timerId = null;
}` : String.raw`
function cancelGame() {
  // タイマー導入前なので停止する処理はまだない
}`;

  return `${modeData}${difficultyData}\n\n${state}${dom}\n\nfunction getCurrentMode() {\n  return selectedMode;\n}\n\nasync function startGame(mode) {\n  cancelGame();\n${startReset}${startUi}\n  showScreen('game');\n  const loaded = await loadModeQuestions();\n  if (!loaded) return;\n  showNextQuestion();${step >= 3 ? "\n  answerInput.focus();" : ''}\n}\n\n${cancel}\n\nasync function loadModeQuestions() {\n  try {\n    const file = DATA_FILES[selectedMode] || DATA_FILES.kanji;\n    const response = await fetch(file);\n    if (!response.ok) throw new Error('HTTP ' + response.status);\n    questions = await response.json();\n    if (!Array.isArray(questions) || questions.length === 0) throw new Error('問題データが空です');\n    return true;\n  } catch (error) {\n    console.error('問題を読み込めませんでした', error);\n    document.getElementById('questionText').textContent = '問題を読み込めませんでした';\n    return false;\n  }\n}\n\nfunction showNextQuestion() {\n${unlock}${loadFilter}\n  const index = Math.floor(Math.random() * pool.length);\n  currentQuestion = pool[index];\n  document.getElementById('questionText').textContent = currentQuestion.question;${focus}${timerStart}\n}\n${submit}${handlers}${timerCode}${finishCode}`;
}

function buildStorage() {
  return String.raw`const RECORD_KEY = 'typeTowerRecordsV1';

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY)) || {};
  } catch (error) {
    console.warn('記録を読み込めませんでした', error);
    return {};
  }
}

function saveRecord(mode, difficulty, result) {
  const records = loadRecords();
  const key = mode + ':' + difficulty;
  const old = records[key] || {};

  const next = {
    bestTime: old.bestTime == null ? result.time : Math.min(old.bestTime, result.time),
    maxCombo: Math.max(old.maxCombo || 0, result.maxCombo),
    bestAccuracy: Math.max(old.bestAccuracy || 0, result.accuracy)
  };

  records[key] = next;
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('記録を保存できませんでした', error);
  }
  return next;
}`;
}

function buildEffects() {
  return String.raw`function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playFloorMove(direction) {
  const scene = document.getElementById('towerScene');
  const className = direction === 'up' ? 'move-up' : 'move-down';
  scene.classList.remove('move-up', 'move-down');
  void scene.offsetWidth;
  scene.classList.add(className);
  await wait(340);
  scene.classList.remove(className);
}

async function flashAnswer(type) {
  const card = document.getElementById('questionCard');
  const className = type === 'correct' ? 'is-correct' : 'is-miss';
  card.classList.remove('is-correct', 'is-miss');
  void card.offsetWidth;
  card.classList.add(className);
  await wait(250);
  card.classList.remove(className);
}`;
}

function kanjiJson(step) {
  if (step < 2) return null;
  if (step < 6) return String.raw`[
  { "question": "紅葉", "answer": "こうよう" },
  { "question": "景色", "answer": "けしき" },
  { "question": "概念", "answer": "がいねん" },
  { "question": "憂鬱", "answer": "ゆううつ" }
]`;
  return String.raw`[
  { "question": "紅葉", "answer": "こうよう", "difficulty": "easy" },
  { "question": "景色", "answer": "けしき", "difficulty": "easy" },
  { "question": "概念", "answer": "がいねん", "difficulty": "normal" },
  { "question": "憂鬱", "answer": "ゆううつ", "difficulty": "normal" },
  { "question": "躊躇", "answer": "ちゅうちょ", "difficulty": "hard" },
  { "question": "彷徨", "answer": "ほうこう", "difficulty": "hard" }
]`;
}

function jaEnJson() {
  return String.raw`[
  { "question": "りんご", "answer": "apple", "difficulty": "easy" },
  { "question": "学校", "answer": "school", "difficulty": "easy" },
  { "question": "経験", "answer": "experience", "difficulty": "normal" },
  { "question": "環境", "answer": "environment", "difficulty": "normal" },
  { "question": "責任", "answer": "responsibility", "difficulty": "hard" }
]`;
}

function enJaJson() {
  return String.raw`[
  { "question": "apple", "answer": "りんご", "difficulty": "easy" },
  { "question": "school", "answer": "学校", "difficulty": "easy" },
  { "question": "experience", "answer": "経験", "difficulty": "normal" },
  { "question": "environment", "answer": "環境", "difficulty": "normal" },
  { "question": "responsibility", "answer": "責任", "difficulty": "hard" }
]`;
}

function testMd() {
  return String.raw`# TYPE TOWER 最終テスト

- [ ] 開いた瞬間に空と3つの塔が見える
- [ ] 3つの塔すべてから開始できる
- [ ] EASY / NORMAL / HARDを選べる
- [ ] JSONから問題が表示される
- [ ] Enterで回答できる
- [ ] 正解で +1F
- [ ] MISSで -1F
- [ ] 1F未満にならない
- [ ] TIME 0でMISSになる
- [ ] COMBOが増える
- [ ] MISSでCOMBOが0になる
- [ ] 10FでRESULTへ進む
- [ ] RESULTの数字が実プレイと合う
- [ ] ベスト記録がリロード後も残る
- [ ] RESULTからHOMEへ戻れる
- [ ] 階移動で空ではなく塔内部だけが動く
- [ ] 連打しても二重判定しない
- [ ] 狭い画面でも主要操作ができる`;
}

function filesForStep(step) {
  const files = [
    ['game/index.html', buildIndex(step)],
    ['game/css/style.css', buildCss(step)],
    ['game/js/main.js', buildMain(step)],
    ['game/js/game.js', buildGame(step)]
  ];
  const kanji = kanjiJson(step);
  if (kanji) files.push(['game/data/kanji.json', kanji]);
  if (step >= 7) {
    files.push(['game/data/ja-en.json', jaEnJson()]);
    files.push(['game/data/en-ja.json', enJaJson()]);
  }
  if (step >= 8) files.push(['game/js/storage.js', buildStorage()]);
  if (step >= 9) files.push(['game/js/effects.js', buildEffects()]);
  if (step >= 10) files.push(['TEST.md', testMd()]);
  return files;
}

function renderSnapshot(step) {
  const [title, goal] = STEP_META[step - 1];
  const section = document.createElement('section');
  section.className = 'section build-step snapshot-step ' + (step % 2 === 0 ? 'section-soft' : '');
  section.id = 'snapshot-step-' + step;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.innerHTML = `
    <div class="step-head">
      <div class="step-number">${String(step).padStart(2, '0')}</div>
      <div class="step-title"><p>STEP ${step} 終了時</p><h2>${title}</h2></div>
    </div>
    <p class="step-intro">${goal}</p>
    <div class="snapshot-note"><b>このSTEPでは：</b> 下にある各ファイルを開くと、その時点のファイル内容を最初から最後まで確認できます。</div>
  `;

  const fileList = document.createElement('div');
  fileList.className = 'snapshot-files';
  filesForStep(step).forEach(([path, source], index) => {
    const details = document.createElement('details');
    details.className = 'snapshot-file';
    if (index === 0) details.open = true;
    const summary = document.createElement('summary');
    summary.innerHTML = `<span>${path}</span><small>ファイル全文</small>`;
    const pre = document.createElement('pre');
    pre.className = 'code-block snapshot-code';
    const code = document.createElement('code');
    code.textContent = source;
    pre.appendChild(code);
    details.append(summary, pre);
    fileList.appendChild(details);
  });

  wrap.appendChild(fileList);
  section.appendChild(wrap);
  return section;
}

const app = document.getElementById('snapshotApp');
const jump = document.createElement('nav');
jump.className = 'wrap snapshot-jump';
jump.setAttribute('aria-label', 'STEP全文記入例');
for (let step = 1; step <= 10; step += 1) {
  const link = document.createElement('a');
  link.href = '#snapshot-step-' + step;
  link.textContent = 'STEP ' + step;
  jump.appendChild(link);
}
app.appendChild(jump);
for (let step = 1; step <= 10; step += 1) {
  app.appendChild(renderSnapshot(step));
}
