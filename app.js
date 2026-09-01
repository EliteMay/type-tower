const boxes = [...document.querySelectorAll('.stage-check input[type="checkbox"]')];
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetButton = document.getElementById('resetChecks');
const nextStepLabel = document.getElementById('nextStepLabel');
const nextStepTitle = document.getElementById('nextStepTitle');
const nextStepText = document.getElementById('nextStepText');
const nextStepLink = document.getElementById('nextStepLink');
const storageKey = 'typeTowerRoadmapChecksV3';

const steps = [
  { title: '4画面の箱だけ作る', text: 'HOME / SELECT / GAME / RESULT の4画面を用意し、GAME画面には後で使うHUDの置き場所だけ作る。' },
  { title: '漢字問題を表示する', text: 'まず漢字モードだけ。kanji.jsonから問題を読み込み、GAME画面へ1問ずつ表示する。' },
  { title: 'タイピング判定を完成させる', text: '入力 → Enter → 正解 / MISS → 次の問題、を連続して遊べる状態にする。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で+1F、MISSで-1F、10FでCLEAR。左側の階数表示もここで機能させる。' },
  { title: '最初から最後まで遊べる状態にする', text: 'HOMEからRESULTまで通しで遊べる状態にする。ここまでは新機能より完成を優先。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: 'ゲームの芯を壊さず、TIME・COMBO・難易度を機能として追加する。' },
  { title: '残り2モードを追加する', text: '漢字で完成した仕組みを使って、日本語→英語・英語→日本語を追加する。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間・ハイスコアを表示し、localStorageへ保存する。' },
  { title: '画像案を基準にGAME画面を仕上げる', text: '塔の断面・左右の空・問題の後ろの敵・左の階数・右上TIME・中央問題・下の入力欄を順番に実装する。' },
  { title: '問題追加・テスト・発表準備', text: '問題数を増やし、3人で通しテスト。重大バグを直し、最終日は新機能を追加しない。' }
];

const implementationGuides = [
  {
    title: 'STEP 1：4画面の箱を作る',
    goal: 'STARTを押すとHOMEからSELECT、GAME、RESULTへ画面を切り替えられる状態を作る。',
    summary: 'HTML/CSS/JavaScriptの基礎は授業で触れている前提です。ここでは「なぜsectionを使うか」「どこでJSを使うか」をTYPE TOWERに合わせて説明します。',
    tools: ['HTML section', 'hidden属性', 'JavaScript', 'querySelectorAll()'],
    why: [
      'section：HOME / SELECT / GAME / RESULT を1つのHTML内で分けるため。',
      'hidden：今使っていない画面を簡単に非表示にするため。',
      'JavaScript：ボタンを押したときに、表示するsectionだけ切り替えるため。'
    ],
    files: ['game/index.html', 'game/css/style.css', 'game/js/main.js'],
    tasks: [
      'game/ フォルダを作る。制作ロードマップ本体とは分ける。',
      'index.html に data-screen="home" / select / game / result の4つを作る。',
      '最初はHOMEだけ表示して、残り3つには hidden を付ける。',
      'STARTボタンを押したら showScreen("select") を呼ぶ。',
      'GAMEには floor / timer / question / answer / combo の置き場所だけ作る。完成デザインはまだ作らない。'
    ],
    check: [
      'HOME → SELECTへ移動できる',
      'SELECT → GAMEへ移動できる',
      'GAME → RESULTへ仮で移動できる',
      '戻るボタンで前の画面へ戻れる'
    ],
    code: `<!-- index.html の記入例 -->
<section data-screen="home">
  <h1>TYPE TOWER</h1>
  <button id="startButton">START</button>
</section>

<section data-screen="select" hidden>
  <h2>モード選択</h2>
</section>

<script>
function showScreen(name) {
  document.querySelectorAll('[data-screen]').forEach(screen => {
    screen.hidden = screen.dataset.screen !== name;
  });
}

document.getElementById('startButton').addEventListener('click', () => {
  showScreen('select');
});
</script>`
  },
  {
    title: 'STEP 2：漢字問題を表示する',
    goal: 'kanji.jsonの問題をJavaScriptで読み込み、GAME画面にランダムで1問表示する。',
    summary: '問題をHTMLへ直接大量に書かず、JSONへ分けます。問題追加を分担しやすくするためにも、この形が扱いやすいです。',
    tools: ['JSON', 'fetch()', 'await', 'Math.random()', 'textContent'],
    why: [
      'JSON：問題データとゲーム処理を分けるため。',
      'fetch()：別ファイルのkanji.jsonを読み込むため。',
      'Math.random()：問題を毎回ランダムに選ぶため。',
      'textContent：選んだ問題を画面へ表示するため。'
    ],
    files: ['game/data/kanji.json', 'game/js/game.js', 'game/index.html'],
    tasks: [
      'kanji.jsonを作り、最初は10問だけ入れる。',
      'question / answer / difficulty の3項目を持たせる。',
      'game.jsでfetch()して配列をquestionsへ保存する。',
      'Math.random()で1問選びcurrentQuestionへ入れる。',
      '問題表示用要素のtextContentを書き換える。'
    ],
    check: [
      'JSONの構文エラーがない',
      'GAME画面に漢字が表示される',
      '何度か実行すると別の問題も出る',
      '問題と答えがセットでcurrentQuestionに入っている'
    ],
    code: `// kanji.json の記入例
[
  { "question": "躊躇", "answer": "ちゅうちょ", "difficulty": "normal" },
  { "question": "憂鬱", "answer": "ゆううつ", "difficulty": "normal" },
  { "question": "彷徨", "answer": "ほうこう", "difficulty": "hard" }
]

// game.js の記入例
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
    summary: 'ここがゲームの中心です。if文そのものの説明ではなく、「TYPE TOWERのどこでif文を使うか」を理解できる形にします。',
    tools: ['form', 'input', 'submit event', 'preventDefault()', 'if'],
    why: [
      'form：Enterキーで回答しやすくするため。',
      'submitイベント：回答した瞬間だけ判定するため。',
      'preventDefault()：Enterでページが再読み込みされるのを防ぐため。',
      'if：入力値と正解データが同じか分けるため。'
    ],
    files: ['game/index.html', 'game/js/game.js'],
    tasks: [
      'GAME画面にformとinputを置く。',
      'submitされたらinput.valueを取得する。',
      'trim()で前後の余計な空白を消す。',
      'currentQuestion.answerと比較する。',
      '正解ならhandleCorrect()、違えばhandleMiss()を呼ぶ。',
      '判定後は入力欄を空にして次の問題へ進む。'
    ],
    check: [
      '正しい読みを入れると正解になる',
      '違う答えだとMISSになる',
      'Enterを押してもページが再読み込みされない',
      '回答後に入力欄が空になる'
    ],
    code: `<!-- index.html -->
<form id="answerForm">
  <input id="answerInput" autocomplete="off" placeholder="読みを入力">
</form>

// game.js
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');

answerForm.addEventListener('submit', event => {
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
    summary: 'ゲームの状態をfloorという変数で持ちます。左の1F〜10F表示もこの段階で機能だけ作り、装飾は後で行います。',
    tools: ['JavaScript変数', 'Math.max()', 'data属性', 'classList.toggle()'],
    why: [
      'floor変数：今いる階を1か所で管理するため。',
      'Math.max()：MISSしても1F未満にならないようにするため。',
      'data-floor：左の各階とfloor変数を対応させるため。',
      'classList.toggle()：現在階だけ見た目を変えるため。'
    ],
    files: ['game/index.html', 'game/js/game.js'],
    tasks: [
      'floorを1で初期化する。',
      '正解時にfloor += 1する。',
      'MISS時にfloor = Math.max(1, floor - 1)にする。',
      '中央の「7F」のような表示をfloorに合わせて更新する。',
      '左の1F〜10Fのうち現在階だけis-currentを付ける。',
      'floor >= 10ならfinishGame()を呼ぶ。'
    ],
    check: [
      '正解で1F上がる',
      'MISSで1F下がる',
      '1FでMISSしても0Fにならない',
      '10Fへ着いたらRESULTへ進む'
    ],
    code: `let floor = 1;

function handleCorrect() {
  floor += 1;
  updateFloorUI();

  if (floor >= 10) {
    finishGame();
  }
}

function handleMiss() {
  floor = Math.max(1, floor - 1);
  updateFloorUI();
}

function updateFloorUI() {
  document.getElementById('floorText').textContent = floor + 'F';

  document.querySelectorAll('[data-floor]').forEach(item => {
    const isCurrent = Number(item.dataset.floor) === floor;
    item.classList.toggle('is-current', isCurrent);
  });
}`
  },
  {
    title: 'STEP 5：最初から最後まで遊べる状態にする',
    goal: 'HOMEからゲーム開始、10F到達、RESULT表示、もう一度遊ぶまでを一本につなぐ。',
    summary: 'この段階で見た目が簡素でも「一応完成したゲーム」にします。ここが通れば、その後の機能追加で壊れても戻る基準ができます。',
    tools: ['startGame()', 'finishGame()', '状態初期化', '画面切替'],
    why: [
      'startGame()：ゲーム開始時に必要な初期化を1か所へまとめるため。',
      'finishGame()：ゲーム終了処理を1か所へまとめるため。',
      '状態初期化：再挑戦したとき前回のfloorやスコアが残らないようにするため。'
    ],
    files: ['game/js/main.js', 'game/js/game.js', 'game/index.html'],
    tasks: [
      'correctCountとmissCountを追加する。',
      'startGame()でfloor・正解数・MISS数を初期化する。',
      'finishGame()でRESULTへ移動する。',
      'RESULTに正解数とMISS数を表示する。',
      'もう一度遊ぶボタンからstartGame()を呼ぶ。'
    ],
    check: [
      'HOME → GAME → CLEAR → RESULTまで通る',
      'RESULTに今回の数字が表示される',
      'もう一度遊ぶとfloorが1Fへ戻る',
      '3人全員が1ゲーム通して遊べる'
    ],
    code: `let correctCount = 0;
let missCount = 0;

function startGame() {
  floor = 1;
  correctCount = 0;
  missCount = 0;
  showScreen('game');
  showNextQuestion();
}

function finishGame() {
  document.getElementById('resultCorrect').textContent = correctCount;
  document.getElementById('resultMiss').textContent = missCount;
  showScreen('result');
}`
  },
  {
    title: 'STEP 6：タイマー・コンボ・難易度を追加する',
    goal: '1問ごとの制限時間、連続正解COMBO、EASY/NORMAL/HARDを追加する。',
    summary: '3機能を一度に書かず、COMBO → TIME → 難易度の順で1個ずつ確認すると詰まりにくいです。',
    tools: ['setInterval()', 'clearInterval()', 'filter()', 'JavaScript変数'],
    why: [
      'combo：連続正解のゲーム性を作るため。',
      'setInterval()：1秒ごとに残り時間を減らすため。',
      'clearInterval()：前の問題のタイマーが残るバグを防ぐため。',
      'filter()：選択された難易度の問題だけに絞るため。'
    ],
    files: ['game/js/game.js', 'game/data/kanji.json', 'game/index.html'],
    tasks: [
      'comboとmaxComboを作る。',
      '正解でcombo+1、MISSでcombo=0にする。',
      'timeLeftとtimerIdを用意する。',
      '問題を出すたびに前タイマーをclearInterval()してから開始する。',
      '時間0でMISS処理を呼ぶ。',
      'selectedDifficultyでquestionsをfilter()する。'
    ],
    check: [
      '2問連続正解でCOMBOが2になる',
      'MISSでCOMBOが0へ戻る',
      'TIMEが1秒ずつ減る',
      '時間切れでMISSになる',
      '難易度変更で出題内容が変わる'
    ],
    code: `let combo = 0;
let maxCombo = 0;
let timeLeft = 10;
let timerId = null;

function startQuestionTimer() {
  clearInterval(timerId);
  timeLeft = 10;
  updateTimerUI();

  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleMiss();
      showNextQuestion();
    }
  }, 1000);
}

const filteredQuestions = questions.filter(question => {
  return question.difficulty === selectedDifficulty;
});`
  },
  {
    title: 'STEP 7：残り2モードを追加する',
    goal: '漢字 / 日本語→英語 / 英語→日本語の3モードを、同じゲーム処理で遊べるようにする。',
    summary: 'game.jsを3個作るのではなく、読み込むJSONだけ変えます。これが一番修正しやすい形です。',
    tools: ['JSON', 'オブジェクト', 'selectedMode', '共通関数'],
    why: [
      'selectedMode：今どのモードを選んだか覚えるため。',
      'dataFiles：モード名とJSONファイルを対応させるため。',
      '共通game.js：同じバグ修正を3回する状態を避けるため。'
    ],
    files: ['game/data/kanji.json', 'game/data/ja-en.json', 'game/data/en-ja.json', 'game/js/game.js'],
    tasks: [
      'ja-en.jsonとen-ja.jsonを作る。',
      'SELECT画面でselectedModeを決める。',
      'selectedModeに応じて読み込むJSONを変える。',
      'タイマー・階数・判定・COMBOは共通処理を使う。',
      'モード変更時はquestionsを読み直す。'
    ],
    check: [
      '3モードを選べる',
      '漢字モードに英語問題が混ざらない',
      'モードを変えても階数やタイマーが動く',
      'ゲーム処理がモードごとにコピペされていない'
    ],
    code: `const dataFiles = {
  kanji: './data/kanji.json',
  jaEn: './data/ja-en.json',
  enJa: './data/en-ja.json'
};

async function loadModeQuestions() {
  const file = dataFiles[selectedMode];
  const response = await fetch(file);
  questions = await response.json();
}`
  },
  {
    title: 'STEP 8：RESULTと記録保存を完成させる',
    goal: '正解数・MISS数・正答率・最大COMBO・クリア時間を表示し、ベスト記録を保存する。',
    summary: 'RESULT表示と保存を分けて考えます。まず画面表示を完成させ、その後localStorageへ保存します。',
    tools: ['localStorage', 'JSON.stringify()', 'JSON.parse()', 'try/catch'],
    why: [
      'localStorage：サーバーなしでブラウザへ記録を残すため。',
      'JSON.stringify()：オブジェクトを保存できる文字列へ変えるため。',
      'try/catch：保存に失敗してもゲーム本体を止めないため。'
    ],
    files: ['game/js/storage.js', 'game/js/game.js', 'game/index.html'],
    tasks: [
      'RESULTへ正解数・MISS数・正答率・最大COMBO・クリア時間を表示する。',
      'recordsオブジェクトを作る。',
      'storage.jsへ保存処理を分ける。',
      '保存と読み込みをtry/catchで囲む。',
      '保存データが壊れていてもゲームは起動できるようにする。'
    ],
    check: [
      'RESULTの数値が実際のプレイと合う',
      'リロード後もベスト記録が残る',
      '保存に失敗してもゲームを続けられる'
    ],
    code: `const records = {
  bestTime: 42.8,
  maxCombo: 12,
  bestAccuracy: 93
};

try {
  localStorage.setItem('typeTowerRecords', JSON.stringify(records));
} catch (error) {
  console.warn('記録を保存できませんでした', error);
}

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem('typeTowerRecords')) || {};
  } catch {
    return {};
  }
}`
  },
  {
    title: 'STEP 9：画像案を基準にGAME画面を仕上げる',
    goal: '機能完成後に、参考画像の「塔の断面で戦うタイピングゲーム」という見た目へ仕上げる。',
    summary: '見た目は画像をそのまま貼るのではなく、HTML/CSSで構造を作り、背景・敵など必要な部分だけ素材を使います。',
    tools: ['CSS Grid', 'position', 'z-index', 'CSS variables', '@keyframes', '画像素材'],
    why: [
      'CSS Grid：左の階数 / 中央ステージ / 右TIMEの大きな配置を作るため。',
      'position / z-index：敵を問題カードの後ろへ置くため。',
      'CSS variables：濃紺・金・石材色などをまとめて管理するため。',
      '@keyframes：正解・MISS・敵ヒットの短い演出を付けるため。'
    ],
    files: ['game/index.html', 'game/css/style.css', 'game/js/effects.js', 'game/assets/images/', 'game/assets/sounds/'],
    tasks: [
      '色なしで左階数 / 中央 / TIME / 問題 / 入力の配置を決める。',
      '中央を石造りの塔内部、左右を青空にする。',
      '問題カードの後ろへ敵を置く。漢字は絶対に隠さない。',
      '左の現在階、右上TIME、下のCOMBOを整える。',
      '青空 / 石材ベージュ / 濃紺 / 金で配色する。',
      '最後に短い正解・MISS・敵ヒット演出を追加する。'
    ],
    check: [
      '問題と入力欄が一番読みやすい',
      '敵が漢字を隠していない',
      '現在階とTIMEがすぐ見つかる',
      '画面幅を狭めても入力欄が切れない'
    ],
    visualSteps: [
      '① 白黒の箱で配置を決める',
      '② 塔の断面背景を作る',
      '③ 左右へ空を見せる',
      '④ 問題カードの後ろへ敵を置く',
      '⑤ 階数 / TIME / COMBOを整える',
      '⑥ 色を入れる',
      '⑦ 正解 / MISS / 敵ヒット演出を入れる',
      '⑧ PC画面で最終確認する'
    ],
    code: `:root {
  --navy: #123a70;
  --gold: #d3a84e;
  --stone: #e7dcc9;
}

.game-stage {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) 120px;
  position: relative;
}

.enemy-layer {
  position: absolute;
  inset: 16% 20% auto;
  z-index: 1;
}

.question-card,
.answer-form {
  position: relative;
  z-index: 2;
}`
  },
  {
    title: 'STEP 10：問題追加・テスト・発表準備',
    goal: '新機能を増やさず、問題数と安定性を上げて発表できる状態にする。',
    summary: '最後は「何か足す」より「壊れていないか」を優先します。問題追加やテストは3人で分担しやすい部分です。',
    tools: ['JSON', 'ブラウザDevTools', 'GitHub Pull Request', '手動テスト'],
    why: [
      '問題追加：ゲームの繰り返し遊べる量を増やすため。',
      '手動テスト：授業内の短期間開発では実際の操作確認が重要なため。',
      'Pull Request：最後の修正でmainを壊しにくくするため。'
    ],
    files: ['game/data/*.json', 'TEST.md', 'README.md'],
    tasks: [
      '問題を増やして重複・誤字・答え違いを確認する。',
      '3人が別々に1ゲームずつ通しプレイする。',
      '開始 / 正解 / MISS / 時間切れ / 10F / 再挑戦 / 3モードを確認する。',
      '重大バグだけ優先して直す。',
      '動画撮影へ入ったら新機能は原則追加しない。'
    ],
    check: [
      '進行不能バグがない',
      '3モードを最後まで遊べる',
      '問題文や答えの誤字がない',
      '動画撮影用の安定したデモ手順がある'
    ],
    code: `TEST.md の記入例

- [ ] START → GAMEへ進める
- [ ] 正解で +1F
- [ ] MISSで -1F（1F未満にならない）
- [ ] 時間切れでMISS
- [ ] 10FでRESULT
- [ ] もう一度遊べる
- [ ] 3モードすべて出題できる
- [ ] 敵が問題文を隠さない
- [ ] 入力欄が画面外へ切れない`
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
    </div>
    <div class="core-rule">
      <strong>参考例の使い方</strong>
      <p>例は「何を書けばいいか分からない」を減らすための参考です。先生・授業のルールでAI利用が禁止されている場面では、そのルールを守り、内容を理解したうえで自分たちのコードとして組み立てます。</p>
    </div>`;

  const teamPolicy = document.getElementById('team-policy');
  if (teamPolicy) teamPolicy.insertAdjacentElement('afterend', section);
  else document.querySelector('main')?.prepend(section);
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
    // 保存に失敗してもチェック操作は継続できる。
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
    if (nextStepText) nextStepText.textContent = '全工程完了です。最後に3人で通しプレイし、発表前の最終確認をしてください。';
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

      <div class="implementation-section">
        <h3>何を使う？</h3>
        <div class="implementation-tags" id="implementationTools"></div>
      </div>

      <div class="implementation-section">
        <h3>なぜそれを使う？</h3>
        <div id="implementationWhy"></div>
      </div>

      <div class="implementation-section">
        <h3>主に触るファイル</h3>
        <div class="implementation-files" id="implementationFiles"></div>
      </div>

      <div class="implementation-section">
        <h3>この順番で作る</h3>
        <div id="implementationTasks"></div>
      </div>

      <div class="implementation-section" id="implementationVisualSection" hidden>
        <h3>完成イメージへ近づける順番</h3>
        <div id="implementationVisual"></div>
      </div>

      <div class="implementation-section">
        <h3>記入例・コード例</h3>
        <pre><code id="implementationCode"></code></pre>
      </div>

      <div class="implementation-section">
        <h3>ここまでできたら次へ</h3>
        <div id="implementationCheck"></div>
      </div>

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
    button.textContent = index === 8 ? '画像案からの作り方を見る' : '作り方と記入例を見る';
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