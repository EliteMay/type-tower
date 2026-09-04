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
  { title: 'SELECTと3画面の箱を確認する', text: '背景動画、3つの塔の選択肢、SELECT→GAMEの画面切替までを確認する。' },
  { title: '漢字問題を表示する', text: 'まずkanji.jsonのJSON構文を直し、漢字の塔だけで問題を1問ずつ表示できるようにする。' },
  { title: 'タイピング判定を完成させる', text: '入力して確定すると正解かMISSかを判定し、次の問題へ進めるようにする。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で1階上がり、MISSで1階下がり、10階でクリアする流れを完成させる。' },
  { title: '漢字の塔を最後まで遊べる状態にする', text: '塔選択からRESULTまで、漢字の塔を最初から最後まで通して遊べる状態にする。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: '完成したゲームの芯を壊さないように追加要素を1つずつつなぐ。' },
  { title: '残り2つの塔をゲームにつなぐ', text: '英訳の塔と和訳の塔も、漢字の塔と同じゲームの流れへ接続する。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間などを表示し、記録が残る状態にする。' },
  { title: 'SELECTとGAMEの見た目を仕上げる', text: '背景動画、GAME用の塔内部素材、敵、階移動、HUDを整える。' },
  { title: '問題追加・テスト・発表準備', text: '3モードを通して確認し、重大バグを直して動画・発表準備へ進む。' }
];

function syncCurrentProjectState() {
  const homePlan = document.getElementById('home-screen-plan');
  if (homePlan && !document.getElementById('current-state')) {
    const section = document.createElement('section');
    section.className = 'section section-soft';
    section.id = 'current-state';
    section.innerHTML = `
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">CURRENT REPOSITORY STATE</p>
          <h2>今のゲーム本体はここまでできている</h2>
          <p>制作方針は過去の想定ではなく、現在の type-tower-a / main の状態を基準にします。</p>
        </div>
        <div class="policy-grid">
          <article class="policy-card primary-policy">
            <span class="policy-label">SELECT</span>
            <h3>背景動画 + 3つの塔選択</h3>
            <p>assets/videos/menu-bg.mp4 を背景にし、漢字・英訳・和訳の3ボタンからGAMEへ切り替えられます。塔名は今は塔表示領域の中に文字として置いています。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">GAME</span>
            <h3>画面の箱まで作成済み</h3>
            <p>戻るボタン、ゲームステージ、問題カードの枠があります。game.js はまだ空なので、問題読み込み・入力・判定はこれからです。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">DATA</span>
            <h3>問題データは一部準備済み</h3>
            <p>kanji.json と en-ja.json には問題があります。ja-en.json は空です。kanji.json は現在カンマ不足があるため、STEP 2の最初にJSON構文を直します。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">ASSETS</span>
            <h3>SELECT用とGAME用を分ける</h3>
            <p>menu-bg.mp4 はSELECT用。sky-bg.jpg と tower-blue / light / dark の3枚はGAME画面用として保持し、SELECTには使いません。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">JS</span>
            <h3>main.js は自分たちの書き方を維持</h3>
            <p>現在の main.js はモード選択と画面切替だけを担当します。game.js・effects.js・storage.js は必要なSTEPで少しずつ使います。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">NEXT</span>
            <h3>次は漢字問題の表示</h3>
            <p>先に見た目を増やさず、kanji.jsonを正しいJSONにしてから、game.jsで読み込み→1問表示まで進めます。</p>
          </article>
        </div>
        <div class="core-rule">
          <strong>現在の基準</strong>
          <p>実ファイル上はSTEP 1相当まで進んでいます。進捗チェックに保存済みの状態がある場合はそちらを優先し、保存がない場合だけSTEP 1を完了状態から始めます。</p>
        </div>
      </div>`;
    homePlan.before(section);
  }

  const specCards = [...document.querySelectorAll('#home-screen-plan .home-spec-card')];
  if (specCards[0]) {
    specCards[0].querySelector('h3').textContent = 'SELECT背景は動画を使う';
    specCards[0].querySelector('p').textContent = '現在は assets/videos/menu-bg.mp4 を画面全体でループ表示します。sky-bg.jpg はSELECT背景には使いません。';
  }
  if (specCards[1]) {
    specCards[1].querySelector('h3').textContent = '3つの塔の選択領域を横並び';
    specCards[1].querySelector('p').textContent = '今はSELECT画面に塔画像を入れず、漢字・英訳・和訳の3つの領域を並べています。用意済みの塔内部3枚はGAME画面用です。';
  }
  if (specCards[2]) {
    specCards[2].querySelector('h3').textContent = '塔名は現在、塔表示領域の中';
    specCards[2].querySelector('p').textContent = '現在のHTMLでは「漢字の塔」などを tower-image の中に置き、CSSで明朝系・淡い金色・影付きにしています。自分たちの今の書き方をそのまま基準にします。';
  }
  if (specCards[3]) {
    specCards[3].querySelector('h3').textContent = '開始ボタンは今のまま使う';
    specCards[3].querySelector('p').textContent = '各ボタンの data-mode を main.js が受け取り、選んだモードを保持してGAMEへ切り替えます。';
  }

  const flowItems = [...document.querySelectorAll('#home-screen-plan .home-flow > div')];
  if (flowItems[3]) {
    const text = flowItems[3].querySelector('p');
    if (text) text.textContent = '今はGAME画面の箱へ切り替わるところまで。問題表示はSTEP 2で追加する。';
  }

  const homeNote = document.querySelector('#home-screen-plan .home-note');
  if (homeNote) {
    homeNote.innerHTML = '<b>今の素材方針：</b>SELECTは背景動画を主役にする。sky-bg.jpg と3枚の塔内部画像はGAME画面用として残し、ゲーム画面を作る段階まで先回りして使わない。';
  }

  const step1Status = document.querySelector('#step-1 .status');
  if (step1Status) step1Status.textContent = '実装済み相当';

  const step2Title = document.querySelector('#step-2 .road-title > div');
  if (step2Title && !step2Title.parentElement.querySelector('.status')) {
    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = '次';
    step2Title.parentElement.appendChild(status);
  }

  const step2Grid = document.querySelector('#step-2 .task-grid');
  if (step2Grid) {
    step2Grid.innerHTML = '<div><b>作るもの</b><ul><li>kanji.jsonのカンマ不足を修正</li><li>game.jsで漢字問題を読み込む</li><li>問題を1問表示する</li></ul></div><div><b>完了条件</b><ul><li>kanji.jsonが正しいJSONとして読める</li><li>GAME画面に問題が1問出る</li><li>別の問題へ切り替えられる</li></ul></div>';
  }

  const step7Grid = document.querySelector('#step-7 .task-grid');
  if (step7Grid) {
    step7Grid.innerHTML = '<div><b>追加するもの</b><ul><li>現在空の ja-en.json を作る</li><li>既存の en-ja.json を接続</li><li>塔ごとの問題切替</li></ul></div><div><b>完了条件</b><ul><li>3つの塔すべてから開始できる</li><li>塔ごとに問題が違う</li><li>3モードとも最後まで遊べる</li></ul></div>';
  }

  const step9Grid = document.querySelector('#step-9 .task-grid');
  if (step9Grid) {
    step9Grid.innerHTML = '<div><b>仕上げるもの</b><ul><li>SELECT背景動画</li><li>GAME用 sky-bg.jpg</li><li>GAME用 tower-blue / light / dark</li><li>敵・HUD・階移動演出</li></ul></div><div><b>完了条件</b><ul><li>背景より問題が読みやすい</li><li>各モードに合うGAME素材が出る</li><li>正解・MISSの移動方向が自然</li><li>主要UIが重ならない</li></ul></div>';
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) {
      boxes.forEach(box => {
        box.checked = box.dataset.key === 'step1';
      });
      return;
    }

    const saved = JSON.parse(raw || '{}');
    boxes.forEach(box => {
      box.checked = Boolean(saved[box.dataset.key]);
    });
  } catch (_) {
    // 保存データが壊れていてもロードマップは使えるようにする。
  }
}

function saveState() {
  const state = Object.fromEntries(boxes.map(box => [box.dataset.key, box.checked]));
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (_) {
    // 保存できなくてもチェック操作は続けられる。
  }
  updateUI();
}

function updateUI() {
  const done = boxes.filter(box => box.checked).length;
  const percent = boxes.length ? Math.round((done / boxes.length) * 100) : 0;

  if (progressText) progressText.textContent = `${percent}% (${done}/${boxes.length})`;
  if (progressBar) progressBar.style.width = `${percent}%`;

  const nextIndex = boxes.findIndex(box => !box.checked);
  if (nextIndex === -1) {
    if (nextStepLabel) nextStepLabel.textContent = 'COMPLETE';
    if (nextStepTitle) nextStepTitle.textContent = 'ロードマップ完了';
    if (nextStepText) nextStepText.textContent = '最終テストと発表準備を進める。';
    if (nextStepLink) {
      nextStepLink.textContent = '完成条件を確認';
      nextStepLink.href = '#finish';
    }
    return;
  }

  const stepNumber = nextIndex + 1;
  const step = steps[nextIndex];
  if (nextStepLabel) nextStepLabel.textContent = `STEP ${stepNumber}`;
  if (nextStepTitle) nextStepTitle.textContent = step.title;
  if (nextStepText) nextStepText.textContent = step.text;
  if (nextStepLink) {
    nextStepLink.textContent = 'この工程を見る';
    nextStepLink.href = `#step-${stepNumber}`;
  }
}

boxes.forEach(box => box.addEventListener('change', saveState));

resetButton?.addEventListener('click', () => {
  boxes.forEach(box => {
    box.checked = false;
  });
  saveState();
});

syncCurrentProjectState();
loadState();
updateUI();
