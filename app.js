const boxes = [...document.querySelectorAll('#checkGrid input[type="checkbox"]')];
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetButton = document.getElementById('resetChecks');
const storageKey = 'typeTowerPlanChecks';

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    boxes.forEach(box => { box.checked = Boolean(saved[box.dataset.key]); });
  } catch (_) {}
  updateProgress();
}

function saveState() {
  const state = Object.fromEntries(boxes.map(box => [box.dataset.key, box.checked]));
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateProgress();
}

function updateProgress() {
  const done = boxes.filter(box => box.checked).length;
  const percent = Math.round((done / boxes.length) * 100);
  progressText.textContent = `${percent}% (${done}/${boxes.length})`;
  progressBar.style.width = `${percent}%`;
}

boxes.forEach(box => box.addEventListener('change', saveState));
resetButton.addEventListener('click', () => {
  boxes.forEach(box => { box.checked = false; });
  saveState();
});

loadState();
