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

function applyStudentAssetPolicy(css) {
  let nextCss = css;

  // 背景・塔画像・塔内部の完成素材は自分たちの実ファイルを使う。
  // STEP例では、素材を勝手に描かず、配置とUIを中心に残す。
  nextCss = cleanRule(nextCss, 'body', ['background', 'background-attachment']);
  nextCss = cleanRule(nextCss, '.tower-image', [
    'border',
    'border-bottom-width',
    'background',
    'background-color',
    'background-image'
  ]);
  nextCss = cleanRule(nextCss, '.tower-kanji', ['background', 'background-color', 'background-image', 'border-color']);
  nextCss = cleanRule(nextCss, '.tower-eiyaku', ['background', 'background-color', 'background-image', 'border-color']);
  nextCss = cleanRule(nextCss, '.tower-wayaku', ['background', 'background-color', 'background-image', 'border-color']);
  nextCss = cleanRule(nextCss, '.game-stage', ['background']);
  nextCss = cleanRule(nextCss, '.stone-wall', ['background', 'background-color', 'background-image']);

  nextCss = nextCss.replace(`
@media (max-width: 620px) {
  .tower-select { grid-template-columns: 1fr; width: min(330px,100%); }
  .tower-image { width: 190px; height: 230px; }
}`, '');

  const note = `/*
  SELECT背景は assets/videos/menu-bg.mp4 を使う。
  sky-bg.jpg と tower-blue / light / dark はGAME画面用として保持する。
  現在の自分たちのHTML / main.jsを優先し、必要な処理だけ足す。
*/

`;

  return note + nextCss.trimStart();
}

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
}
.back-button { position: absolute; top: 18px; left: 18px; z-index: 10; }
.game-stage {
  position: relative;
  width: min(920px, 100%);
  min-height: min(680px, 86vh);
  overflow: hidden;
  border: 7px solid #aa8d64;
  border-radius: 18px;
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

const CURRENT_MAIN = `let selectedMode='kanji';

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

const SELECT_VIDEO_CSS = `
.select-bg-video {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
`;

const TOWER_TEXT_CSS = `
.tower-image {
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
`;

function findFileCode(section, path) {
  const files = [...section.querySelectorAll('.full-file')];
  const file = files.find(item => item.querySelector('summary span')?.textContent?.trim().startsWith(path));
  return file?.querySelector('pre code') || null;
}

function syncStepOne() {
  const section = document.getElementById('full-step-1');
  if (!section) return;

  const indexCode = findFileCode(section, 'index.html');
  const cssCode = findFileCode(section, 'css/style.css');
  const mainCode = findFileCode(section, 'js/main.js');

  if (indexCode) indexCode.textContent = CURRENT_INDEX;
  if (cssCode) cssCode.textContent = CURRENT_STYLE;
  if (mainCode) mainCode.textContent = CURRENT_MAIN;

  const note = section.querySelector('.full-step-note');
  if (note) note.innerHTML = '<b>現在の実コード基準：</b> index.html / css/style.css / main.js は現在の type-tower-a の内容に合わせています。game.js は現時点では空です。';
}

function syncFutureIndexExamples() {
  document.querySelectorAll('#fullExampleApp .full-file').forEach(file => {
    const label = file.querySelector('summary span')?.textContent?.trim() || '';
    if (!label.startsWith('index.html')) return;

    const code = file.querySelector('pre code');
    if (!code || code.closest('#full-step-1')) return;

    let html = code.textContent;
    html = html.replaceAll('videos/menu-bg.mp4', 'assets/videos/menu-bg.mp4');

    if (!html.includes('class="select-bg-video"')) {
      html = html.replace(
        '<section data-screen="select">',
        '<section data-screen="select">\n   <video class="select-bg-video" autoplay muted loop playsinline>\n     <source src="assets/videos/menu-bg.mp4" type="video/mp4">\n   </video>'
      );
    }

    code.textContent = html;
  });
}

function updateCssExamples() {
  document.querySelectorAll('#fullExampleApp .full-file').forEach(file => {
    const label = file.querySelector('summary span')?.textContent?.trim() || '';
    if (!label.startsWith('css/style.css')) return;

    const code = file.querySelector('pre code');
    if (!code) return;
    if (code.closest('#full-step-1')) return;

    let css = applyStudentAssetPolicy(code.textContent);

    if (!css.includes('.select-bg-video')) css += SELECT_VIDEO_CSS;
    css += TOWER_TEXT_CSS;

    code.textContent = css;
  });
}

syncStepOne();
syncFutureIndexExamples();
updateCssExamples();
