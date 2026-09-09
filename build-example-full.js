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
    intro: 'floor と updateFloor()、10F判定は現在の本体へ実装済みです。9Fから10Fへ進み、10Fの問題を正解したらクリアです。',
    changes: [],
    checks: ['正解で+1F', 'MISSで-1F', '1F未満にならない', '10Fの問題を正解するとfinishGame()へ進む']
  },
  {
    number: 5,
    status: '本体反映済み',
    title: 'RESULT・再挑戦・塔選択へ戻る',
    intro: 'RESULT表示、正解数 / MISS数、再挑戦、塔選択へ戻る処理は本体へ反映済みです。追加コードはありません。',
    changes: [],
    checks: ['10Fの問題を正解するとRESULTへ進む', '正解数 / MISS数が表示される', '再挑戦できる', '塔選択へ戻れる']
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
    status: '本体反映済み / 動作確認待ち',
    title: 'RESULT詳細を確認する',
    intro: '正答率とプレイ時間をRESULTへ出すコードは本体へ反映済みです。もうコードを貼り足さず、実プレイと数字が一致するか確認します。',
    changes: [],
    checks: ['RESULTに正解数 / MISS数が出る', '正答率が実プレイと一致する', 'プレイ時間が表示される', '記録は保存しない']
  },
  {
    number: 9,
    status: '本体反映済み / 動作確認待ち',
    title: '階移動演出と二重入力防止を確認する',
    intro: 'このページに表示していたSTEP 9の追加コードはすべて本体へ反映済みです。正解演出とMISS演出が同じ関数へ入っていた配線ミスも本体側で修正済みです。HOMEはSTEP 9とは別の後工程として方針ページに残します。',
    changes: [],
    checks: ['正解で正解演出 + 上方向の階移動だけが出る', 'MISSでMISS演出 + 下方向の階移動だけが出る', 'Enter連打で二重判定しない', '既存のGAME背景が消えない']
  },
  {
    number: 10,
    status: '未実装',
    title: '問題追加と最終テストをする',
    intro: '新機能は増やしません。問題JSONを増やし、3モードを最初からRESULTまで通して確認します。HOMEはこのSTEPとは別に、最後の仕上げとして追加予定です。',
    changes: [
      {
        file: 'TEST.md',
        placement: '新規ファイル：1行目から追加',
        note: '上から順番に3人で確認します。',
        code: `# TYPE TOWER 最終テスト\n\n- [ ] SELECT背景動画が表示される\n- [ ] 3つの塔ボタンが反応する\n- [ ] 漢字 / 英訳 / 和訳で別の問題が出る\n- [ ] Enterで回答できる\n- [ ] 正解で +1F\n- [ ] MISSで -1F\n- [ ] 1F未満にならない\n- [ ] ゲーム開始時にTIME 90になる\n- [ ] 問題が変わってもTIMEがリセットされない\n- [ ] TIME 0でTIME UPになりRESULTへ進む\n- [ ] 9F正解で10Fへ進む\n- [ ] 10Fの問題を正解するとRESULTへ進む\n- [ ] RESULTの数字が実プレイと一致する\n- [ ] 正解で上方向演出だけが出る\n- [ ] MISSで下方向演出だけが出る\n- [ ] 再挑戦できる\n- [ ] 塔選択へ戻れる\n- [ ] 連打しても二重判定しない`
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
