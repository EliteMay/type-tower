const STEPS = [
  {
    number: 1,
    status: '実装済み',
    title: '3画面とSELECTを作る',
    intro: '現在の type-tower-a / main で完了済みです。今のSELECT背景動画・3つの塔・画面切替をそのまま使います。',
    changes: [],
    checks: ['SELECT / GAME / RESULT の3画面がある', '3つの塔ボタンからGAMEへ切り替わる']
  },
  {
    number: 2,
    status: '実装済み',
    title: '問題をJSONから表示する',
    intro: '問題読み込み、問題プール、ランダム表示は現在の本体へ実装済みです。',
    changes: [],
    checks: ['問題JSONを読み込める', 'GAMEに問題が表示される', '問題プールを使って重複を抑える']
  },
  {
    number: 3,
    status: '実装済み',
    title: '入力と正解 / MISS判定をつなぐ',
    intro: 'answerForm、isAnswerCorrect()、normalizeAnswer()、handleCorrect()、handleMiss() は現在の本体へ実装済みです。',
    changes: [],
    checks: ['Enterで判定できる', '正解 / MISSが表示される', '配列の複数正解にも対応する']
  },
  {
    number: 4,
    status: '実装済み',
    title: '正解 +1F / MISS -1F / 10Fクリア',
    intro: 'floor と updateFloor()、10F判定は現在の本体へ実装済みです。',
    changes: [],
    checks: ['正解で+1F', 'MISSで-1F', '1F未満にならない', '10FでfinishGame()へ進む']
  },
  {
    number: 5,
    status: '本体反映済み',
    title: 'RESULT・再挑戦・塔選択へ戻る',
    intro: 'RESULT表示、正解数 / MISS数、再挑戦、塔選択へ戻る処理は本体へ反映済みです。追加コードはありません。',
    changes: [],
    checks: ['10FでRESULTへ進む', '正解数 / MISS数が表示される', '再挑戦できる', '塔選択へ戻れる']
  },
  {
    number: 6,
    status: '本体反映済み',
    title: 'ゲーム全体TIME 90秒',
    intro: 'ゲーム開始からRESULTまで通しで90秒を減らすタイマーは本体へ反映済みです。問題ごとにはリセットしません。',
    changes: [],
    checks: ['開始時にTIME 90', '1秒ずつ減る', '問題が変わっても残り時間を維持', '0秒でTIME UP → RESULT']
  },
  {
    number: 7,
    status: '本体反映済み / 動作確認待ち',
    title: '英訳 / 和訳の問題データを接続する',
    intro: '本体の DATA_FILES と loadQuestions() は3モード対応済みです。ここではコードを追加せず、3つの塔で実際に問題が切り替わるか確認します。',
    changes: [],
    checks: [
      '漢字の塔 → kanji.json',
      '英訳の塔 → ja-en.json（日本語から英語）',
      '和訳の塔 → en-ja.json（英語から日本語）',
      '入力案内とCLEARタイトルも選択した塔に切り替わる'
    ]
  },
  {
    number: 8,
    status: '作業中',
    title: 'RESULT詳細を追加する',
    intro: 'index.html の正答率 / TIME表示と `let startedAt = 0;` は本体へ追加済みです。残りはゲーム開始時刻の記録と finishGame() の更新です。',
    changes: [
      {
        file: 'js/game.js',
        placement: '約37行目：prepareGame() の `if (loaded) {` 内。`resetQuestionPool();` の直後、`startGameTimer();` の直前へ追加',
        note: '現在の本体は `resetQuestionPool();` → `startGameTimer();` → `showNextQuestion();` の順です。この2行の間へ入れます。',
        code: `startedAt = performance.now();`
      },
      {
        file: 'js/game.js',
        placement: '約139行目：現在の `function finishGame() { ... }` を関数ごと置換',
        note: '目印は `function updateFloor() { ... }` の直後、`function startGameTimer() {` の直前にある finishGame() です。',
        code: `function finishGame() {\n  if (timerId) {\n    clearInterval(timerId);\n    timerId = null;\n  }\n\n  const elapsed = startedAt ? (performance.now() - startedAt) / 1000 : 0;\n  const answered = correctCount + missCount;\n  const accuracy = answered === 0 ? 0 : Math.round(correctCount / answered * 100);\n\n  document.getElementById('resultCorrect').textContent = correctCount;\n  document.getElementById('resultMiss').textContent = missCount;\n  document.getElementById('resultAccuracy').textContent = accuracy + '%';\n  document.getElementById('resultTime').textContent = elapsed.toFixed(1) + 's';\n\n  showScreen('result');\n}`
      }
    ],
    checks: ['RESULTに正解数 / MISS数が出る', '正答率が実プレイと一致する', 'プレイ時間が表示される', '記録は保存しない']
  },
  {
    number: 9,
    status: '未実装',
    title: '階移動演出と二重入力防止を追加する',
    intro: 'effects.jsへ演出関数を追加し、現在の回答判定を壊さず二重送信を防ぎます。',
    changes: [
      {
        file: 'index.html',
        placement: 'GAMEの `<div class="game-stage">` の直後、`.game-hud` より前へ追加',
        note: '現在の背景は消さず、演出レイヤーだけ重ねます。',
        code: `<div id="towerScene" class="tower-scene" aria-hidden="true"></div>`
      },
      {
        file: 'index.html',
        placement: '`<script src="js/game.js"></script>` の直前へ追加',
        note: 'game.js から演出関数を呼ぶため effects.js を先に読み込みます。',
        code: `<script src="js/effects.js"></script>`
      },
      {
        file: 'js/effects.js',
        placement: '空ファイル：1行目から追加',
        note: '現在の本体では空ファイルです。',
        code: `function wait(ms){\n  return new Promise(resolve=>setTimeout(resolve,ms));\n}\n\nasync function playFloorMove(direction){\n  const scene=document.getElementById('towerScene');\n  const className=direction==='up' ? 'move-up' : 'move-down';\n  scene.classList.remove('move-up','move-down');\n  void scene.offsetWidth;\n  scene.classList.add(className);\n  await wait(340);\n  scene.classList.remove(className);\n}\n\nasync function flashAnswer(type){\n  const card=document.getElementById('questionCard');\n  const className=type==='correct' ? 'is-correct' : 'is-miss';\n  card.classList.remove('is-correct','is-miss');\n  void card.offsetWidth;\n  card.classList.add(className);\n  await wait(250);\n  card.classList.remove(className);\n}`
      },
      {
        file: 'css/style.css',
        placement: 'ファイル末尾へ追加',
        note: '現在の背景画像指定は変更しません。',
        code: `.tower-scene { position:absolute; inset:0; pointer-events:none; }\n.tower-scene.move-up { animation:floorUp .34s ease; }\n.tower-scene.move-down { animation:floorDown .34s ease; }\n.question-card.is-correct { animation:correctFlash .25s ease; }\n.question-card.is-miss { animation:missFlash .25s ease; }\n@keyframes floorUp { 50% { transform:translateY(18px); } }\n@keyframes floorDown { 50% { transform:translateY(-18px); } }\n@keyframes correctFlash { 50% { box-shadow:0 0 0 8px rgba(70,180,100,.35); } }\n@keyframes missFlash { 50% { box-shadow:0 0 0 8px rgba(210,70,70,.3); } }`
      },
      {
        file: 'js/game.js',
        placement: 'state変数群：`let startedAt = 0;` の近くへ追加',
        note: '判定処理中のEnter連打を防ぎます。',
        code: `let isJudging = false;`
      },
      {
        file: 'js/game.js',
        placement: '現在の `answerForm.addEventListener(\'submit\', ... )` をlistener全体で置換',
        note: '現在の rawInput / isAnswerCorrect() / 複数正解対応を残します。',
        code: `answerForm.addEventListener('submit', async event => {\n  event.preventDefault();\n  if (!currentQuestion || isJudging) return;\n\n  const rawInput = answerInput.value.trim();\n  const userInputValue = normalizeAnswer(rawInput);\n  if (!rawInput) return;\n\n  isJudging = true;\n  try {\n    const isCorrect = isAnswerCorrect(userInputValue, currentQuestion.answer, rawInput);\n    if (isCorrect) {\n      await handleCorrect();\n    } else {\n      await handleMiss();\n    }\n  } finally {\n    isJudging = false;\n  }\n});`
      },
      {
        file: 'js/game.js',
        placement: 'handleCorrect() / handleMiss() 内：`judgeMessage.textContent = ...` の直後へ追加',
        note: '次の問題へ進む前に短い判定・階移動演出を入れます。',
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
        code: `# TYPE TOWER 最終テスト\n\n- [ ] SELECT背景動画が表示される\n- [ ] 3つの塔ボタンが反応する\n- [ ] 漢字 / 英訳 / 和訳で別の問題が出る\n- [ ] Enterで回答できる\n- [ ] 正解で +1F\n- [ ] MISSで -1F\n- [ ] 1F未満にならない\n- [ ] ゲーム開始時にTIME 90になる\n- [ ] 問題が変わってもTIMEがリセットされない\n- [ ] TIME 0でTIME UPになりRESULTへ進む\n- [ ] 10FクリアでもRESULTへ進む\n- [ ] RESULTの数字が実プレイと一致する\n- [ ] 再挑戦できる\n- [ ] 塔選択へ戻れる\n- [ ] 連打しても二重判定しない`
      },
      {
        file: 'data/*.json',
        placement: '各JSONの最後の `]` の直前へ追加',
        note: '直前の問題との間にカンマを入れます。',
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
