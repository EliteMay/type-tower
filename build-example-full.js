const STEPS = [
  {
    number: 1,
    status: '実装済み',
    title: '3画面とSELECTを作る',
    intro: '現在の type-tower-a / main で完了済みです。今のSELECT背景動画・3つの塔・画面切替をそのまま使います。',
    changes: [],
    checks: ['SELECT / GAME / RESULT の3画面がある', '3つの塔ボタンからGAMEへ切り替わる', '現在の本体コードを貼り直さない']
  },
  {
    number: 2,
    status: '実装済み',
    title: '漢字問題をJSONから表示する',
    intro: '現在の本体で完了済みです。loadQuestions() / resetQuestionPool() / showNextQuestion() を本体の現在実装として扱います。',
    changes: [],
    checks: ['data/kanji.json を読み込める', 'GAMEに問題が表示される', '問題プールを使って同じ問題の連続重複を避ける']
  },
  {
    number: 3,
    status: '実装済み',
    title: '入力と正解 / MISS判定をつなぐ',
    intro: '現在の本体で完了済みです。answerForm の submit listener、normalizeAnswer()、handleCorrect()、handleMiss() をそのまま基準にします。',
    changes: [],
    checks: ['Enterで判定できる', '正解 / MISSが表示される', '判定後に次の問題へ進む']
  },
  {
    number: 4,
    status: '実装済み',
    title: '正解 +1F / MISS -1F / 10Fクリア',
    intro: '現在の本体で完了済みです。floor と updateFloor()、10F判定を基準にします。',
    changes: [],
    checks: ['正解で+1F', 'MISSで-1F', '1F未満にならない', '10FでfinishGame()へ進む']
  },
  {
    number: 5,
    status: '本体反映済み / 動作確認待ち',
    title: 'RESULT・再挑戦・塔選択へ戻る',
    intro: 'RESULTのHTML/CSS、正解数・MISS数、finishGame()、再挑戦と塔選択へ戻る処理は現在の本体へ反映済みです。ここでは追加コードを貼り直さず、実ブラウザでの動作確認だけ行います。',
    changes: [],
    checks: ['10FでRESULTへ進む', '正解数 / MISS数が実プレイと合う', '再挑戦できる', '塔選択へ戻れる']
  },
  {
    number: 6,
    status: '次（STEP 5確認後）',
    title: 'ゲーム全体TIME 90秒を追加する',
    intro: '問題ごとの制限時間ではありません。ゲーム開始からRESULTまで90秒を通しで減らし、問題が変わっても残り時間をリセットしません。COMBOと難易度は作りません。',
    changes: [
      {
        file: 'index.html',
        placement: 'GAMEの `.hud-top` 内：`<strong id="floorText">1F</strong>` を含むdivの後ろへ追加（現在約42行目前後）',
        note: '残り時間を常に見える位置へ出します。初期表示は90です。',
        code: `<div class="timer-box">TIME <strong id="timeText">90</strong></div>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾：現在のRESULT用CSSの後ろへ追加',
        note: 'TIME表示専用です。既存のGAME背景やRESULT CSSは変更しません。',
        code: `.timer-box {
  padding:8px 12px;
  border-radius:8px;
  background:rgba(255,255,255,.9);
  font-weight:900;
}`
      },
      {
        file: 'js/game.js',
        placement: 'state変数群：`let missCount = 0;` の直後へ追加（現在約8行目前後）',
        note: '90秒は一旦の固定値です。後から変える場合は GAME_TIME だけ変更します。',
        code: `const GAME_TIME=90;
let timerId=null;
let timeLeft=GAME_TIME;`
      },
      {
        file: 'js/game.js',
        placement: 'prepareGame() の `if (loaded) {` 内：`resetQuestionPool();` の直後、`showNextQuestion();` の前へ追加',
        note: '問題データの準備が終わってから、ゲーム全体タイマーを1回だけ開始します。',
        code: `document.getElementById('resultTitle').textContent='漢字の塔 CLEAR';
startGameTimer();`
      },
      {
        file: 'js/game.js',
        placement: '`function finishGame(){` の直後へ1行追加',
        note: '10FクリアでもTIME UPでもRESULTへ入った時点でタイマーを止めます。',
        code: `clearInterval(timerId);`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾：finishGame() の閉じかっこの後ろへ追加',
        note: 'showNextQuestion() や handleCorrect() / handleMiss() からは呼びません。問題が変わっても90秒へ戻さないためです。',
        code: `function startGameTimer(){
  clearInterval(timerId);
  timeLeft=GAME_TIME;
  updateTimer();

  timerId=setInterval(()=>{
    timeLeft-=1;
    updateTimer();

    if(timeLeft<=0){
      clearInterval(timerId);
      document.getElementById('resultTitle').textContent='TIME UP';
      finishGame();
    }
  },1000);
}

function updateTimer(){
  document.getElementById('timeText').textContent=timeLeft;
}`
      }
    ],
    checks: ['ゲーム開始時にTIME 90になる', '1秒ずつ減る', '問題が変わっても残り時間が維持される', '10Fクリアでタイマーが止まる', '0秒でTIME UPになりRESULTへ進む']
  },
  {
    number: 7,
    status: '未実装',
    title: '英訳 / 和訳の問題データを接続する',
    intro: 'ja-en.json と en-ja.json は本体に既に問題データがあります。新しく問題ファイルを作らず、game.js の読み込み先を3モード対応にします。',
    changes: [
      {
        file: 'js/game.js',
        placement: '1行目：現在の `const DATA_FILES = { kanji: ... };` をこのブロックに置換',
        note: '本体に存在する3つのJSONへ対応させます。',
        code: `const DATA_FILES={
  kanji:'./data/kanji.json',
  eiyaku:'./data/ja-en.json',
  wayaku:'./data/en-ja.json'
};`
      },
      {
        file: 'js/game.js',
        placement: 'loadQuestions() 内：`fetch(DATA_FILES.kanji)` の1行だけ置換',
        note: 'main.js の selectedMode をそのまま使います。',
        code: `const response=await fetch(DATA_FILES[selectedMode]);`
      }
    ],
    checks: ['漢字はkanji.jsonを読む', '英訳はja-en.jsonを読む', '和訳はen-ja.jsonを読む', '3つの塔で問題内容が変わる']
  },
  {
    number: 8,
    status: '未実装',
    title: 'RESULT詳細を追加する',
    intro: '保存機能は作りません。1回のプレイ結果として正答率とクリア時間だけRESULTへ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: 'RESULTの `.result-grid` 内：MISSの項目の後ろへ追加',
        note: '`<div><span>MISS</span>...` の直後が目印です。',
        code: `<div><span>正答率</span><strong id="resultAccuracy">0%</strong></div>
<div><span>TIME</span><strong id="resultTime">0.0s</strong></div>`
      },
      {
        file: 'js/game.js',
        placement: 'state変数群：TIME用stateの近くへ追加',
        note: 'ゲーム開始からRESULTまでの実時間を測ります。',
        code: `let startedAt=0;`
      },
      {
        file: 'js/game.js',
        placement: 'prepareGame() 内：startGameTimer() の直前へ追加',
        note: 'ゲーム開始時刻を記録します。',
        code: `startedAt=performance.now();`
      },
      {
        file: 'js/game.js',
        placement: '現在の `function finishGame(){...}` を関数ごと置換',
        note: 'localStorageなどの保存処理は入れません。TIME用の clearInterval(timerId) は残します。',
        code: `function finishGame(){
  clearInterval(timerId);
  const elapsed=(performance.now()-startedAt)/1000;
  const answered=correctCount+missCount;
  const accuracy=answered===0 ? 0 : Math.round(correctCount/answered*100);

  document.getElementById('resultCorrect').textContent=correctCount;
  document.getElementById('resultMiss').textContent=missCount;
  document.getElementById('resultAccuracy').textContent=accuracy+'%';
  document.getElementById('resultTime').textContent=elapsed.toFixed(1)+'s';
  showScreen('result');
}`
      }
    ],
    checks: ['RESULTに正解数 / MISS数が出る', '正答率が実プレイと一致する', 'クリア時間またはTIME UPまでの時間が表示される', '記録は保存しない']
  },
  {
    number: 9,
    status: '未実装',
    title: '階移動演出と二重入力防止を追加する',
    intro: 'effects.jsへ演出関数を追加します。現在のGAME背景素材と本体の関数名を変えずに足します。',
    changes: [
      {
        file: 'index.html',
        placement: 'GAMEの `<div class="game-stage">` の直後、`.game-hud` より前へ追加',
        note: 'ゲーム背景を置き換えず、演出レイヤーだけ重ねます。',
        code: `<div id="towerScene" class="tower-scene" aria-hidden="true"></div>`
      },
      {
        file: 'index.html',
        placement: '`<script src="js/game.js"></script>` の直前へ追加',
        note: 'game.js から演出関数を呼ぶため先に読み込みます。',
        code: `<script src="js/effects.js"></script>`
      },
      {
        file: 'js/effects.js',
        placement: '空ファイル：1行目から追加',
        note: '現在の本体では空ファイルなので、そのまま追加できます。',
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
        placement: 'ファイル末尾：既存CSSとSTEP追加CSSの後ろへ追加',
        note: '現在の背景画像指定は消しません。',
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
        placement: 'state変数群：TIME用stateの近くへ追加',
        note: '演出中の二重送信を防ぎます。',
        code: `let isJudging=false;`
      },
      {
        file: 'js/game.js',
        placement: '`answerForm.addEventListener(\'submit\', ... )` をlistener全体で置換',
        note: 'normalizeAnswer() 以下はそのまま残します。',
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
        placement: 'handleCorrect() / handleMiss() 内：judgeMessageを書いた直後、次の問題やRESULT判定へ進む前に追加',
        note: '目印は `judgeMessage.textContent=...` の行です。',
        code: `// handleCorrect()
await flashAnswer('correct');
await playFloorMove('up');

// handleMiss()
await flashAnswer('miss');
await playFloorMove('down');`
      }
    ],
    checks: ['正解で上方向の演出', 'MISSで下方向の演出', '連打で二重判定しない', '既存のGAME背景が消えない']
  },
  {
    number: 10,
    status: '未実装',
    title: '問題追加と最終テストをする',
    intro: '新機能は増やしません。問題JSONを増やし、3モードを最初からRESULTまで通して確認します。',
    changes: [
      {
        file: 'TEST.md',
        placement: '新規ファイル：1行目から追加',
        note: '上から順番に3人で確認します。',
        code: `# TYPE TOWER 最終テスト

- [ ] SELECT背景動画が表示される
- [ ] 3つの塔ボタンが反応する
- [ ] 漢字 / 英訳 / 和訳で別の問題が出る
- [ ] Enterで回答できる
- [ ] 正解で +1F
- [ ] MISSで -1F
- [ ] 1F未満にならない
- [ ] ゲーム開始時にTIME 90になる
- [ ] 問題が変わってもTIMEがリセットされない
- [ ] TIME 0でTIME UPになりRESULTへ進む
- [ ] 10FクリアでもRESULTへ進む
- [ ] RESULTの数字が実プレイと一致する
- [ ] 再挑戦できる
- [ ] 塔選択へ戻れる
- [ ] 連打しても二重判定しない`
      },
      {
        file: 'data/*.json',
        placement: '各JSONの最後の `]` の直前へ追加',
        note: '単純なファイル末尾ではありません。直前の問題との間にカンマを入れます。',
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
    ? '<b>位置は「大体の行番号 + 本体に実在する目印コード」で確認します。</b> 行番号がずれた場合は目印コードを優先してください。'
    : '<b>現在は貼り直し不要です。</b> type-tower-a / main の実装をそのまま使います。';

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
