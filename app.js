const boxes = [...document.querySelectorAll('.stage-check input[type="checkbox"]')];
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetButton = document.getElementById('resetChecks');
const nextStepLabel = document.getElementById('nextStepLabel');
const nextStepTitle = document.getElementById('nextStepTitle');
const nextStepText = document.getElementById('nextStepText');
const nextStepLink = document.getElementById('nextStepLink');
const storageKey = 'typeTowerRoadmapChecksV2';

const steps = [
  { title: '4画面の箱だけ作る', text: 'HOME / SELECT / GAME / RESULT の4画面を、見た目を作り込まずに用意する。' },
  { title: '漢字問題を表示する', text: 'まず漢字モードだけ。kanji.jsonから問題を読み込み、GAME画面へ1問ずつ表示する。' },
  { title: 'タイピング判定を完成させる', text: '入力 → Enter → 正解 / MISS → 次の問題、を連続して遊べる状態にする。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で+1F、MISSで-1F、10FでCLEAR。このゲーム独自のルールをここで完成させる。' },
  { title: '最初から最後まで遊べる状態にする', text: 'HOMEからRESULTまで通しで遊べる状態にする。ここまでは新機能より完成を優先。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: 'ゲームの芯を壊さず、時間制限・コンボ・3段階難易度を追加する。' },
  { title: '残り2モードを追加する', text: '漢字で完成した仕組みを使って、日本語→英語・英語→日本語を追加する。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間・ハイスコアを表示し、localStorageへ保存する。' },
  { title: '見た目と演出を本格的に仕上げる', text: 'タワー、正解/MISS演出、アニメーション、効果音、レスポンシブを整える。' },
  { title: '問題追加・テスト・発表準備', text: '問題数を増やし、3人で通しテスト。重大バグを直し、14日目は新機能を追加しない。' }
];

const implementationGuides = [
  {
    title: 'STEP 1：4画面の箱を作る',
    summary: '最初は1つのHTMLの中に4画面を置き、JavaScriptで表示する画面だけ切り替えます。ページを4個に分けるより、初心者でも状態管理が分かりやすくなります。',
    tools: ['HTML', 'CSS', 'JavaScript'],
    files: ['game/index.html', 'game/css/style.css', 'game/js/main.js'],
    tasks: [
      'game/ フォルダを作り、その中をゲーム本体専用にする。制作ガイドのファイルと混ぜない。',
      'index.html に HOME / SELECT / GAME / RESULT の4つの section を作る。',
      '最初はHOMEだけ表示し、それ以外には hidden を付ける。',
      'main.js に showScreen(name) を作り、STARTや戻るボタンで表示画面を切り替える。',
      'CSSは文字・余白・ボタン程度だけ。ここではデザインを作り込まない。'
    ],
    code: "function showScreen(name) {\n  document.querySelectorAll('[data-screen]').forEach(screen => {\n    screen.hidden = screen.dataset.screen !== name;\n  });\n}"
  },
  {
    title: 'STEP 2：漢字問題を表示する',
    summary: '問題はHTMLへ直接大量に書かず、JSONへ分離します。JavaScriptの fetch() で読み込み、配列から1問選んでGAME画面へ表示します。',
    tools: ['JSON', 'JavaScript', 'fetch()', 'GitHub Pages'],
    files: ['game/data/kanji.json', 'game/js/game.js', 'game/index.html'],
    tasks: [
      'kanji.json に question / answer / difficulty を持つ問題をまず10問だけ作る。',
      'game.js から fetch(\'./data/kanji.json\') で読み込む。',
      '読み込んだ配列を questions に保存し、Math.random() で1問選ぶ。',
      '選んだ問題を currentQuestion に保存し、問題表示用要素の textContent を更新する。',
      'JSONの fetch は file:// 直開きだと失敗する場合があるので、動作確認はGitHub Pages上を基本にする。'
    ],
    code: "const response = await fetch('./data/kanji.json');\nconst questions = await response.json();\ncurrentQuestion = questions[Math.floor(Math.random() * questions.length)];"
  },
  {
    title: 'STEP 3：タイピング判定を作る',
    summary: '入力欄をformに入れ、Enterでsubmitされたときだけ判定します。正解なら正解処理、違えばMISS処理へ分けます。',
    tools: ['HTML form', 'JavaScript', 'submit event'],
    files: ['game/index.html', 'game/js/game.js'],
    tasks: [
      'GAME画面に form と input を1つ置く。',
      'form の submit イベントで preventDefault() し、ページ再読み込みを防ぐ。',
      'input.value.trim() と currentQuestion.answer を比較する。',
      '正解なら handleCorrect()、不正解なら handleMiss() を呼ぶ。',
      '判定後は入力欄を空にし、次の問題を表示してすぐ入力へfocusを戻す。'
    ],
    code: "answerForm.addEventListener('submit', event => {\n  event.preventDefault();\n  const answer = answerInput.value.trim();\n  if (answer === currentQuestion.answer) handleCorrect();\n  else handleMiss();\n});"
  },
  {
    title: 'STEP 4：タワーの上下とクリアをつなぐ',
    summary: 'ゲームの状態は変数で持ちます。まず floor だけ追加し、正解・MISS処理から値を変更して画面表示へ反映します。',
    tools: ['JavaScript state', 'Math.max()', 'DOM更新'],
    files: ['game/js/game.js', 'game/index.html'],
    tasks: [
      'floor を1で初期化する。',
      'handleCorrect() で floor += 1、handleMiss() で floor = Math.max(1, floor - 1) とする。',
      'updateHUD() を作り、現在階を画面へ表示する。',
      'floor >= 10 になったらゲームを止めてRESULTへ進む。',
      '階数変更・画面表示・クリア判定を別々の場所へ重複して書かない。'
    ],
    code: "function handleMiss() {\n  floor = Math.max(1, floor - 1);\n  updateHUD();\n}\n\nif (floor >= 10) finishGame();"
  },
  {
    title: 'STEP 5：最初から最後まで遊べる状態にする',
    summary: 'ここで一度「完成したゲーム」にします。スコアを簡単に数え、開始・プレイ・クリア・リザルト・再挑戦まで一本につなぎます。',
    tools: ['JavaScript state', '画面切替', 'リセット処理'],
    files: ['game/js/main.js', 'game/js/game.js', 'game/index.html'],
    tasks: [
      'correctCount と missCount を追加する。',
      'startGame() で floor・正解数・MISS数を初期化してGAMEへ移動する。',
      'finishGame() でRESULTへ移動し、今回の結果を表示する。',
      '「もう一度遊ぶ」で startGame() をもう一度呼べるようにする。',
      '3人全員でHOMEからRESULTまで通しプレイする。ここが動くまでSTEP 6へ進まない。'
    ],
    code: "function startGame() {\n  floor = 1;\n  correctCount = 0;\n  missCount = 0;\n  showScreen('game');\n  showNextQuestion();\n}"
  },
  {
    title: 'STEP 6：タイマー・コンボ・難易度を追加する',
    summary: '完成したゲームループへ3機能を足します。特にタイマーは重複起動するとバグになりやすいので、次の問題へ行く前に必ず前のタイマーを止めます。',
    tools: ['setInterval()', 'clearInterval()', 'JavaScript state', 'JSON difficulty'],
    files: ['game/js/game.js', 'game/data/kanji.json', 'game/index.html'],
    tasks: [
      'combo と maxCombo を追加し、正解で+1、MISSで0に戻す。',
      'timeLeft と timerId を持ち、1問ごとにタイマーを開始する。',
      '次の問題を出す前に clearInterval(timerId) を必ず呼ぶ。',
      '時間が0になったら handleMiss() を呼び、次の問題へ進む。',
      'JSONの difficulty を easy / normal / hard にし、選択された難易度だけ filter() する。'
    ],
    code: "function startQuestionTimer() {\n  clearInterval(timerId);\n  timeLeft = 10;\n  timerId = setInterval(() => {\n    timeLeft -= 1;\n    if (timeLeft <= 0) handleTimeout();\n  }, 1000);\n}"
  },
  {
    title: 'STEP 7：残り2モードを追加する',
    summary: 'ゲーム処理をもう2個コピーするのではなく、問題データだけ交換して同じgame.jsを使います。これで修正箇所が1つになります。',
    tools: ['JSON', 'JavaScript', '共通ゲームループ'],
    files: ['game/data/kanji.json', 'game/data/ja-en.json', 'game/data/en-ja.json', 'game/js/game.js'],
    tasks: [
      '日本語→英語用 ja-en.json と、英語→日本語用 en-ja.json を作る。',
      'SELECT画面で selectedMode を保存する。',
      'selectedMode に応じて読み込むJSONファイルだけ変える。',
      '判定・階数・タイマー・コンボ処理は3モード共通のgame.jsを使う。',
      'モードを切り替えたとき前のquestions配列を使い続けないことを確認する。'
    ],
    code: "const dataFiles = {\n  kanji: './data/kanji.json',\n  jaEn: './data/ja-en.json',\n  enJa: './data/en-ja.json'\n};"
  },
  {
    title: 'STEP 8：RESULTと記録保存を完成させる',
    summary: '今回のプレイ結果はJavaScriptの変数から計算し、ベスト記録だけlocalStorageへ保存します。保存できなくてもゲーム自体は止めません。',
    tools: ['localStorage', 'JSON.stringify()', 'JSON.parse()'],
    files: ['game/js/storage.js', 'game/js/game.js', 'game/index.html'],
    tasks: [
      '正解数・MISS数・正答率・最大コンボ・クリア時間をRESULTへ表示する。',
      '記録保存処理を storage.js に分ける。',
      'localStorageには1つのオブジェクトをJSON文字列にして保存する。',
      '保存読込は try/catch で囲み、壊れたデータや保存失敗でもゲームは続けられるようにする。',
      '難易度やモード別にベストを持たせる場合も、保存キーをむやみに増やしすぎない。'
    ],
    code: "try {\n  localStorage.setItem('typeTowerRecords', JSON.stringify(records));\n} catch (error) {\n  console.warn('記録を保存できませんでした');\n}"
  },
  {
    title: 'STEP 9：見た目と演出を仕上げる',
    summary: '機能が完成してからCSSと演出を整えます。正解・MISS・現在階が一瞬で分かり、演出中も入力を邪魔しないことを優先します。',
    tools: ['CSS', '@keyframes', 'CSS variables', 'Audio'],
    files: ['game/css/style.css', 'game/js/effects.js', 'game/assets/sounds/'],
    tasks: [
      'まずGAME画面の問題・入力欄・階数・タイマーの優先順位を整える。',
      '正解とMISSは色だけに頼らず、文字と短いアニメーションでも伝える。',
      'CSS @keyframes で短い上昇・落下・フィードバック演出を作る。',
      '効果音は必要なら Audio を使い、鳴らなくてもゲーム進行は止めない。',
      'prefers-reduced-motion では大きなアニメーションを減らす。PCと狭い画面の両方を確認する。'
    ],
    code: "@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n  }\n}"
  },
  {
    title: 'STEP 10：問題追加・テスト・発表準備',
    summary: '最後は新機能を増やす期間ではありません。問題データを増やし、壊れる操作を3人で探し、発表できる安定版へします。',
    tools: ['GitHub Pull Request', 'ブラウザDevTools', 'JSON', '手動テスト'],
    files: ['game/data/*.json', 'TEST.md', 'README.md'],
    tasks: [
      '問題を合計100〜150問程度まで増やし、重複・誤字・答え違いを確認する。',
      'TEST.md に「開始・正解・MISS・時間切れ・10F・再挑戦・3モード・リロード」を並べて確認する。',
      '3人が別々に通しプレイし、見つけたバグを小さく直す。',
      '修正はPull Requestで差分を確認してからmainへMergeする。',
      '14日目は新機能を追加せず、発表内容・操作手順・デモ用ルートを確認する。'
    ],
    code: "最低テスト例\n- START → GAMEへ進める\n- 正解で +1F\n- MISSで -1F（1F未満にならない）\n- 時間切れでMISS\n- 10FでRESULT\n- もう一度遊べる"
  }
];

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
  const percent = Math.round((done / boxes.length) * 100);
  progressText.textContent = `${percent}% (${done}/${boxes.length})`;
  progressBar.style.width = `${percent}%`;

  document.querySelectorAll('.road-step').forEach((step, index) => {
    step.classList.toggle('done', Boolean(boxes[index]?.checked));
  });

  const nextIndex = boxes.findIndex(box => !box.checked);
  if (nextIndex === -1) {
    nextStepLabel.textContent = 'ALL COMPLETE';
    nextStepTitle.textContent = 'ロードマップ完了';
    nextStepText.textContent = '全工程完了です。最後に3人で通しプレイし、発表前の最終確認をしてください。';
    nextStepLink.textContent = '完成条件を見る';
    nextStepLink.href = '#finish';
    return;
  }

  const stepNumber = nextIndex + 1;
  nextStepLabel.textContent = `STEP ${stepNumber}`;
  nextStepTitle.textContent = steps[nextIndex].title;
  nextStepText.textContent = steps[nextIndex].text;
  nextStepLink.textContent = 'この工程を見る';
  nextStepLink.href = `#step-${stepNumber}`;
}

function loadDetailStyles() {
  if (document.querySelector('link[data-roadmap-details]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'roadmap-details.css';
  link.dataset.roadmapDetails = 'true';
  document.head.append(link);
}

function createImplementationDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'implementation-dialog';
  dialog.setAttribute('aria-labelledby', 'implementationTitle');
  dialog.innerHTML = `
    <div class="implementation-shell">
      <div class="implementation-head">
        <div>
          <p class="implementation-kicker">実装のしかた</p>
          <h2 id="implementationTitle"></h2>
        </div>
        <button class="implementation-close" type="button" aria-label="小窓を閉じる">×</button>
      </div>
      <p class="implementation-summary" id="implementationSummary"></p>
      <div class="implementation-section">
        <h3>何を使う？</h3>
        <div class="implementation-tags" id="implementationTools"></div>
      </div>
      <div class="implementation-section">
        <h3>主に触るファイル</h3>
        <div class="implementation-files" id="implementationFiles"></div>
      </div>
      <div class="implementation-section">
        <h3>この順番で作る</h3>
        <ol id="implementationTasks"></ol>
      </div>
      <div class="implementation-section">
        <h3>コードの形</h3>
        <pre><code id="implementationCode"></code></pre>
      </div>
      <p class="implementation-note">このコードは完成版を丸ごとコピーするためではなく、「何を使って作るか」を理解するための最小例です。</p>
    </div>`;

  document.body.append(dialog);

  const closeButton = dialog.querySelector('.implementation-close');
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function setupImplementationGuides() {
  loadDetailStyles();
  const dialog = createImplementationDialog();
  const title = dialog.querySelector('#implementationTitle');
  const summary = dialog.querySelector('#implementationSummary');
  const tools = dialog.querySelector('#implementationTools');
  const files = dialog.querySelector('#implementationFiles');
  const tasks = dialog.querySelector('#implementationTasks');
  const code = dialog.querySelector('#implementationCode');
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
    button.textContent = '実装のしかたを見る';
    button.setAttribute('aria-label', `${guide.title}の実装詳細を開く`);

    const stageCheck = roadStep.querySelector('.stage-check');
    roadStep.querySelector('.road-main').insertBefore(button, stageCheck);

    button.addEventListener('click', () => {
      opener = button;
      title.textContent = guide.title;
      summary.textContent = guide.summary;
      tools.replaceChildren(...guide.tools.map(item => {
        const span = document.createElement('span');
        span.textContent = item;
        return span;
      }));
      files.replaceChildren(...guide.files.map(item => {
        const file = document.createElement('code');
        file.textContent = item;
        return file;
      }));
      tasks.replaceChildren(...guide.tasks.map(item => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      }));
      code.textContent = guide.code;

      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });
}

boxes.forEach(box => box.addEventListener('change', saveState));
resetButton.addEventListener('click', () => {
  boxes.forEach(box => { box.checked = false; });
  saveState();
});

setupImplementationGuides();
loadState();
