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
    intro: '現在の本体で完了済みです。game.js の loadQuestions() / showNextQuestion() を正として扱います。',
    changes: [],
    checks: ['data/kanji.json を読み込める', 'GAMEに問題が表示される', '別の問題へ切り替わる']
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
    intro: '現在の本体で完了済みです。floor と updateFloor()、10FでRESULTへ切り替える処理を基準にします。',
    changes: [],
    checks: ['正解で+1F', 'MISSで-1F', '1F未満にならない', '10FでRESULTへ切り替わる']
  },
  {
    number: 5,
    status: '次',
    title: 'RESULTを作って漢字の塔を最後までつなぐ',
    intro: 'ここからが次の作業です。現在の本体コードを残し、RESULT表示と正解数 / MISS数だけ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: '約54行目：`<section data-screen="result" hidden></section>` をこのブロックに置換',
        note: 'SELECT / GAME部分は触りません。現在の本体では空のRESULT sectionが目印です。',
        code: `<section data-screen="result" hidden>\n  <div class="result-panel">\n    <p class="result-kicker">TOWER CLEAR</p>\n    <h1 id="resultTitle">漢字の塔 CLEAR</h1>\n    <div class="result-grid">\n      <div><span>正解</span><strong id="resultCorrect">0</strong></div>\n      <div><span>MISS</span><strong id="resultMiss">0</strong></div>\n    </div>\n    <div class="result-actions">\n      <button id="retryButton">もう一度挑戦</button>\n      <button id="resultBackButton">塔選択へ戻る</button>\n    </div>\n  </div>\n</section>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾（現在約165行目以降）：`#floorText { ... }` の後ろへ追加',
        note: '既存のSELECT / GAME背景CSSは変更しません。',
        code: `[data-screen="result"] { display:grid; place-items:center; padding:32px; }\n.result-panel {\n  width:min(620px,100%);\n  padding:32px;\n  border:2px solid #d8ae58;\n  border-radius:16px;\n  background:#fff;\n  text-align:center;\n}\n.result-kicker { margin:0 0 6px; font-weight:900; color:#7b673d; }\n.result-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin:24px 0; }\n.result-grid div { padding:18px; border:1px solid #ddd; border-radius:10px; }\n.result-grid span { display:block; color:#666; }\n.result-grid strong { display:block; margin-top:4px; font-size:2rem; }\n.result-actions { display:flex; justify-content:center; gap:10px; }`
      },
      {
        file: 'js/game.js',
        placement: '約5行目：`let floor=1;` の直後に追加',
        note: '本体のstate変数群へ正解数とMISS数を足します。',
        code: `let correctCount=0;\nlet missCount=0;`
      },
      {
        file: 'js/game.js',
        placement: '約9行目：prepareGame() 内の `updateFloor();` の直後に追加',
        note: '再挑戦時も0から始まるようにします。',
        code: `correctCount=0;\nmissCount=0;`
      },
      {
        file: 'js/game.js',
        placement: '約56行目：`async function handleCorrect(){` の直後に追加',
        note: '正解時の既存 floor 処理より前に1行追加します。',
        code: `correctCount+=1;`
      },
      {
        file: 'js/game.js',
        placement: '約67行目：`async function handleMiss(){` の直後に追加',
        note: 'MISS時の既存 floor 処理より前に1行追加します。',
        code: `missCount+=1;`
      },
      {
        file: 'js/game.js',
        placement: '約61行目：`showScreen(\'result\');` の1行だけを `finishGame();` に置換',
        note: '10F判定の if(floor>=10) と return はそのまま残します。',
        code: `finishGame();`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾（現在約79行目以降）：updateFloor() の閉じかっこの後ろへ追加',
        note: 'RESULTへ数字を入れてから画面を切り替えます。',
        code: `function finishGame(){\n  document.getElementById('resultCorrect').textContent=correctCount;\n  document.getElementById('resultMiss').textContent=missCount;\n  showScreen('result');\n}`
      },
      {
        file: 'js/main.js',
        placement: 'ファイル末尾（現在約25行目以降）：最後の `showScreen(\'select\');` の後ろへ追加',
        note: 'RESULTの2ボタンだけ追加します。既存の gameBackButton はそのまま残します。',
        code: `document.getElementById('retryButton').addEventListener('click',()=>{\n  startGame(selectedMode);\n});\n\ndocument.getElementById('resultBackButton').addEventListener('click',()=>{\n  showScreen('select');\n});`
      }
    ],
    checks: ['10FでRESULTへ進む', '正解数 / MISS数が表示される', '再挑戦できる', '塔選択へ戻れる']
  },
  {
    number: 6,
    status: '未実装',
    title: 'TIME（制限時間）を追加する',
    intro: 'COMBOと難易度は作りません。各問題に固定の制限時間だけ追加します。',
    changes: [
      {
        file: 'index.html',
        placement: '約42行目：`.hud-top` の中、`<strong id="floorText">1F</strong>` の後ろへ追加',
        note: '現在は .hud-top が1行なので、divを分けて書いても構いません。',
        code: `<div class="timer-box">TIME <strong id="timeText">10</strong></div>`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾：STEP 5で追加したRESULT用CSSの後ろへ追加',
        note: 'TIME表示専用です。',
        code: `.timer-box {\n  padding:8px 12px;\n  border-radius:8px;\n  background:rgba(255,255,255,.9);\n  font-weight:900;\n}`
      },
      {
        file: 'js/game.js',
        placement: '約5行目：`let floor=1;` の後ろにあるstate変数群へ追加',
        note: '制限時間は10秒固定です。',
        code: `const QUESTION_TIME=10;\nlet timerId=null;\nlet timeLeft=QUESTION_TIME;`
      },
      {
        file: 'js/game.js',
        placement: '約9行目：prepareGame() 内の `updateFloor();` の直後へ追加',
        note: '再挑戦前に前のタイマーを止めます。',
        code: `clearInterval(timerId);`
      },
      {
        file: 'js/game.js',
        placement: '約33行目：showNextQuestion() 内の `document.getElementById(\'answerInput\').focus();` の直後へ追加',
        note: '問題が変わるたびに10秒へ戻します。',
        code: `startTimer();`
      },
      {
        file: 'js/game.js',
        placement: 'handleCorrect() と handleMiss() の先頭：各関数の `{` の直後へ追加',
        note: '回答が確定した時点でその問題のタイマーを止めます。',
        code: `clearInterval(timerId);`
      },
      {
        file: 'js/game.js',
        placement: 'ファイル末尾：finishGame() の後ろへ追加',
        note: '0秒になったらMISSとして既存の handleMiss() を使います。',
        code: `function startTimer(){\n  clearInterval(timerId);\n  timeLeft=QUESTION_TIME;\n  updateTimer();\n  timerId=setInterval(async()=>{\n    timeLeft-=1;\n    updateTimer();\n    if(timeLeft<=0){\n      clearInterval(timerId);\n      await handleMiss();\n    }\n  },1000);\n}\n\nfunction updateTimer(){\n  document.getElementById('timeText').textContent=timeLeft;\n}`
      }
    ],
    checks: ['問題表示時にTIME 10から始まる', '1秒ずつ減る', '0秒でMISSになる', '次の問題で10秒へ戻る']
  },
  {
    number: 7,
    status: '未実装',
    title: '英訳 / 和訳の問題データを接続する',
    intro: 'ja-en.json と en-ja.json は本体に既に問題データがあります。新しく問題ファイルを作らず、game.js の読み込み先だけ3モード対応にします。',
    changes: [
      {
        file: 'js/game.js',
        placement: '1行目：`const DATA_FILES={kanji:\'./data/kanji.json\'};` を置換',
        note: '本体に存在する3つのJSONへ対応させます。',
        code: `const DATA_FILES={\n  kanji:'./data/kanji.json',\n  eiyaku:'./data/ja-en.json',\n  wayaku:'./data/en-ja.json'\n};`
      },
      {
        file: 'js/game.js',
        placement: '現在約16行目：loadQuestions() 内の `fetch(DATA_FILES.kanji)` の1行だけ置換',
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
        placement: 'STEP 5で作った `.result-grid` 内：MISSの項目の後ろへ追加',
        note: '`<div><span>MISS</span>...` の直後が目印です。',
        code: `<div><span>正答率</span><strong id="resultAccuracy">0%</strong></div>\n<div><span>TIME</span><strong id="resultTime">0.0s</strong></div>`
      },
      {
        file: 'js/game.js',
        placement: 'state変数群：`let floor=1;` の近くへ追加',
        note: 'ゲーム開始からクリアまでの時間を測ります。',
        code: `let startedAt=0;`
      },
      {
        file: 'js/game.js',
        placement: 'prepareGame() 内：`updateFloor();` の直後へ追加',
        note: 'ゲーム開始時刻を記録します。',
        code: `startedAt=performance.now();`
      },
      {
        file: 'js/game.js',
        placement: 'STEP 5で追加した `function finishGame(){...}` を関数ごと置換',
        note: 'localStorageなどの保存処理は入れません。',
        code: `function finishGame(){\n  clearInterval(timerId);\n  const elapsed=(performance.now()-startedAt)/1000;\n  const answered=correctCount+missCount;\n  const accuracy=answered===0 ? 0 : Math.round(correctCount/answered*100);\n\n  document.getElementById('resultCorrect').textContent=correctCount;\n  document.getElementById('resultMiss').textContent=missCount;\n  document.getElementById('resultAccuracy').textContent=accuracy+'%';\n  document.getElementById('resultTime').textContent=elapsed.toFixed(1)+'s';\n  showScreen('result');\n}`
      }
    ],
    checks: ['RESULTに正解数 / MISS数が出る', '正答率が実プレイと一致する', 'クリア時間が表示される', '記録は保存しない']
  },
  {
    number: 9,
    status: '未実装',
    title: '階移動演出と二重入力防止を追加する',
    intro: 'effects.jsへ演出関数を追加します。現在のGAME背景素材と関数名を変えずに足します。',
    changes: [
      {
        file: 'index.html',
        placement: '約40行目：`<div class="game-stage">` の直後、`.game-hud` より前へ追加',
        note: 'ゲーム背景を置き換えず、演出レイヤーだけ重ねます。',
        code: `<div id="towerScene" class="tower-scene" aria-hidden="true"></div>`
      },
      {
        file: 'index.html',
        placement: '約56行目：`<script src="js/game.js"></script>` の直前へ追加',
        note: 'game.js から演出関数を呼ぶため先に読み込みます。',
        code: `<script src="js/effects.js"></script>`
      },
      {
        file: 'js/effects.js',
        placement: '空ファイル：1行目から追加',
        note: '現在の本体では空ファイルなので、そのまま追加できます。',
        code: `function wait(ms){\n  return new Promise(resolve=>setTimeout(resolve,ms));\n}\n\nasync function playFloorMove(direction){\n  const scene=document.getElementById('towerScene');\n  const className=direction==='up' ? 'move-up' : 'move-down';\n  scene.classList.remove('move-up','move-down');\n  void scene.offsetWidth;\n  scene.classList.add(className);\n  await wait(340);\n  scene.classList.remove(className);\n}\n\nasync function flashAnswer(type){\n  const card=document.getElementById('questionCard');\n  const className=type==='correct' ? 'is-correct' : 'is-miss';\n  card.classList.remove('is-correct','is-miss');\n  void card.offsetWidth;\n  card.classList.add(className);\n  await wait(250);\n  card.classList.remove(className);\n}`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾：既存CSSとSTEP追加CSSの後ろへ追加',
        note: '現在の背景画像指定は消しません。',
        code: `.tower-scene { position:absolute; inset:0; pointer-events:none; }\n.tower-scene.move-up { animation:floorUp .34s ease; }\n.tower-scene.move-down { animation:floorDown .34s ease; }\n.question-card.is-correct { animation:correctFlash .25s ease; }\n.question-card.is-miss { animation:missFlash .25s ease; }\n@keyframes floorUp { 50% { transform:translateY(18px); } }\n@keyframes floorDown { 50% { transform:translateY(-18px); } }\n@keyframes correctFlash { 50% { box-shadow:0 0 0 8px rgba(70,180,100,.35); } }\n@keyframes missFlash { 50% { box-shadow:0 0 0 8px rgba(210,70,70,.3); } }`
      },
      {
        file: 'js/game.js',
        placement: 'state変数群：`let floor=1;` の近くへ追加',
        note: '演出中の二重送信を防ぎます。',
        code: `let isJudging=false;`
      },
      {
        file: 'js/game.js',
        placement: '現在約40〜50行目：`answerForm.addEventListener(\'submit\', ... )` をlistener全体で置換',
        note: 'normalizeAnswer() 以下はそのまま残します。',
        code: `answerForm.addEventListener('submit',async event=>{\n  event.preventDefault();\n  if(!currentQuestion || isJudging) return;\n  const answer=normalizeAnswer(answerInput.value);\n  if(!answer) return;\n\n  isJudging=true;\n  try{\n    if(answer===normalizeAnswer(currentQuestion.answer)){\n      await handleCorrect();\n    }else{\n      await handleMiss();\n    }\n  }finally{\n    isJudging=false;\n  }\n});`
      },
      {
        file: 'js/game.js',
        placement: 'handleCorrect() / handleMiss() 内：judgeMessageを書いた直後、次の問題やRESULT判定へ進む前に追加',
        note: '目印は `judgeMessage.textContent=...` の行です。',
        code: `// handleCorrect()\nawait flashAnswer('correct');\nawait playFloorMove('up');\n\n// handleMiss()\nawait flashAnswer('miss');\nawait playFloorMove('down');`
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
        code: `# TYPE TOWER 最終テスト\n\n- [ ] SELECT背景動画が表示される\n- [ ] 3つの塔ボタンが反応する\n- [ ] 漢字 / 英訳 / 和訳で別の問題が出る\n- [ ] Enterで回答できる\n- [ ] 正解で +1F\n- [ ] MISSで -1F\n- [ ] 1F未満にならない\n- [ ] TIME 0でMISSになる\n- [ ] 10FでRESULTへ進む\n- [ ] RESULTの数字が実プレイと一致する\n- [ ] 再挑戦できる\n- [ ] 塔選択へ戻れる\n- [ ] 連打しても二重判定しない`
      },
      {
        file: 'data/*.json',
        placement: '各JSONの最後の `]` の直前へ追加',
        note: '単純なファイル末尾ではありません。直前の問題との間にカンマを入れます。',
        code: `,\n{ "question": "追加する問題", "answer": "こたえ" }\n]`
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
