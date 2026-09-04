const boxes = [...document.querySelectorAll('.stage-check input[type="checkbox"]')];
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetButton = document.getElementById('resetChecks');
const nextStepLabel = document.getElementById('nextStepLabel');
const nextStepTitle = document.getElementById('nextStepTitle');
const nextStepText = document.getElementById('nextStepText');
const nextStepLink = document.getElementById('nextStepLink');
const storageKey = 'typeTowerRoadmapChecksV5';
const legacyStorageKey = 'typeTowerRoadmapChecksV4';
const implementedKeys = new Set(['step1', 'step2', 'step3']);

const steps = [
  { title: 'SELECTと3画面の箱を確認する', text: '背景動画、3つの塔の選択肢、SELECT→GAMEの画面切替までを確認する。' },
  { title: '漢字問題を表示する', text: 'kanji.jsonを読み込み、漢字問題を1問ずつ表示する。' },
  { title: 'タイピング判定を完成させる', text: '入力してEnterすると正解かMISSかを判定し、次の問題へ進む。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で1階上がり、MISSで1階下がり、10階でクリアする流れを完成させる。' },
  { title: '漢字の塔を最後まで遊べる状態にする', text: '塔選択からRESULTまで、漢字の塔を最初から最後まで通して遊べる状態にする。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: '完成したゲームの芯を壊さないように追加要素を1つずつつなぐ。' },
  { title: '残り2つの塔をゲームにつなぐ', text: '英訳の塔と和訳の塔も、漢字の塔と同じゲームの流れへ接続する。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間などを表示し、記録が残る状態にする。' },
  { title: 'SELECTとGAMEの見た目を仕上げる', text: '現在の背景素材を残したまま、敵、階移動、HUDを整える。' },
  { title: '問題追加・テスト・発表準備', text: '3モードを通して確認し、重大バグを直して動画・発表準備へ進む。' }
];

function setStepStatus(stepNumber, text) {
  const title = document.querySelector(`#step-${stepNumber} .road-title`);
  if (!title) return;
  let status = title.querySelector('.status');
  if (!status) {
    status = document.createElement('span');
    status.className = 'status';
    title.appendChild(status);
  }
  status.textContent = text;
}

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
          <h2>STEP 3まで実装済み。次は階数処理</h2>
          <p>制作方針は過去のサンプルではなく、現在の type-tower-a / main を基準にします。</p>
        </div>
        <div class="policy-grid">
          <article class="policy-card primary-policy">
            <span class="policy-label">SELECT</span>
            <h3>背景動画 + 3つの塔選択</h3>
            <p>assets/videos/menu-bg.mp4 を背景にし、漢字・英訳・和訳の3ボタンからGAMEへ切り替えます。今の塔名CSSとボタンをそのまま維持します。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">GAME</span>
            <h3>問題表示 + 入力判定まで完成</h3>
            <p>kanji.jsonから問題を読み込み、入力してEnterすると正解 / MISSを判定し、次の問題へ進めます。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">BACKGROUND</span>
            <h3>GAME用画像を実際に使用中</h3>
            <p>画面全体は sky-bg.jpg。ゲームステージは kanji=blue / eiyaku=light / wayaku=dark の画像へ切り替えます。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">DATA</span>
            <h3>kanji.jsonの構文修正済み</h3>
            <p>漢字問題は正常なJSONとして読み込める状態です。en-ja.jsonには問題があり、ja-en.jsonはまだ空です。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">RULE</span>
            <h3>前のSTEPを古い例で上書きしない</h3>
            <p>STEP 4以降のコード全文も、現在のSELECT背景動画・塔名CSS・入力判定・GAME背景を引き継いだ状態から追加します。</p>
          </article>
          <article class="policy-card">
            <span class="policy-label">NEXT</span>
            <h3>STEP 4：正解 +1F / MISS -1F</h3>
            <p>現在の判定処理へ階数を足し、1F未満に下げず、10F到達を判定できるところまで進めます。</p>
          </article>
        </div>
        <div class="core-rule">
          <strong>現在の基準</strong>
          <p>実ファイル上はSTEP 1〜3が完了相当です。進捗表示もこの3STEPを基準状態として扱います。</p>
        </div>
      </div>`;
    homePlan.before(section);
  }

  const specCards = [...document.querySelectorAll('#home-screen-plan .home-spec-card')];
  if (specCards[0]) {
    specCards[0].querySelector('h3').textContent = 'SELECT背景は動画を維持';
    specCards[0].querySelector('p').textContent = 'assets/videos/menu-bg.mp4 を画面全体でループ表示します。GAME用画像へ置き換えません。';
  }
  if (specCards[1]) {
    specCards[1].querySelector('h3').textContent = '3つの塔の選択領域を横並び';
    specCards[1].querySelector('p').textContent = '漢字・英訳・和訳の3つを現在の横並びのまま使います。スマホ専用レイアウトは作りません。';
  }
  if (specCards[2]) {
    specCards[2].querySelector('h3').textContent = '塔名CSSは今の状態を維持';
    specCards[2].querySelector('p').textContent = 'tower-image 内の塔名は明朝系・淡い金色・影付き。後のSTEPでも古いCSSへ戻しません。';
  }
  if (specCards[3]) {
    specCards[3].querySelector('h3').textContent = '選択モードをGAME背景にも使う';
    specCards[3].querySelector('p').textContent = 'data-mode を保持してGAMEへ進み、選択した塔に合わせてゲームステージ背景も切り替えます。';
  }

  const flowItems = [...document.querySelectorAll('#home-screen-plan .home-flow > div')];
  if (flowItems[3]) {
    const text = flowItems[3].querySelector('p');
    if (text) text.textContent = '現在は問題表示・入力・正解/MISS判定まで。次のSTEPで階数をつなぐ。';
  }

  const homeNote = document.querySelector('#home-screen-plan .home-note');
  if (homeNote) {
    homeNote.innerHTML = '<b>今の素材方針：</b>SELECTは menu-bg.mp4。GAME全体は sky-bg.jpg、ゲームステージは tower-blue / light / dark を選択モードごとに使用する。この素材設定も次のSTEPへ引き継ぐ。';
  }

  setStepStatus(1, '実装済み');
  setStepStatus(2, '実装済み');
  setStepStatus(3, '実装済み');
  setStepStatus(4, '次');

  const step2Grid = document.querySelector('#step-2 .task-grid');
  if (step2Grid) {
    step2Grid.innerHTML = '<div><b>実装済み</b><ul><li>kanji.jsonのJSON構文を修正</li><li>game.jsで漢字問題を読み込み</li><li>ランダムで1問表示</li></ul></div><div><b>確認</b><ul><li>問題データを正常に読める</li><li>GAME画面に漢字が出る</li><li>次の問題へ切り替えられる</li></ul></div>';
  }

  const step3Grid = document.querySelector('#step-3 .task-grid');
  if (step3Grid) {
    step3Grid.innerHTML = '<div><b>実装済み</b><ul><li>答え入力欄</li><li>Enterでsubmit</li><li>正解 / MISS判定</li><li>判定後に次の問題</li></ul></div><div><b>保持するもの</b><ul><li>SELECT背景動画</li><li>塔名CSS</li><li>GAME背景画像</li><li>現在のmain.js / game.jsの書き方</li></ul></div>';
  }

  const step4Grid = document.querySelector('#step-4 .task-grid');
  if (step4Grid) {
    step4Grid.innerHTML = '<div><b>次に追加するもの</b><ul><li>現在階 floor</li><li>正解で +1F</li><li>MISSで -1F</li><li>1F未満にしない</li><li>10F到達判定</li></ul></div><div><b>完了条件</b><ul><li>正解 / MISS判定が今まで通り動く</li><li>階数だけが正しく上下する</li><li>STEP1〜3の見た目・背景・入力が消えない</li></ul></div>';
  }

  const step7Grid = document.querySelector('#step-7 .task-grid');
  if (step7Grid) {
    step7Grid.innerHTML = '<div><b>追加するもの</b><ul><li>現在空の ja-en.json を作る</li><li>既存の en-ja.json を接続</li><li>塔ごとの問題データ切替</li></ul></div><div><b>完了条件</b><ul><li>3つの塔すべてから開始できる</li><li>塔ごとに問題が違う</li><li>現在の背景マッピングもそのまま対応する</li></ul></div>';
  }

  const step9Grid = document.querySelector('#step-9 .task-grid');
  if (step9Grid) {
    step9Grid.innerHTML = '<div><b>既にあるもの</b><ul><li>SELECT背景動画</li><li>GAME用 sky-bg.jpg</li><li>GAME用 tower-blue / light / dark</li></ul><b>ここで追加するもの</b><ul><li>敵</li><li>HUD</li><li>階移動演出</li></ul></div><div><b>完了条件</b><ul><li>現在の背景素材を壊さない</li><li>背景より問題が読みやすい</li><li>正解・MISSの移動方向が自然</li><li>主要UIが重ならない</li></ul></div>';
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyStorageKey);
    const saved = JSON.parse(raw || '{}');
    boxes.forEach(box => {
      box.checked = implementedKeys.has(box.dataset.key) || Boolean(saved[box.dataset.key]);
    });
  } catch (_) {
    boxes.forEach(box => {
      box.checked = implementedKeys.has(box.dataset.key);
    });
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
    box.checked = implementedKeys.has(box.dataset.key);
  });
  saveState();
});

syncCurrentProjectState();
loadState();
updateUI();
