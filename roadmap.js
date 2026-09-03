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
  { title: '3画面の箱とHOMEの塔を作る', text: 'HOME・GAME・RESULTを用意し、HOMEに3つの塔と開始ボタンを置く。' },
  { title: '漢字問題を表示する', text: 'まず漢字の塔だけで問題データを読み込み、1問ずつ表示できるようにする。' },
  { title: 'タイピング判定を完成させる', text: '入力して確定すると正解かMISSかを判定し、次の問題へ進めるようにする。' },
  { title: 'タワーの上下とクリアをつなぐ', text: '正解で1階上がり、MISSで1階下がり、10階でクリアする流れを完成させる。' },
  { title: '漢字の塔を最後まで遊べる状態にする', text: '塔選択からRESULTまで、漢字の塔を最初から最後まで通して遊べる状態にする。' },
  { title: 'タイマー・コンボ・難易度を追加する', text: '完成したゲームの芯を壊さないように追加要素を1つずつつなぐ。' },
  { title: '残り2つの塔をゲームにつなぐ', text: '英訳の塔と和訳の塔も、漢字の塔と同じゲームの流れへ接続する。' },
  { title: 'RESULTと記録保存を完成させる', text: '正答率・最大コンボ・クリア時間などを表示し、記録が残る状態にする。' },
  { title: 'HOMEとGAMEの見た目を仕上げる', text: '背景、塔、敵、階移動、HUDなどを整え、遊びやすさと見た目を仕上げる。' },
  { title: '問題追加・テスト・発表準備', text: '3モードを通して確認し、重大バグを直して動画・発表準備へ進む。' }
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
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

loadState();
updateUI();
