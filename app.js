const boxes = [...document.querySelectorAll('.stage-check input[type="checkbox"]')];
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetButton = document.getElementById('resetChecks');
const nextStepLabel = document.getElementById('nextStepLabel');
const nextStepTitle = document.getElementById('nextStepTitle');
const nextStepText = document.getElementById('nextStepText');
const nextStepLink = document.getElementById('nextStepLink');
const storageKey = 'typeTowerRoadmapChecksV4';

const steps = [
  { title: '3画面の箱とHOMEの塔を作る', text: 'HOME / GAME / RESULT の3画面を用意し、HOMEには空背景・3つの塔・各塔の開始ボタンを置く。' },
  { title: '漢字問題を表示する', text: 'まず漢字の塔だけ。kanji.jsonから問題を読み込み、GAME画面へ1問ずつ表示する。' },
  { title: 'タイピング判定を完成させる', text: '入力 → Enter → 正解 / MISS → 次の問題、を連続して遊べる状態にする。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で+1F、MISSで-1F、10FでCLEAR。空は固定し、後で塔側だけを上下演出できる構造にする。' },
  { title: '最初から最後まで遊べる状態にする', text: 'HOMEの漢字の塔ボタンからRESULTまで、通しで遊べる状態にする。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: 'ゲームの芯を壊さず、TIME・COMBO・難易度を1つずつ追加する。' },
  { title: '残り2つの塔をゲームにつなぐ', text: '英訳の塔・和訳の塔のボタンも、同じゲーム処理へつなぐ。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間・ハイスコアを表示し、localStorageへ保存する。' },
  { title: 'HOMEとGAMEの見た目・階移動を仕上げる', text: '固定の空、3つの塔、塔内部の上下スライド、敵、HUD、正解/MISS演出を仕上げる。' },
  { title: '問題追加・テスト・発表準備', text: '3つの塔から開始できるか含めて通しテストし、重大バグを直す。' }
];

const implementationGuides = [
  {
    title: 'STEP 1：3画面の箱 + HOMEの3つの塔を作る',
    goal: 'サイトを開いた瞬間に空背景と3つの塔が見え、漢字の塔のボタンからGAMEへ進める状態を作る。',
    summary: 'SELECT画面は作りません。HOME自体をモード選択画面にして、3モードを3つの塔として見せます。最初は3つとも見た目だけ置き、漢字の塔だけ動けばOKです。',
    tools: ['HTML section', 'button', 'data-mode', 'hidden属性', 'JavaScript'],
    why: [
      'HOME：サイトを開いた最初の画面とモード選択を1つにまとめるため。',
      '3つの塔：漢字 / 日本語→英語 / 英語→日本語を見た目で分かりやすく分けるため。',
      'data-mode：どの塔のボタンを押したかJavaScriptへ渡すため。',
      'hidden：HOME / GAME / RESULT のうち使っていない画面を隠すため。'
    ],
    files: ['game/index.html', 'game/css/style.css', 'game/js/main.js'],
    tasks: [
      'HOME / GAME / RESULT の3つのsectionを作る。SELECTは作らない。',
      'HOMEには画面いっぱいの空背景を置く。空は後でGAMEでも同じ最背面レイヤーとして使える構造にする。',
      'HOME中央に漢字の塔 / 英訳の塔 / 和訳の塔を3つ横並びで置く。',
      '各塔の真下に「この塔に挑戦」ボタンを置き、data-modeを付ける。',
      '最初は漢字の塔ボタンだけstartGame("kanji")へつなぐ。残り2つは見た目だけでもよい。',
      '狭い画面でも3塔が極端に潰れないよう、塔サイズと文字を段階的に小さくする。'
    ],
    check: [
      'サイトを開くと別画面を挟まず3つの塔が見える',
      '空背景が画面全体にある',
      '3つの塔それぞれの下に開始ボタンがある',
      '漢字の塔ボタンでGAMEへ進める',
      'HOMEへ戻る操作ができる'
    ],
    visualSteps: [
      '① 空背景だけを画面全体に置く',
      '② 3つの塔を同じ高さの基準線で横並びにする',
      '③ 塔名とモード説明を付ける',
      '④ 各塔の真下に開始ボタンを置く',
      '⑤ 漢字の塔だけGAMEへつないで動作確認する'
    ],
    code: `<!-- index.html の記入例 -->
<section data-screen="home">
  <div class="tower-select">
    <article class="tower-option">
      <div class="tower-image">漢字の塔</div>
      <button data-mode="kanji">この塔に挑戦</button>
    </article>

    <article class="tower-option">
      <div class="tower-image">英訳の塔</div>
      <button data-mode="jaEn">この塔に挑戦</button>
    </article>

    <article class="tower-option">
      <div class="tower-image">和訳の塔</div>
      <button data-mode="enJa">この塔に挑戦</button>
    </article>
  </div>
</section>

<section data-screen="game" hidden></section>
<section data-screen="result" hidden></section>

// main.js の記入例
let selectedMode = 'kanji';

document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => {
    startGame(button.dataset.mode);
  });
});

function startGame(mode) {
  selectedMode = mode;
  showScreen('game');
}`
  },
  {
    title: 'STEP 2：漢字問題を表示する',
    goal: 'kanji.jsonの問題を読み込み、漢字の塔を開始したGAME画面にランダムで1問表示する。',
    summary: '問題データはHTMLへ大量に直書きせずJSONへ分けます。最初は10問程度で動作確認し、問題追加は後から分担できます。',
    tools: ['JSON', 'fetch()', 'await', 'Math.random()', 'textContent'],
    why: [
      'JSON：問題データとゲーム処理を分けるため。',
      'fetch()：別ファイルのkanji.jsonを読み込むため。',
      'Math.random()：毎回違う問題を選べるようにするため。',
      'textContent：選んだ問題をGAME画面へ表示するため。'
    ],
    files: ['game/data/kanji.json', 'game/js/game.js', 'game/index.html'],
    tasks: [
      'kanji.jsonを作り、question / answer / difficultyを持つ問題を10問入れる。',
      'game.jsでfetch()し、読み込んだ配列をquestionsへ保存する。',
      'Math.random()で1問選びcurrentQuestionへ入れる。',
      '問題表示欄へcurrentQuestion.questionを表示する。',
      '漢字の塔ボタンからゲームを開始したときにloadQuestions()が呼ばれるようにする。'
    ],
    check: ['GAME画面に漢字が出る', '何度か始めると別の問題も出る', '問題と答えがセットで保持される'],
    code: `// kanji.json
[
  { "question": "躊躇", "answer": "ちゅうちょ", "difficulty": "normal" },
  { "question": "憂鬱", "answer": "ゆううつ", "difficulty": "normal" }
]

// game.js
let questions = [];
let currentQuestion = null;

async function loadQuestions() {
  const response = await fetch('./data/kanji.json');
  questions = await response.json();
  showNextQuestion();
}

function showNextQuestion() {
  const index = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[index];
  document.getElementById('questionText').textContent = currentQuestion.question;
}`
  },
  {
    title: 'STEP 3：タイピング判定を作る',
    goal: '入力した答えをEnterで判定し、正解なら正解処理、違えばMISS処理へ分ける。',
    summary: 'TYPE TOWERの中心処理です。入力 → 判定 → 次の問題までを1本につなげます。',
    tools: ['form', 'input', 'submit event', 'preventDefault()', 'if'],
    why: [
      'form：Enterキーで回答しやすくするため。',
      'submitイベント：回答した瞬間だけ判定するため。',
      'preventDefault()：Enterでページが再読み込みされるのを防ぐため。',
      'if：入力値と正解データが一致するか分けるため。'
    ],
    files: ['game/index.html', 'game/js/game.js'],
    tasks: ['GAMEにformとinputを置く。', 'submit時にinput.value.trim()を取る。', 'currentQuestion.answerと比較する。', '正解ならhandleCorrect()、違えばhandleMiss()を呼ぶ。', '入力欄を空にして次の問題へ進む。'],
    check: ['正しい答えで正解になる', '違う答えでMISSになる', 'Enterでページが再読み込みされない', '回答後すぐ次を入力できる'],
    code: `answerForm.addEventListener('submit', event => {
  event.preventDefault();
  const answer = answerInput.value.trim();

  if (answer === currentQuestion.answer) {
    handleCorrect();
  } else {
    handleMiss();
  }

  answerInput.value = '';
  showNextQuestion();
  answerInput.focus();
});`
  },
  {
    title: 'STEP 4：タワーの上下とクリアをつなぐ',
    goal: '正解で1階上がり、MISSで1階下がり、10Fへ着いたらクリアする。',
    summary: 'まずfloor変数の処理を完成させます。見た目のスライドは後で追加しますが、空は固定・塔側だけ動かすというレイヤー構造はここで意識します。',
    tools: ['JavaScript変数', 'Math.max()', 'data-floor', 'classList.toggle()'],
    why: [
      'floor：現在階を1か所で管理するため。',
      'Math.max()：MISSしても0F以下にならないようにするため。',
      'data-floor：左の階数表示とfloorを対応させるため。'
    ],
    files: ['game/index.html', 'game/js/game.js'],
    tasks: ['floorを1で初期化する。', '正解でfloor += 1する。', 'MISSでfloor = Math.max(1, floor - 1)にする。', '現在階表示を更新する。', '10FでfinishGame()を呼ぶ。'],
    check: ['正解で+1F', 'MISSで-1F', '1F未満にならない', '10FでRESULTへ進む'],
    code: `let floor = 1;

function handleCorrect() {
  floor += 1;
  updateFloorUI();
  if (floor >= 10) finishGame();
}

function handleMiss() {
  floor = Math.max(1, floor - 1);
  updateFloorUI();
}`
  },
  {
    title: 'STEP 5：漢字の塔を最後まで遊べる状態にする',
    goal: 'HOMEの漢字の塔ボタン → GAME → 10F → RESULT → HOMEまでを一本につなぐ。',
    summary: 'ここで一度、見た目が簡素でも完成したゲームループを作ります。残り2つの塔や豪華な演出はまだ追加しません。',
    tools: ['startGame()', 'finishGame()', '状態初期化', 'showScreen()'],
    why: [
      'startGame()：開始時の初期化を1か所にまとめるため。',
      'finishGame()：終了時の処理を1か所にまとめるため。',
      'HOMEへ戻る：繰り返し塔を選び直せるようにするため。'
    ],
    files: ['game/js/main.js', 'game/js/game.js', 'game/index.html'],
    tasks: ['startGame(mode)でselectedMode・floor・正解数・MISS数を初期化する。', '漢字問題を読み込んでGAMEへ移動する。', '10FでRESULTへ移動する。', 'RESULTに正解数とMISS数を表示する。', '「塔選択へ戻る」でHOMEへ戻れるようにする。'],
    check: ['HOME → 漢字の塔 → GAME → CLEAR → RESULTまで通る', 'RESULTからHOMEへ戻れる', 'もう一度始めるとfloorが1Fへ戻る', '3人全員が1ゲーム通して遊べる'],
    code: `function startGame(mode) {
  selectedMode = mode;
  floor = 1;
  correctCount = 0;
  missCount = 0;
  showScreen('game');
  loadModeQuestions();
}

function finishGame() {
  showScreen('result');
}`
  },
  {
    title: 'STEP 6：タイマー・コンボ・難易度を追加する',
    goal: '1問ごとのTIME、連続正解COMBO、EASY / NORMAL / HARDを追加する。',
    summary: 'COMBO → TIME → 難易度の順で1つずつ追加すると確認しやすいです。',
    tools: ['setInterval()', 'clearInterval()', 'filter()', 'JavaScript変数'],
    why: ['clearInterval()：前の問題のタイマーが残るバグを防ぐため。', 'filter()：難易度に合う問題だけへ絞るため。'],
    files: ['game/js/game.js', 'game/data/kanji.json', 'game/index.html'],
    tasks: ['comboとmaxComboを追加する。', '正解で+1、MISSで0へ戻す。', 'timeLeftとtimerIdを用意する。', '問題ごとにタイマーを開始する。', 'difficultyで問題を絞る。'],
    check: ['連続正解でCOMBOが増える', 'MISSで0へ戻る', 'TIMEが減る', '時間切れがMISSになる', '難易度で問題が変わる'],
    code: `function startQuestionTimer() {
  clearInterval(timerId);
  timeLeft = 10;

  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleMiss();
      showNextQuestion();
    }
  }, 1000);
}`
  },
  {
    title: 'STEP 7：残り2つの塔をゲームにつなぐ',
    goal: 'HOMEに最初からある英訳の塔・和訳の塔のボタンも、漢字の塔と同じゲーム処理へつなぐ。',
    summary: '新しいSELECT画面は追加しません。3つの塔のボタンがselectedModeを変え、読み込むJSONだけを切り替える構造にします。',
    tools: ['data-mode', 'selectedMode', 'オブジェクト', 'JSON', '共通game.js'],
    why: [
      'data-mode：押した塔を識別するため。',
      'selectedMode：ゲーム中にどの塔の問題を使うか覚えるため。',
      'dataFiles：モードごとに読み込むJSONを1か所で対応させるため。',
      '共通game.js：3モード分のゲーム処理をコピペしないため。'
    ],
    files: ['game/index.html', 'game/data/ja-en.json', 'game/data/en-ja.json', 'game/js/game.js'],
    tasks: ['HOMEの3ボタンすべてへdata-modeを付ける。', 'ja-en.jsonとen-ja.jsonを作る。', 'startGame(mode)でselectedModeを保存する。', 'selectedModeに応じて読み込むJSONだけ変える。', '階数・タイマー・COMBO・判定は共通処理を使う。'],
    check: ['3つの塔すべてのボタンから開始できる', '漢字の塔に英語問題が混ざらない', '英訳・和訳でも階数やタイマーが動く', 'モードごとのgame.jsを作っていない'],
    code: `const dataFiles = {
  kanji: './data/kanji.json',
  jaEn: './data/ja-en.json',
  enJa: './data/en-ja.json'
};

async function loadModeQuestions() {
  const response = await fetch(dataFiles[selectedMode]);
  questions = await response.json();
  showNextQuestion();
}`
  },
  {
    title: 'STEP 8：RESULTと記録保存を完成させる',
    goal: '正解数・MISS数・正答率・最大COMBO・クリア時間を表示し、ベスト記録を保存する。',
    summary: 'まずRESULT表示、その後localStorage保存の順で作ります。保存できなくてもゲーム自体は止めません。',
    tools: ['localStorage', 'JSON.stringify()', 'JSON.parse()', 'try/catch'],
    why: ['localStorage：サーバーなしで記録を残すため。', 'try/catch：保存失敗でゲーム全体を止めないため。'],
    files: ['game/js/storage.js', 'game/js/game.js', 'game/index.html'],
    tasks: ['RESULTへ各数値を表示する。', '塔/モード別の記録をrecordsへまとめる。', 'storage.jsへ保存処理を分ける。', '保存と読み込みをtry/catchで囲む。'],
    check: ['RESULTの数値が実プレイと合う', 'リロード後も記録が残る', '保存失敗でもHOMEからゲームを始められる'],
    code: `try {
  localStorage.setItem('typeTowerRecords', JSON.stringify(records));
} catch (error) {
  console.warn('記録を保存できませんでした', error);
}`
  },
  {
    title: 'STEP 9：HOMEとGAMEの見た目・階移動を仕上げる',
    goal: 'HOMEは固定の空 + 3つの塔、GAMEは固定の空 + 塔内部として仕上げ、正解/MISS時に塔側だけを上下へスライドさせる。',
    summary: '通常の階移動に動画は使いません。空・塔背景・敵・HUDを別レイヤーにして、画像 + CSSアニメーションで制御します。',
    tools: ['CSS Grid', 'position', 'z-index', 'transform', '@keyframes', '画像素材'],
    why: [
      '固定の空レイヤー：HOMEとGAMEの世界観をつなぎ、階移動で背景全体が不自然に流れないようにするため。',
      '塔レイヤー：正解/MISS時に上下へスライドさせるため。',
      'HUD固定：問題・入力・TIMEが演出で動いて読みにくくならないため。',
      '画像 + CSS：動画より開始タイミング・逆方向・途中操作を制御しやすいため。'
    ],
    files: ['game/index.html', 'game/css/style.css', 'game/js/effects.js', 'game/assets/images/tower/', 'game/assets/images/enemies/'],
    tasks: [
      'HOMEの空を最背面固定レイヤーにする。',
      'HOMEの3つの塔を同じ基準線に並べ、各ボタンを塔の真下へ置く。',
      'GAMEでは同じ空レイヤーを残し、中央に塔内部レイヤーを置く。',
      '問題カード・入力欄・TIME・COMBOはHUDとして基本固定する。',
      '正解時は現在の塔背景を下へ、次の階を上から入れる。MISS時は逆方向にする。',
      '敵は問題カードより後ろへ置き、文字を隠さない。',
      '演出中も入力ロックを長くしない。'
    ],
    check: ['HOMEを開いた瞬間3つの塔が主役に見える', '空は階移動で大きく動かない', '塔背景だけが上下へ切り替わる', 'HUDが読みやすい', '敵が問題を隠さない', '狭い画面でもボタンが押せる'],
    visualSteps: [
      '① HOME：固定の空だけ置く',
      '② HOME：3つの塔 + 塔名 + ボタンを置く',
      '③ GAME：同じ空の上に塔内部レイヤーを置く',
      '④ GAME：敵とHUDをレイヤー分けする',
      '⑤ 正解：塔背景を上階へスライド',
      '⑥ MISS：塔背景を下階へスライド',
      '⑦ 文字・ボタン・入力の読みやすさを最終確認'
    ],
    code: `/* 空は固定 */
.sky-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
}

/* 塔側だけ動かす */
.tower-scene {
  position: relative;
  z-index: 1;
  transition: transform .45s ease;
}

.tower-scene.move-up {
  transform: translateY(100%);
}

/* 問題UIは固定 */
.game-hud {
  position: relative;
  z-index: 3;
}`
  },
  {
    title: 'STEP 10：問題追加・テスト・発表準備',
    goal: '新機能を増やさず、3つの塔から最後まで遊べる安定版へ仕上げる。',
    summary: '最後は問題数と安定性を優先します。HOMEの3ボタン、階移動、各モードの問題混在がないかも確認します。',
    tools: ['JSON', 'ブラウザDevTools', 'GitHub Pull Request', '手動テスト'],
    why: ['手動テスト：短期間開発では実際の操作確認が重要なため。', 'Pull Request：最後の修正でmainを壊しにくくするため。'],
    files: ['game/data/*.json', 'TEST.md', 'README.md'],
    tasks: ['問題を増やして誤字・答え違いを確認する。', '3人が別々に通しプレイする。', '3つの塔それぞれの開始ボタンを確認する。', '正解/MISSの階移動方向を確認する。', '重大バグだけ優先して直す。'],
    check: ['3つの塔すべてから開始できる', '3モードを最後まで遊べる', '階移動方向が正しい', '進行不能バグがない', '動画撮影用の安定したデモ手順がある'],
    code: `TEST.md の記入例

- [ ] HOMEを開くと3つの塔が見える
- [ ] 漢字の塔から開始できる
- [ ] 英訳の塔から開始できる
- [ ] 和訳の塔から開始できる
- [ ] 正解で +1F
- [ ] MISSで -1F（1F未満にならない）
- [ ] 空は階移動で不自然に動かない
- [ ] 10FでRESULT
- [ ] RESULTからHOMEへ戻れる`
  }
];

function insertLearningPremise() {
  if (document.getElementById('learning-premise')) return;

  const section = document.createElement('section');
  section.className = 'section wrap';
  section.id = 'learning-premise';
  section.innerHTML = `
    <div class="section-head">
      <p class="eyebrow">HOW TO READ THIS GUIDE</p>
      <h2>授業の基礎知識はある前提で説明する</h2>
      <p>HTML / CSS / JavaScriptを最初から教え直すページにはしません。「このゲームで何のために使うか」と、実際に書くときの記入例を中心にします。</p>
    </div>
    <div class="policy-grid">
      <article class="policy-card primary-policy">
        <span class="policy-label">コード</span>
        <h3>目的 → 技術 → 記入例</h3>
        <p>if文とは何か、ではなく「正解判定でif文を使う」のようにTYPE TOWERへ結び付けて説明します。</p>
      </article>
      <article class="policy-card">
        <span class="policy-label">例</span>
        <h3>書き始められる例を多めに</h3>
        <p>HTML、JavaScript、JSON、CSS、TEST.mdまで、空白から悩まないための記入例を各STEPの小窓へ入れます。</p>
      </article>
      <article class="policy-card">
        <span class="policy-label">GitHub</span>
        <h3>GitHubだけは丁寧に</h3>
        <p>Branch / Commit / Pull Request / Merge / github.devは授業とは別なので、初めてでも操作できる説明を残します。</p>
      </article>
    </div>`;

  const teamPolicy = document.getElementById('team-policy');
  if (teamPolicy) teamPolicy.insertAdjacentElement('afterend', section);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    boxes.forEach(box => { box.checked = Boolean(saved[box.dataset.key]); });
  } catch (_) {
    // 保存データが壊れていてもロードマップ自体は使えるようにする。
  }
  updateUI();
}

function saveState() {
  const state = Object.fromEntries(boxes.map(box => [box.dataset.key, box.checked]));
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (_) {
    // 保存失敗でもチェック操作は続けられる。
  }
  updateUI();
}

function updateUI() {
  const done = boxes.filter(box => box.checked).length;
  const percent = boxes.length ? Math.round((done / boxes.length) * 100) : 0;

  if (progressText) progressText.textContent = `${percent}% (${done}/${boxes.length})`;
  if (progressBar) progressBar.style.width = `${percent}%`;

  document.querySelectorAll('.road-step').forEach((step, index) => {
    step.classList.toggle('done', Boolean(boxes[index]?.checked));
  });

  const nextIndex = boxes.findIndex(box => !box.checked);
  if (nextIndex === -1) {
    if (nextStepLabel) nextStepLabel.textContent = 'ALL COMPLETE';
    if (nextStepTitle) nextStepTitle.textContent = 'ロードマップ完了';
    if (nextStepText) nextStepText.textContent = '全工程完了です。最後に3つの塔すべてから通しプレイし、発表前の最終確認をしてください。';
    if (nextStepLink) {
      nextStepLink.textContent = '完成条件を見る';
      nextStepLink.href = '#finish';
    }
    return;
  }

  const stepNumber = nextIndex + 1;
  if (nextStepLabel) nextStepLabel.textContent = `STEP ${stepNumber}`;
  if (nextStepTitle) nextStepTitle.textContent = steps[nextIndex].title;
  if (nextStepText) nextStepText.textContent = steps[nextIndex].text;
  if (nextStepLink) {
    nextStepLink.textContent = 'この工程を見る';
    nextStepLink.href = `#step-${stepNumber}`;
  }
}

function loadDetailStyles() {
  if (document.querySelector('link[data-roadmap-details]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'roadmap-details.css';
  link.dataset.roadmapDetails = 'true';
  document.head.append(link);
}

function createList(items, ordered = true) {
  const list = document.createElement(ordered ? 'ol' : 'ul');
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.append(li);
  });
  return list;
}

function createImplementationDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'implementation-dialog';
  dialog.setAttribute('aria-labelledby', 'implementationTitle');
  dialog.innerHTML = `
    <div class="implementation-shell">
      <div class="implementation-head">
        <div>
          <p class="implementation-kicker">STEP GUIDE</p>
          <h2 id="implementationTitle"></h2>
        </div>
        <button class="implementation-close" type="button" aria-label="小窓を閉じる">×</button>
      </div>

      <div class="implementation-section">
        <h3>このSTEPで何を実現する？</h3>
        <p id="implementationGoal"></p>
      </div>
      <p class="implementation-summary" id="implementationSummary"></p>
      <div class="implementation-section"><h3>何を使う？</h3><div class="implementation-tags" id="implementationTools"></div></div>
      <div class="implementation-section"><h3>なぜそれを使う？</h3><div id="implementationWhy"></div></div>
      <div class="implementation-section"><h3>主に触るファイル</h3><div class="implementation-files" id="implementationFiles"></div></div>
      <div class="implementation-section"><h3>この順番で作る</h3><div id="implementationTasks"></div></div>
      <div class="implementation-section" id="implementationVisualSection" hidden><h3>見た目を作る順番</h3><div id="implementationVisual"></div></div>
      <div class="implementation-section"><h3>記入例・コード例</h3><pre><code id="implementationCode"></code></pre></div>
      <div class="implementation-section"><h3>ここまでできたら次へ</h3><div id="implementationCheck"></div></div>
      <p class="implementation-note">例は書き始めるための参考です。意味が分からない行をそのまま増やさず、「何のための処理か」を3人で確認してから次へ進みます。</p>
    </div>`;

  document.body.append(dialog);
  dialog.querySelector('.implementation-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  return dialog;
}

function setupImplementationGuides() {
  loadDetailStyles();
  const dialog = createImplementationDialog();
  const title = dialog.querySelector('#implementationTitle');
  const goal = dialog.querySelector('#implementationGoal');
  const summary = dialog.querySelector('#implementationSummary');
  const tools = dialog.querySelector('#implementationTools');
  const why = dialog.querySelector('#implementationWhy');
  const files = dialog.querySelector('#implementationFiles');
  const tasks = dialog.querySelector('#implementationTasks');
  const visualSection = dialog.querySelector('#implementationVisualSection');
  const visual = dialog.querySelector('#implementationVisual');
  const code = dialog.querySelector('#implementationCode');
  const check = dialog.querySelector('#implementationCheck');
  let opener = null;

  dialog.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });

  document.querySelectorAll('.road-step').forEach((roadStep, index) => {
    const guide = implementationGuides[index];
    if (!guide) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'implementation-open';
    button.textContent = index === 8 ? '見た目と階移動の作り方を見る' : '作り方と記入例を見る';
    button.setAttribute('aria-label', `${guide.title}の実装詳細を開く`);

    const stageCheck = roadStep.querySelector('.stage-check');
    roadStep.querySelector('.road-main')?.insertBefore(button, stageCheck);

    button.addEventListener('click', () => {
      opener = button;
      title.textContent = guide.title;
      goal.textContent = guide.goal;
      summary.textContent = guide.summary;

      tools.replaceChildren(...guide.tools.map(item => {
        const span = document.createElement('span');
        span.textContent = item;
        return span;
      }));

      why.replaceChildren(createList(guide.why || []));
      files.replaceChildren(...guide.files.map(item => {
        const file = document.createElement('code');
        file.textContent = item;
        return file;
      }));
      tasks.replaceChildren(createList(guide.tasks || []));

      const visualSteps = guide.visualSteps || [];
      visualSection.hidden = visualSteps.length === 0;
      visual.replaceChildren(createList(visualSteps));

      code.textContent = guide.code;
      check.replaceChildren(createList(guide.check || []));

      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });
}

boxes.forEach(box => box.addEventListener('change', saveState));
resetButton?.addEventListener('click', () => {
  boxes.forEach(box => { box.checked = false; });
  saveState();
});

insertLearningPremise();
setupImplementationGuides();
loadState();
