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
  { title: '4画面の箱だけ作る', text: 'HOME / SELECT / GAME / RESULT の4画面を用意し、GAME画面には後で使うHUDの置き場所だけ作る。' },
  { title: '漢字問題を表示する', text: 'まず漢字モードだけ。kanji.jsonから問題を読み込み、GAME画面へ1問ずつ表示する。' },
  { title: 'タイピング判定を完成させる', text: '入力 → Enter → 正解 / MISS → 次の問題、を連続して遊べる状態にする。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で+1F、MISSで-1F、10FでCLEAR。左側の階数表示もここで機能させる。' },
  { title: '最初から最後まで遊べる状態にする', text: 'HOMEからRESULTまで通しで遊べる状態にする。ここまでは新機能より完成を優先。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: 'ゲームの芯を壊さず、画像案にあるTIME・COMBO・難易度を機能として追加する。' },
  { title: '残り2モードを追加する', text: '漢字で完成した仕組みを使って、日本語→英語・英語→日本語を追加する。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間・ハイスコアを表示し、localStorageへ保存する。' },
  { title: '画像案を基準にGAME画面を仕上げる', text: '塔の断面・左右の空・問題の後ろの敵・左の階数・右上TIME・中央問題・下の入力欄を順番に実装する。' },
  { title: '問題追加・テスト・発表準備', text: '問題数を増やし、3人で通しテスト。重大バグを直し、14日目は新機能を追加しない。' }
];

const implementationGuides = [
  {
    title: 'STEP 1：4画面の箱を作る',
    summary: '最初は1つのHTMLの中に4画面を置き、JavaScriptで表示する画面だけ切り替えます。GAME画面は完成デザインを作らず、後で画像案のUIを置ける骨組みだけ準備します。',
    tools: ['HTML', 'CSS', 'JavaScript'],
    files: ['game/index.html', 'game/css/style.css', 'game/js/main.js'],
    tasks: [
      'game/ フォルダを作り、その中をゲーム本体専用にする。制作ガイドのファイルと混ぜない。',
      'index.html に HOME / SELECT / GAME / RESULT の4つの section を作る。',
      '最初はHOMEだけ表示し、それ以外には hidden を付ける。',
      'GAMEには floor / timer / enemy / question / answer / combo の置き場所だけ作る。中身と装飾はまだ最低限でよい。',
      'main.js に showScreen(name) を作り、STARTや戻るボタンで表示画面を切り替える。',
      'CSSは文字・余白・ボタン程度だけ。塔や空などの完成背景はSTEP 9まで作り込まない。'
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
    summary: 'ゲームの状態は変数で持ちます。画像案の左側にある1F〜10F表示もこの段階で機能だけ完成させ、見た目は後で整えます。',
    tools: ['JavaScript state', 'Math.max()', 'DOM更新', 'data属性'],
    files: ['game/js/game.js', 'game/index.html'],
    tasks: [
      'floor を1で初期化する。',
      '左側に1F〜10Fの階数リストをHTMLで用意する。',
      'handleCorrect() で floor += 1、handleMiss() で floor = Math.max(1, floor - 1) とする。',
      'updateHUD() で中央の現在階と、左側の現在階ハイライトを同時に更新する。',
      'floor >= 10 になったらゲームを止めてRESULTへ進む。',
      '階数変更・画面表示・クリア判定を別々の場所へ重複して書かない。'
    ],
    code: "function updateFloorUI() {\n  floorText.textContent = `${floor}F`;\n  document.querySelectorAll('[data-floor]').forEach(item => {\n    item.classList.toggle('is-current', Number(item.dataset.floor) === floor);\n  });\n}"
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
    summary: '完成したゲームループへ3機能を足します。画像案ではTIMEは右上、COMBOは入力欄の下にあります。この段階で機能と表示だけ作り、色や装飾はSTEP 9で合わせます。',
    tools: ['setInterval()', 'clearInterval()', 'JavaScript state', 'JSON difficulty'],
    files: ['game/js/game.js', 'game/data/kanji.json', 'game/index.html'],
    tasks: [
      'combo と maxCombo を追加し、正解で+1、MISSで0に戻す。',
      'timeLeft と timerId を持ち、1問ごとにタイマーを開始する。',
      'TIME表示はGAME画面右上、COMBO表示は入力欄の下に置く。まず配置だけ合わせる。',
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
    title: 'STEP 9：画像案を基準にGAME画面を仕上げる',
    summary: '今回作ったカラー案を「完成イメージの方向」として使います。完全コピーではなく、塔を断面的に見た中央ステージ、左右の空、問題カードの後ろにいる敵、左の階数、右上TIME、中央の問題、下の入力欄という構造を基準に実装します。',
    tools: ['HTML/CSS', 'CSS Grid', 'position / z-index', 'CSS variables', '@keyframes', '画像素材', 'Audio'],
    files: ['game/index.html', 'game/css/style.css', 'game/js/effects.js', 'game/assets/images/tower/', 'game/assets/images/enemies/', 'game/assets/sounds/'],
    tasks: [
      '最初に色なしでGAME画面の配置を決める。左=階数、中央=ステージ、右上=TIME、中央下=問題→入力→COMBOの順に置く。',
      '中央ステージの背景を「塔の断面」にする。中央は石造りの塔内部、左右の外側は青空が見える構造にする。',
      '敵用レイヤーを問題カードより後ろに置く。頭・目・腕などがカードの外から少し見える程度にし、漢字を絶対に隠さない。',
      '問題カードと入力欄を前面レイヤーに置き、ゲーム中に最も目立つのは敵ではなく問題と入力欄にする。',
      '左の1F〜10Fを縦に並べ、現在階だけ濃い青+金などで強調する。中央上にも大きく現在階を表示する。',
      '右上にTIME、入力欄の下にCOMBOと「MISS -1F / 正解 +1F」を置く。情報を増やしすぎない。',
      '色は「明るい青空 / 薄いベージュ石材 / 濃紺 / 金」を基本にし、敵は濃い紫〜黒、目だけ赤〜橙のアクセントにする。',
      '最後に正解時の短い上昇、MISS時の短い落下、敵へのヒット反応を追加する。演出中も入力やタイマーを止めない。',
      '狭い画面では左右の空や装飾を減らし、問題・入力・TIME・階数を優先して残す。'
    ],
    visualSteps: [
      '① 配置だけ：白黒の箱で「左の階数 / 中央ステージ / TIME / 問題 / 入力」を決める',
      '② 背景：塔を横から切ったような内部を中央に作り、左右へ空を見せる',
      '③ 敵：問題カードの後ろに敵レイヤーを追加し、カード外から顔や手だけ見せる',
      '④ HUD：7F・TIME・COMBO・MISS/正解ルールを配置する',
      '⑤ 色：青空、石材ベージュ、濃紺、金、敵の暗色を入れる',
      '⑥ 演出：階移動・正解/MISS・敵ヒットを短いアニメーションで追加する',
      '⑦ 最終確認：問題と入力欄が背景や敵より常に読みやすいか確認する'
    ],
    code: ".game-stage {\n  display: grid;\n  grid-template-columns: 110px minmax(0, 1fr) 120px;\n  position: relative;\n}\n\n.enemy-layer {\n  position: absolute;\n  inset: 16% 20% auto;\n  z-index: 1;\n}\n\n.question-card, .answer-form {\n  position: relative;\n  z-index: 2;\n}"
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
      '見た目は、塔の断面・左右の空・敵・問題カード・入力欄の重なりが崩れていないかPC画面で確認する。',
      '14日目は新機能を追加せず、発表内容・操作手順・デモ用ルートを確認する。'
    ],
    code: "最低テスト例\n- START → GAMEへ進める\n- 正解で +1F\n- MISSで -1F（1F未満にならない）\n- 時間切れでMISS\n- 10FでRESULT\n- もう一度遊べる\n- 敵が問題文を隠さない\n- 画面幅を変えても入力欄が切れない"
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
      <div class="implementation-section" id="implementationVisualSection" hidden>
        <h3>完成イメージへ近づける順番</h3>
        <ol id="implementationVisual"></ol>
      </div>
      <div class="implementation-section">
        <h3>コードの形</h3>
        <pre><code id="implementationCode"></code></pre>
      </div>
      <p class="implementation-note">コード例は丸ごとコピー用ではなく、「何を使って作るか」を理解するための最小例です。画像案は構造と雰囲気の基準として使い、文字の読みやすさと操作性を優先します。</p>
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
  const visualSection = dialog.querySelector('#implementationVisualSection');
  const visual = dialog.querySelector('#implementationVisual');
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
    button.textContent = index === 8 ? '画像案からの作り方を見る' : '実装のしかたを見る';
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

      const visualSteps = guide.visualSteps || [];
      visualSection.hidden = visualSteps.length === 0;
      visual.replaceChildren(...visualSteps.map(item => {
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