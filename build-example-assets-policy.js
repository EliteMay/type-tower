const CURRENT_INDEX = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TYPE TOWER</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
 <section data-screen="select">
   <video class="select-bg-video" autoplay muted loop playsinline>
     <source src="assets/videos/menu-bg.mp4" type="video/mp4">
   </video>

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

 <section data-screen="game" hidden>
   <button id="gameBackButton" class="back-button">塔選択へ戻る</button>
   <div class="game-stage">
     <div class="game-hud">
       <div class="hud-top"><div></div></div>
       <div id="questionCard" class="question-card">
         <p>読みを入力</p>
         <h2 id="questionText">読み込み中…</h2>
       </div>
       <form id="answerForm" class="answer-form">
         <input id="answerInput" type="text" autocomplete="off" placeholder="答えを入力してEnter">
       </form>
       <p id="judgeMessage" class="judge-message" aria-live="polite"></p>
     </div>
   </div>
 </section>
<section data-screen="result" hidden></section>


  <script src="js/game.js"></script>
  <script src="js/main.js"></script>
</body>
</html>`;

const CURRENT_STYLE = `* { box-sizing: border-box; }
html, body { min-height: 100%; }
body {
  margin: 0;
  font-family: "Yu Gothic UI", "Yu Gothic", sans-serif;
  color: #172034;
}
button, input, select { font: inherit; }
button { cursor: pointer; }
[hidden] { display: none !important; }

[data-screen] { min-height: 100vh; }
[data-screen="select"] {
  position: relative;
  overflow: hidden;
  display: grid;
  align-content: center;
  padding: 34px clamp(18px, 4vw, 60px);
}
.select-bg-video {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.tower-select {
  position: relative;
  z-index: 1;
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
  border-radius: 28px 28px 5px 5px;
  color: #fff3cf;
  font-family: "Yu Mincho", "Hiragino Mincho ProN", serif;
  font-size: 1.35rem;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: .08em;
  text-shadow:
    0 2px 1px rgba(33, 22, 14, .95),
    1px 0 1px rgba(33, 22, 14, .85),
    -1px 0 1px rgba(33, 22, 14, .85),
    0 -1px 1px rgba(33, 22, 14, .75),
    0 4px 10px rgba(0, 0, 0, .5);
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

[data-screen="game"] {
  position: relative;
  display: grid;
  place-items: center;
  padding: 70px 24px 24px;
  background: url("../assets/images/sky-bg.jpg") center / cover no-repeat;
}
.back-button { position: absolute; top: 18px; left: 18px; z-index: 10; }
.game-stage {
  position: relative;
  width: min(920px, 100%);
  min-height: min(680px, 86vh);
  overflow: hidden;
  border: 7px solid #aa8d64;
  border-radius: 18px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 24px 50px rgba(31,73,108,.24);
}
[data-screen="game"][data-mode="kanji"] .game-stage {
  background-image: url("../assets/images/tower-blue.jpg");
}
[data-screen="game"][data-mode="eiyaku"] .game-stage {
  background-image: url("../assets/images/tower-light.jpg");
}
[data-screen="game"][data-mode="wayaku"] .game-stage {
  background-image: url("../assets/images/tower-dark.jpg");
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
.question-card h2 { margin: 0; font-size: clamp(2.4rem,7vw,5rem); }

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

const CURRENT_MAIN = `let selectedMode='kanji';

document.querySelectorAll('[data-mode]').forEach(button=>{
  button.addEventListener('click',()=>{
    startGame(button.dataset.mode);
  });
});

async function startGame(mode) {
  selectedMode=mode;
  document.querySelector('[data-screen="game"]').dataset.mode=mode;
  showScreen('game');
  await prepareGame();
}

function showScreen(screenName) {
  document.querySelectorAll('[data-screen]').forEach(section => {
    section.hidden = (section.dataset.screen !== screenName);
  });
}

const gameBackButton=document.getElementById('gameBackButton');
gameBackButton.addEventListener('click',()=>{
  showScreen('select');
});
showScreen('select');`;

const CURRENT_GAME = `const DATA_FILES={kanji:'./data/kanji.json'};

let questions=[];
let currentQuestion=null;

async function prepareGame(){
  const loaded=await loadQuestions();
  if(loaded) showNextQuestion();
}

async function loadQuestions(){
  try{
    const response=await fetch(DATA_FILES.kanji);
    if(!response.ok) throw new Error('HTTP '+response.status);
    questions=await response.json();
    if(!Array.isArray(questions) || questions.length===0) throw new Error('問題データが空です');
    return true;
  }catch(error){
    console.error(error);
    document.getElementById('questionText').textContent='問題を読み込めませんでした';
    return false;
  }
}

function showNextQuestion(){
  const pool=questions;
  currentQuestion=pool[Math.floor(Math.random()*pool.length)];
  document.getElementById('questionText').textContent=currentQuestion.question;
  document.getElementById('answerInput').value='';
  document.getElementById('answerInput').focus();
}

const answerForm=document.getElementById('answerForm');
const answerInput=document.getElementById('answerInput');
const judgeMessage=document.getElementById('judgeMessage');

answerForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!currentQuestion) return;
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
}

async function handleCorrect(){
  judgeMessage.textContent='正解！';
  showNextQuestion();
}

async function handleMiss(){
  judgeMessage.textContent='MISS';
  showNextQuestion();
}`;

const CURRENT_SELECT_CSS = CURRENT_STYLE.split('\n[data-screen="game"]')[0].trim();
const CURRENT_STEP2_STYLE = CURRENT_STYLE.split('\n.answer-form')[0].trim();

function findFileCode(section, path) {
  const files = [...section.querySelectorAll('.full-file')];
  const file = files.find(item => item.querySelector('summary span')?.textContent?.trim().startsWith(path));
  return file?.querySelector('pre code') || null;
}

function getStepNumber(file) {
  const section = file.closest('[id^="full-step-"]');
  const match = section?.id.match(/full-step-(\d+)/);
  return match ? Number(match[1]) : 0;
}

function removeMaxWidthMedia(css) {
  const pattern = /@media\s*\(max-width:[^)]+\)\s*\{/g;
  let result = '';
  let cursor = 0;
  let match;

  while ((match = pattern.exec(css))) {
    result += css.slice(cursor, match.index);
    const openIndex = css.indexOf('{', match.index);
    let depth = 1;
    let index = openIndex + 1;

    while (index < css.length && depth > 0) {
      if (css[index] === '{') depth += 1;
      if (css[index] === '}') depth -= 1;
      index += 1;
    }

    cursor = index;
    pattern.lastIndex = index;
  }

  return result + css.slice(cursor);
}

function removeDeclaration(body, property) {
  const pattern = new RegExp(`\\n?\\s*${property}\\s*:[\\s\\S]*?;`, 'g');
  return body.replace(pattern, '');
}

function cleanRule(css, selector, properties) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${escapedSelector}\\s*\\{)([^{}]*)(\\})`, 'g');

  return css.replace(pattern, (match, open, body, close) => {
    let nextBody = body;
    properties.forEach(property => {
      nextBody = removeDeclaration(nextBody, property);
    });
    return `${open}${nextBody}${close}`;
  });
}

function cleanFutureCss(css) {
  let nextCss = removeMaxWidthMedia(css);
  nextCss = cleanRule(nextCss, '.tower-eiyaku', ['border-color']);
  nextCss = cleanRule(nextCss, '.tower-wayaku', ['border-color']);
  nextCss = cleanRule(nextCss, '.stone-wall', ['background', 'background-color', 'background-image']);
  nextCss = cleanRule(nextCss, '.enemy-shape', ['background']);
  nextCss = cleanRule(nextCss, '.enemy-shape span::before', ['background', 'box-shadow']);
  nextCss = cleanRule(nextCss, '.enemy-shape span::after', ['background', 'box-shadow']);
  return nextCss.trim();
}

function makeStepCss(step, generatedCss) {
  if (step === 1) return CURRENT_SELECT_CSS;
  if (step === 2) return CURRENT_STEP2_STYLE;

  let css = CURRENT_STYLE;
  if (step >= 4) {
    const marker = '\n\n.floor-rail {';
    const markerIndex = generatedCss.indexOf(marker);
    if (markerIndex >= 0) {
      css += `\n\n${cleanFutureCss(generatedCss.slice(markerIndex).trim())}`;
    }
  }
  return css;
}

function ensureSelectVideo(html) {
  let nextHtml = html.replaceAll('videos/menu-bg.mp4', 'assets/videos/menu-bg.mp4');

  if (!nextHtml.includes('class="select-bg-video"')) {
    nextHtml = nextHtml.replace(
      '<section data-screen="select">',
      '<section data-screen="select">\n   <video class="select-bg-video" autoplay muted loop playsinline>\n     <source src="assets/videos/menu-bg.mp4" type="video/mp4">\n   </video>'
    );
  }

  nextHtml = nextHtml
    .replace('<div class="tower-image">漢字の塔</div>', '<div class="tower-image tower-kanji">漢字の塔</div>')
    .replace('<div class="tower-image">英訳の塔</div>', '<div class="tower-image tower-eiyaku">英訳の塔</div>')
    .replace('<div class="tower-image">和訳の塔</div>', '<div class="tower-image tower-wayaku">和訳の塔</div>');

  return nextHtml;
}

function patchMainExample(main, step) {
  if (step < 2 || main.includes('dataset.mode=mode')) return main;
  return main.replace(
    "  selectedMode=mode;\n  showScreen('game');",
    "  selectedMode=mode;\n  document.querySelector('[data-screen=\"game\"]').dataset.mode=mode;\n  showScreen('game');"
  );
}

function syncGeneratedExamples() {
  document.querySelectorAll('#fullExampleApp .full-file').forEach(file => {
    const label = file.querySelector('summary span')?.textContent?.trim() || '';
    const code = file.querySelector('pre code');
    const step = getStepNumber(file);
    if (!code || !step) return;

    if (label.startsWith('index.html')) {
      code.textContent = ensureSelectVideo(code.textContent);
    }

    if (label.startsWith('css/style.css')) {
      code.textContent = makeStepCss(step, code.textContent);
    }

    if (label.startsWith('js/main.js')) {
      code.textContent = patchMainExample(code.textContent, step);
    }
  });

  document.querySelectorAll('[id^="full-step-"]').forEach(section => {
    const step = Number(section.id.replace('full-step-', ''));
    const note = section.querySelector('.full-step-note');
    if (!note) return;

    if (step <= 3) {
      note.innerHTML = `<b>現在実装へ合わせた全文：</b> STEP ${step} までの内容に加えて、SELECT背景動画・塔名CSS・PC向け3列配置を維持します。`;
    } else {
      note.innerHTML = `<b>巻き戻り防止済み：</b> STEP 1〜3の現在コードとGAME背景素材を残したまま、STEP ${step} の追加分だけを積み上げた全文です。`;
    }
  });
}

function createCurrentGameDetails(section) {
  let code = findFileCode(section, 'js/game.js');
  if (code) {
    code.textContent = CURRENT_GAME;
    return;
  }

  const details = document.createElement('details');
  details.className = 'full-file';
  details.open = true;

  const summary = document.createElement('summary');
  const name = document.createElement('span');
  const meta = document.createElement('small');
  name.textContent = 'js/game.js（現在全文）';
  meta.textContent = 'STEP 2〜3';
  summary.append(name, meta);

  const pre = document.createElement('pre');
  code = document.createElement('code');
  code.textContent = CURRENT_GAME;
  pre.appendChild(code);
  details.append(summary, pre);

  const rule = section.querySelector('.source-rule');
  if (rule) section.insertBefore(details, rule);
  else section.appendChild(details);
}

function syncCurrentCodeSection() {
  const section = document.getElementById('currentCode');
  if (!section) return;

  const indexCode = findFileCode(section, 'index.html');
  const cssCode = findFileCode(section, 'css/style.css');
  const mainCode = findFileCode(section, 'js/main.js');

  if (indexCode) indexCode.textContent = CURRENT_INDEX;
  if (cssCode) cssCode.textContent = CURRENT_STYLE;
  if (mainCode) mainCode.textContent = CURRENT_MAIN;
  createCurrentGameDetails(section);

  const intro = section.querySelector('.section-head p:last-child');
  if (intro) intro.textContent = '現在の type-tower-a はSTEP 3完了相当です。index.html / style.css / main.js / game.js をこの状態から残してSTEP 4へ進みます。';

  const rule = section.querySelector('.source-rule');
  if (rule) {
    rule.innerHTML = '<strong>空ファイルはまだ先回りして埋めない</strong><p>effects.js / storage.js はまだ空です。STEP 4では現在の4ファイルへ階数処理だけを追加し、不要な機能は増やしません。</p>';
  }
}

function syncCurrentFilesSection() {
  const section = document.getElementById('currentFiles');
  if (!section) return;

  const description = section.querySelector('.section-head p:last-child');
  if (description) description.textContent = '2026-09-04時点の type-tower-a / main。STEP 3完了相当で、次はSTEP 4です。';

  const tree = section.querySelector('pre code');
  if (tree) {
    tree.textContent = `type-tower-a/
├─ index.html          ← SELECT / GAME / RESULTの箱 + STEP3入力欄
├─ css/
│  └─ style.css        ← SELECT動画 + GAME背景素材 + STEP3入力CSS
├─ js/
│  ├─ main.js          ← モード選択・画面切替・GAME背景モード指定
│  ├─ game.js          ← 問題読込・1問表示・入力・正解/MISS判定
│  ├─ effects.js       ← 現在は空
│  └─ storage.js       ← 現在は空
├─ data/
│  ├─ kanji.json       ← JSON構文修正済み / 現在使用中
│  ├─ ja-en.json       ← 現在は空
│  └─ en-ja.json       ← 問題あり
└─ assets/
   ├─ videos/
   │  └─ menu-bg.mp4       ← SELECT背景
   ├─ images/
   │  ├─ sky-bg.jpg        ← GAME全体背景
   │  ├─ tower-blue.jpg    ← kanji GAMEステージ
   │  ├─ tower-light.jpg   ← eiyaku GAMEステージ
   │  ├─ tower-dark.jpg    ← wayaku GAMEステージ
   │  ├─ enemies/
   │  └─ tower/
   └─ sounds/`;
  }

  const next = section.querySelector('.source-rule');
  if (next) {
    next.innerHTML = '<strong>今の次作業：STEP 4</strong><p>現在の正解 / MISS判定へ floor を追加し、正解 +1F、MISS -1F、1F未満防止、10F到達判定まで進めます。STEP 1〜3のコードと背景素材は残します。</p>';
  }
}

function syncHeroRules() {
  const rules = document.querySelectorAll('.example-hero .source-rule.secondary');
  if (rules[0]) {
    rules[0].innerHTML = '<strong>素材の現在の用途</strong><p>SELECTは assets/videos/menu-bg.mp4。GAME全体は sky-bg.jpg、ゲームステージは kanji=blue / eiyaku=light / wayaku=dark を実際に使用中です。</p>';
  }

  const summary = document.querySelector('.example-hero .example-summary');
  if (summary) {
    summary.innerHTML = '<span>現在の実ファイルを最優先</span><span>STEPごとにファイル全文</span><span>前STEPを巻き戻さない</span><span>STEP3 + GAME背景を維持</span>';
  }
}

syncHeroRules();
syncCurrentFilesSection();
syncCurrentCodeSection();
syncGeneratedExamples();
