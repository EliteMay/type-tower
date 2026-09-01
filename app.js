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

boxes.forEach(box => box.addEventListener('change', saveState));
resetButton.addEventListener('click', () => {
  boxes.forEach(box => { box.checked = false; });
  saveState();
});

loadState();
