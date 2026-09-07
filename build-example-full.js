const STEPS = [
  {
    number: 1,
    status: '実装済み',
    title: '3画面とSELECTを作る',
    intro: '現在の本体では完了済みです。STEP 1の全文を貼り直すと今の背景動画や塔名CSSを壊すため、ここではコードを再掲載しません。',
    changes: [],
    checks: ['SELECT / GAME / RESULT の3画面がある', '3つの塔ボタンからGAMEへ切り替わる', '今のSELECT背景動画と塔名CSSを残す']
  },
  {
    number: 2,
    status: '実装済み',
    title: '漢字問題をJSONから1問表示する',
    intro: '既存の画面切替はそのままにして、問題読込だけ追加します。',
    changes: [
      {
        file: 'js/game.js',
        placement: '空ファイルなので、そのまま先頭から追加',
        note: 'このSTEPで初めてgame.jsを使います。',
        code: `const DATA_FILES={kanji:'./data/kanji.json'};

let questions=[];
let currentQuestion=null;

async function prepareGame(){
  const loaded=await loadQuestions();
  if(loaded) showNextQuestion();
}

async function loadQuestions(){
  try{
    const response=await fetch(DATA_FILES.kanji);
    if(!response.ok) throw new Error('HTTP '+response.status);
    questions=await response.json();
    if(!Array.isArray(questions) || questions.length===0){
      throw new Error('問題データが空です');
    }
    return true;
  }catch(error){
    console.error(error);
    document.getElementById('questionText').textContent='問題を読み込めませんでした';
    return false;
  }
}

function showNextQuestion(){
  currentQuestion=questions[Math.floor(Math.random()*questions.length)];
  document.getElementById('questionText').textContent=currentQuestion.question;
}`
      },
      {
        file: 'js/main.js',
        placement: '途中を編集：startGame()だけ変更',
        note: 'showScreen()など他の関数は触りません。',
        code: `async function startGame(mode) {
  selectedMode=mode;
  showScreen('game');
  await prepareGame();
}`
      }
    ],
    checks: ['漢字の塔を押すとGAMEへ進む', 'kanji.jsonから1問表示される', 'JSON読込失敗時にエラー文が出る']
  },
  {
    number: 3,
    status: '実装済み',
    title: '入力欄と正解 / MISS判定を追加する',
    intro: 'HTMLだけは問題カードの直後へ入れます。CSSと新しいJavaScript処理は基本的に末尾へ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: '途中に追加：#questionCard の直後',
        note: 'GAME画面の .game-hud 内です。',
        code: `<form id="answerForm" class="answer-form">
  <input id="answerInput" type="text" autocomplete="off" placeholder="答えを入力してEnter">
</form>
<p id="judgeMessage" class="judge-message" aria-live="polite"></p>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾に追加',
        note: '既存SELECTのCSSは触りません。',
        code: `.answer-form { width: min(650px,92%); margin-top: 18px; }
.answer-form input {
  width: 100%;
  min-height: 58px;
  padding: 10px 18px;
  border: 3px solid #17345f;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  outline: none;
}
.answer-form input:focus { box-shadow: 0 0 0 4px rgba(216,174,88,.35); }
.judge-message { min-height: 1.5em; margin: 10px 0 0; font-weight: 900; }`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾に追加',
        note: 'STEP 2で作ったloadQuestions()やshowNextQuestion()は残します。',
        code: `const answerForm=document.getElementById('answerForm');
const answerInput=document.getElementById('answerInput');
const judgeMessage=document.getElementById('judgeMessage');

answerForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!currentQuestion) return;
  const answer=normalizeAnswer(answerInput.value);
  if(!answer) return;
  if(answer===normalizeAnswer(currentQuestion.answer)){
    await handleCorrect();
  }else{
    await handleMiss();
  }
});

function normalizeAnswer(value){
  return value.trim().toLowerCase().replace(/\\s+/g,' ');
}

async function handleCorrect(){
  judgeMessage.textContent='正解！';
  showNextQuestion();
}

async function handleMiss(){
  judgeMessage.textContent='MISS';
  showNextQuestion();
}`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：showNextQuestion() の最後',
        note: '次の問題を出したら入力欄を空にしてフォーカスします。',
        code: `document.getElementById('answerInput').value='';
document.getElementById('answerInput').focus();`
      }
    ],
    checks: ['入力欄に答えを書ける', 'Enterで判定される', '正解 / MISS後に次の問題へ進む']
  },
  {
    number: 4,
    status: '実装済み',
    title: '正解 +1F / MISS -1F を追加する',
    intro: '現在の本体はここまで実装済みです。階数表示のHTMLだけ途中へ入れ、CSSとupdateFloor()は末尾へ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: '途中に追加：[data-screen="game"] の先頭',
        note: '戻るボタンより前に入れます。',
        code: `<aside class="floor-rail">
  <span data-floor="10">10F</span><span data-floor="9">9F</span>
  <span data-floor="8">8F</span><span data-floor="7">7F</span>
  <span data-floor="6">6F</span><span data-floor="5">5F</span>
  <span data-floor="4">4F</span><span data-floor="3">3F</span>
  <span data-floor="2">2F</span><span data-floor="1">1F</span>
</aside>`
      },
      {
        file: 'index.html',
        placement: '途中を編集：.hud-top 内の空divに追加',
        note: '既存の .hud-top 自体は消しません。',
        code: `<strong id="floorText">1F</strong>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾に追加',
        note: '階数表示だけ追加します。',
        code: `.floor-rail {
  position: fixed;
  left: 22px;
  top: 50%;
  z-index: 8;
  transform: translateY(-50%);
  display: grid;
  gap: 5px;
}
.floor-rail span {
  width: 62px;
  padding: 5px 8px;
  border-radius: 6px;
  background: rgba(255,255,255,.8);
  color: #5d6b78;
  text-align: center;
  font-size: .78rem;
  font-weight: 800;
}
.floor-rail span.is-current {
  background: #17345f;
  color: #fff;
  outline: 2px solid #d8ae58;
}
#floorText { display:block; color:#17345f; font-size:clamp(2rem,5vw,3.5rem); }`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：questions / currentQuestion の近く',
        note: '現在階のstateを1つだけ追加します。',
        code: `let floor=1;`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：prepareGame() の先頭',
        note: 'ゲーム開始ごとに1Fへ戻します。',
        code: `floor=1;
updateFloor();`
      },
      {
        file: 'js/game.js',
        placement: '途中を編集：handleCorrect() / handleMiss() に階数処理を追加',
        note: '既存の判定処理を残して、階数だけ足します。',
        code: `// handleCorrect() の先頭側
floor+=1;
updateFloor();
judgeMessage.textContent='正解！ +1F';
if(floor>=10){
  showScreen('result');
  return;
}

// handleMiss() の先頭側
floor=Math.max(1,floor-1);
updateFloor();
judgeMessage.textContent='MISS -1F';`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾に追加',
        note: '階数表示の更新処理です。',
        code: `function updateFloor(){
  document.getElementById('floorText').textContent=floor+'F';
  document.querySelectorAll('[data-floor]').forEach(item=>{
    item.classList.toggle('is-current',Number(item.dataset.floor)===floor);
  });
}`
      }
    ],
    checks: ['正解で+1F', 'MISSで-1F', '1F未満にならない', '10FでRESULT画面へ切り替わる']
  },
  {
    number: 5,
    status: '次',
    title: 'RESULTを作って漢字の塔を最後までつなぐ',
    intro: 'ここからが次の作業です。RESULTの空sectionだけ置換し、集計用stateと関数は既存game.jsへ少しずつ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: '一部だけ置換：空の [data-screen="result"] section',
        note: '他のSELECT / GAME部分は触りません。',
        code: `<section data-screen="result" hidden>
  <div class="result-panel">
    <p class="result-kicker">TOWER CLEAR</p>
    <h1 id="resultTitle">漢字の塔 CLEAR</h1>
    <div class="result-grid">
      <div><span>正解</span><strong id="resultCorrect">0</strong></div>
      <div><span>MISS</span><strong id="resultMiss">0</strong></div>
    </div>
    <div class="result-actions">
      <button id="retryButton">もう一度挑戦</button>
      <button id="resultBackButton">塔選択へ戻る</button>
    </div>
  </div>
</section>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾に追加',
        note: 'RESULT専用CSSだけ追加します。',
        code: `[data-screen="result"] { display:grid; place-items:center; padding:32px; }
.result-panel {
  width:min(620px,100%);
  padding:32px;
  border:2px solid #d8ae58;
  border-radius:16px;
  background:#fff;
  text-align:center;
}
.result-kicker { margin:0 0 6px; font-weight:900; color:#7b673d; }
.result-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin:24px 0; }
.result-grid div { padding:18px; border:1px solid #ddd; border-radius:10px; }
.result-grid span { display:block; color:#666; }
.result-grid strong { display:block; margin-top:4px; font-size:2rem; }
.result-actions { display:flex; justify-content:center; gap:10px; }`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：floorの近く',
        note: '集計用stateを追加します。',
        code: `let correctCount=0;
let missCount=0;`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：prepareGame() の floor初期化の直後',
        note: '再挑戦時に集計もリセットします。',
        code: `correctCount=0;
missCount=0;`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：handleCorrect() / handleMiss() の先頭',
        note: '正解・MISS回数をそれぞれ増やします。',
        code: `// handleCorrect() の先頭
correctCount+=1;

// handleMiss() の先頭
missCount+=1;`
      },
      {
        file: 'js/game.js',
        placement: '一部だけ置換：10F到達時の showScreen("result")',
        note: 'RESULT表示前に数字を入れる関数を呼びます。',
        code: `finishGame();`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾に追加',
        note: 'RESULTへ表示する関数です。',
        code: `function finishGame(){
  document.getElementById('resultCorrect').textContent=correctCount;
  document.getElementById('resultMiss').textContent=missCount;
  showScreen('result');
}`
      },
      {
        file: 'js/main.js',
        placement: 'ファイル末尾に追加',
        note: 'RESULTの2ボタンだけ追加します。',
        code: `document.getElementById('retryButton').addEventListener('click',()=>{
  startGame(selectedMode);
});

document.getElementById('resultBackButton').addEventListener('click',()=>{
  showScreen('select');
});`
      }
    ],
    checks: ['10FでRESULTへ進む', '正解数 / MISS数が表示される', '再挑戦できる', '塔選択へ戻れる']
  },
  {
    number: 6,
    status: '未実装',
    title: 'TIME / COMBO / 難易度を追加する',
    intro: '新しいUIは必要な場所へ入れます。新しい関数とCSSは末尾へ追加し、既存判定関数には数行だけ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: '途中に追加：SELECTの .tower-select より前',
        note: '難易度選択です。',
        code: `<label class="difficulty-box">
  難易度
  <select id="difficultySelect">
    <option value="easy">EASY</option>
    <option value="normal" selected>NORMAL</option>
    <option value="hard">HARD</option>
  </select>
</label>`
      },
      {
        file: 'index.html',
        placement: '途中に追加：.hud-top 内のfloor表示の横',
        note: '制限時間表示です。',
        code: `<div class="timer-box">TIME <strong id="timeText">10</strong></div>`
      },
      {
        file: 'index.html',
        placement: '途中に追加：#judgeMessage の直後',
        note: 'コンボ表示です。',
        code: `<div class="combo-box">COMBO ×<strong id="comboText">0</strong></div>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾に追加',
        note: 'TIME / COMBO / 難易度の見た目だけ追加します。',
        code: `.difficulty-box { position:absolute; top:18px; right:18px; z-index:2; padding:10px 12px; background:#fff; border-radius:8px; font-weight:800; }
.timer-box,.combo-box { padding:8px 12px; border-radius:8px; background:rgba(255,255,255,.9); font-weight:900; }
.combo-box { margin-top:10px; }`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：state変数の近く',
        note: 'TIME / COMBO用stateです。',
        code: `const TIME_BY_DIFFICULTY={easy:15,normal:10,hard:7};
let timerId=null;
let timeLeft=10;
let combo=0;
let maxCombo=0;
let selectedDifficulty='normal';`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：prepareGame() の初期化部分',
        note: 'ゲーム開始時に難易度とCOMBOを初期化します。',
        code: `selectedDifficulty=document.getElementById('difficultySelect').value;
combo=0;
maxCombo=0;
updateCombo();`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：showNextQuestion() の最後',
        note: '問題が変わるたびにタイマーを開始します。',
        code: `startTimer();`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：handleCorrect() / handleMiss() の先頭側',
        note: '判定時にタイマーを止め、COMBOを更新します。',
        code: `// handleCorrect()
clearInterval(timerId);
combo+=1;
maxCombo=Math.max(maxCombo,combo);
updateCombo();

// handleMiss()
clearInterval(timerId);
combo=0;
updateCombo();`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾に追加',
        note: 'タイマーとCOMBO表示の関数です。',
        code: `function startTimer(){
  clearInterval(timerId);
  timeLeft=TIME_BY_DIFFICULTY[selectedDifficulty] || 10;
  updateTimer();
  timerId=setInterval(async()=>{
    timeLeft-=1;
    updateTimer();
    if(timeLeft<=0){
      clearInterval(timerId);
      await handleMiss();
    }
  },1000);
}

function updateTimer(){
  document.getElementById('timeText').textContent=timeLeft;
}

function updateCombo(){
  document.getElementById('comboText').textContent=combo;
}`
      }
    ],
    checks: ['難易度でTIME初期値が変わる', 'TIME 0でMISSになる', '正解でCOMBOが増える', 'MISSでCOMBOが0へ戻る']
  },
  {
    number: 7,
    status: '未実装',
    title: '英訳 / 和訳の問題データを接続する',
    intro: '画面切替は既に3モード対応なので、問題ファイルの対応表とfetch先だけ変更します。',
    changes: [
      {
        file: 'data/ja-en.json',
        placement: '現在空なので、そのまま先頭から追加',
        note: '英訳の塔用（日本語 → 英語）の問題例です。',
        code: `[
  { "question": "りんご", "answer": "apple" },
  { "question": "学校", "answer": "school" },
  { "question": "経験", "answer": "experience" }
]`
      },
      {
        file: 'js/game.js',
        placement: '一部だけ置換：DATA_FILES の1行',
        note: '3モード分のJSONを対応させます。',
        code: `const DATA_FILES={
  kanji:'./data/kanji.json',
  eiyaku:'./data/ja-en.json',
  wayaku:'./data/en-ja.json'
};`
      },
      {
        file: 'js/game.js',
        placement: '一部だけ置換：loadQuestions() 内のfetch行',
        note: '選択したmodeのJSONを読みます。',
        code: `const response=await fetch(DATA_FILES[selectedMode]);`
      }
    ],
    checks: ['漢字はkanji.jsonを読む', '英訳はja-en.jsonを読む', '和訳はen-ja.jsonを読む', '3つの塔で問題内容が変わる']
  },
  {
    number: 8,
    status: '未実装',
    title: 'RESULT詳細とベスト記録を保存する',
    intro: '保存処理は空のstorage.jsへ追加します。HTMLはRESULTの中とscript読込位置だけ途中へ追加します。',
    changes: [
      {
        file: 'js/storage.js',
        placement: '空ファイルなので、そのまま先頭から追加',
        note: 'localStorageへモード・難易度別のベスト記録を保存します。',
        code: `const RECORD_KEY='typeTowerRecordsV1';

function loadRecords(){
  try{
    return JSON.parse(localStorage.getItem(RECORD_KEY)) || {};
  }catch(error){
    console.warn('記録を読み込めませんでした',error);
    return {};
  }
}

function saveRecord(mode,difficulty,result){
  const records=loadRecords();
  const key=mode+':'+difficulty;
  const old=records[key] || {};
  const next={
    bestTime:old.bestTime==null ? result.time : Math.min(old.bestTime,result.time),
    maxCombo:Math.max(old.maxCombo || 0,result.maxCombo),
    bestAccuracy:Math.max(old.bestAccuracy || 0,result.accuracy)
  };
  records[key]=next;
  localStorage.setItem(RECORD_KEY,JSON.stringify(records));
  return next;
}`
      },
      {
        file: 'index.html',
        placement: '途中に追加：RESULTの .result-grid 内',
        note: '正解 / MISSの2項目の後ろへ追加します。',
        code: `<div><span>正答率</span><strong id="resultAccuracy">0%</strong></div>
<div><span>最大COMBO</span><strong id="resultMaxCombo">0</strong></div>
<div><span>TIME</span><strong id="resultTime">0.0s</strong></div>`
      },
      {
        file: 'index.html',
        placement: '途中に追加：.result-grid の直後',
        note: 'ベスト記録表示です。',
        code: `<p id="bestRecordText" class="best-record"></p>`
      },
      {
        file: 'index.html',
        placement: '途中に追加：js/game.js より前のscript群',
        note: 'game.jsがsaveRecord()を使うため先に読み込みます。',
        code: `<script src="js/storage.js"></script>`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：state変数の近く / prepareGame() 内',
        note: '開始時刻を記録します。',
        code: `// stateの近く
let startedAt=0;

// prepareGame() の初期化部分
startedAt=performance.now();`
      },
      {
        file: 'js/game.js',
        placement: '一部だけ置換：finishGame() 関数だけ',
        note: 'RESULT表示とベスト保存をここへまとめます。',
        code: `function finishGame(){
  clearInterval(timerId);
  const elapsed=(performance.now()-startedAt)/1000;
  const answered=correctCount+missCount;
  const accuracy=answered===0 ? 0 : Math.round(correctCount/answered*100);

  document.getElementById('resultCorrect').textContent=correctCount;
  document.getElementById('resultMiss').textContent=missCount;
  document.getElementById('resultAccuracy').textContent=accuracy+'%';
  document.getElementById('resultMaxCombo').textContent=maxCombo;
  document.getElementById('resultTime').textContent=elapsed.toFixed(1)+'s';

  const best=saveRecord(selectedMode,selectedDifficulty,{
    time:elapsed,
    maxCombo,
    accuracy
  });
  document.getElementById('bestRecordText').textContent=
    'BEST '+best.bestTime.toFixed(1)+'s / COMBO '+best.maxCombo+' / ACC '+best.bestAccuracy+'%';

  showScreen('result');
}`
      }
    ],
    checks: ['RESULTに正答率 / 最大COMBO / TIMEが出る', 'リロード後もベスト記録が残る', 'モード・難易度ごとに記録が分かれる']
  },
  {
    number: 9,
    status: '未実装',
    title: '階移動演出と二重入力防止を追加する',
    intro: 'effects.jsへ演出関数を追加します。GAME背景素材は既に本体へあるので、背景CSSを貼り直しません。',
    changes: [
      {
        file: 'index.html',
        placement: '途中に追加：.game-stage の中、.game-hud より前',
        note: '演出専用の背景レイヤーです。',
        code: `<div id="towerScene" class="tower-scene" aria-hidden="true"></div>`
      },
      {
        file: 'index.html',
        placement: '途中に追加：js/game.js より前のscript群',
        note: 'game.jsから演出関数を呼ぶため先に読み込みます。',
        code: `<script src="js/effects.js"></script>`
      },
      {
        file: 'js/effects.js',
        placement: '空ファイルなので、そのまま先頭から追加',
        note: '正解 / MISSと階移動の短い演出です。',
        code: `function wait(ms){
  return new Promise(resolve=>setTimeout(resolve,ms));
}

async function playFloorMove(direction){
  const scene=document.getElementById('towerScene');
  const className=direction==='up' ? 'move-up' : 'move-down';
  scene.classList.remove('move-up','move-down');
  void scene.offsetWidth;
  scene.classList.add(className);
  await wait(340);
  scene.classList.remove(className);
}

async function flashAnswer(type){
  const card=document.getElementById('questionCard');
  const className=type==='correct' ? 'is-correct' : 'is-miss';
  card.classList.remove('is-correct','is-miss');
  void card.offsetWidth;
  card.classList.add(className);
  await wait(250);
  card.classList.remove(className);
}`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾に追加',
        note: '既存背景画像の指定はそのまま残します。',
        code: `.tower-scene { position:absolute; inset:0; pointer-events:none; }
.tower-scene.move-up { animation:floorUp .34s ease; }
.tower-scene.move-down { animation:floorDown .34s ease; }
.question-card.is-correct { animation:correctFlash .25s ease; }
.question-card.is-miss { animation:missFlash .25s ease; }
@keyframes floorUp { 50% { transform:translateY(18px); } }
@keyframes floorDown { 50% { transform:translateY(-18px); } }
@keyframes correctFlash { 50% { box-shadow:0 0 0 8px rgba(70,180,100,.35); } }
@keyframes missFlash { 50% { box-shadow:0 0 0 8px rgba(210,70,70,.3); } }`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：state変数の近く',
        note: '演出中の二重送信を防ぎます。',
        code: `let isJudging=false;`
      },
      {
        file: 'js/game.js',
        placement: '一部だけ置換：answerForm の submit listenerだけ',
        note: '判定中は次のEnterを無視します。',
        code: `answerForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!currentQuestion || isJudging) return;
  const answer=normalizeAnswer(answerInput.value);
  if(!answer) return;

  isJudging=true;
  try{
    if(answer===normalizeAnswer(currentQuestion.answer)){
      await handleCorrect();
    }else{
      await handleMiss();
    }
  }finally{
    isJudging=false;
  }
});`
      },
      {
        file: 'js/game.js',
        placement: '途中に追加：handleCorrect() / handleMiss() の次問題へ進む前',
        note: '既存の階数更新後に演出を挟みます。',
        code: `// handleCorrect()
await flashAnswer('correct');
await playFloorMove('up');

// handleMiss()
await flashAnswer('miss');
await playFloorMove('down');`
      }
    ],
    checks: ['正解で上方向の演出', 'MISSで下方向の演出', '演出中の連打で二重判定しない', '既存のGAME背景が消えない']
  },
  {
    number: 10,
    status: '未実装',
    title: '問題追加と最終テストをする',
    intro: '新機能は増やしません。TEST.mdを追加し、問題JSONへ追加するときだけ配列の最後へ正しいJSON形式で足します。',
    changes: [
      {
        file: 'TEST.md',
        placement: '新規ファイルなので、そのまま先頭から追加',
        note: '上から順番に3人で確認します。',
        code: `# TYPE TOWER 最終テスト

- [ ] SELECT背景動画が表示される
- [ ] 3つの塔ボタンが反応する
- [ ] 漢字 / 英訳 / 和訳で別の問題が出る
- [ ] Enterで回答できる
- [ ] 正解で +1F
- [ ] MISSで -1F
- [ ] 1F未満にならない
- [ ] TIME 0でMISSになる
- [ ] COMBOが正常に増減する
- [ ] 10FでRESULTへ進む
- [ ] RESULTの数字が実プレイと一致する
- [ ] ベスト記録がリロード後も残る
- [ ] 再挑戦できる
- [ ] 塔選択へ戻れる
- [ ] 連打しても二重判定しない`
      },
      {
        file: 'data/*.json',
        placement: '途中に追加：最後の ] の直前',
        note: 'JSONは単純にファイル末尾へ書くと壊れます。直前の問題との間にカンマが必要です。',
        code: `,
{ "question": "追加する問題", "answer": "こたえ" }
]`
      }
    ],
    checks: ['3モードを最初からRESULTまで通す', '重大な進行不能がない', 'JSON構文エラーがない', '最終日は新機能を増やさない']
  }
];

function renderChange(change){
  const details=document.createElement('details');
  details.className='full-file';

  const summary=document.createElement('summary');
  const title=document.createElement('span');
  const placement=document.createElement('small');
  title.textContent=change.file;
  placement.textContent=change.placement;
  summary.append(title,placement);

  const note=document.createElement('p');
  note.className='placement-note';
  note.innerHTML=`<strong>書く場所：</strong>${change.placement}${change.note ? `<br>${change.note}` : ''}`;

  const pre=document.createElement('pre');
  const code=document.createElement('code');
  code.textContent=change.code;
  pre.appendChild(code);

  details.append(summary,note,pre);
  return details;
}

function renderStep(step){
  const section=document.createElement('section');
  section.className='section full-step';
  section.id='full-step-'+step.number;

  const wrap=document.createElement('div');
  wrap.className='wrap';

  const head=document.createElement('div');
  head.className='full-step-head';
  head.innerHTML=`
    <div class="full-step-number">${String(step.number).padStart(2,'0')}</div>
    <div class="full-step-title">
      <p>STEP ${step.number} / ${step.status}</p>
      <h2>${step.title}</h2>
    </div>`;

  const intro=document.createElement('p');
  intro.className='full-step-intro';
  intro.textContent=step.intro;

  const rule=document.createElement('p');
  rule.className='full-step-note';
  rule.innerHTML=step.changes.length
    ? '<b>このSTEPで表示するのは追加・変更する部分だけです。</b> ファイル全文は貼り直しません。'
    : '<b>現在は貼り直し不要です。</b> 実装済みの本体コードをそのまま使います。';

  wrap.append(head,intro,rule);

  if(step.changes.length){
    const list=document.createElement('div');
    list.className='full-files';
    step.changes.forEach(change=>list.appendChild(renderChange(change)));
    wrap.appendChild(list);
  }

  const check=document.createElement('div');
  check.className='full-check';
  const ul=document.createElement('ul');
  step.checks.forEach(text=>{
    const li=document.createElement('li');
    li.textContent=text;
    ul.appendChild(li);
  });
  const strong=document.createElement('strong');
  strong.textContent='このSTEPで確認';
  check.append(strong,ul);
  wrap.appendChild(check);

  section.appendChild(wrap);
  return section;
}

const app=document.getElementById('fullExampleApp');

const jump=document.createElement('nav');
jump.className='full-jump';
jump.setAttribute('aria-label','STEP一覧');
STEPS.forEach(step=>{
  const link=document.createElement('a');
  link.href='#full-step-'+step.number;
  link.textContent='STEP '+step.number;
  jump.appendChild(link);
});
app.appendChild(jump);

STEPS.forEach(step=>app.appendChild(renderStep(step)));
