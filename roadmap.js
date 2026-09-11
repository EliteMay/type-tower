const boxes=[...document.querySelectorAll('.stage-check input[type="checkbox"]')];
const progressText=document.getElementById('progressText');
const progressBar=document.getElementById('progressBar');
const resetButton=document.getElementById('resetChecks');
const nextStepLabel=document.getElementById('nextStepLabel');
const nextStepTitle=document.getElementById('nextStepTitle');
const nextStepText=document.getElementById('nextStepText');
const nextStepLink=document.getElementById('nextStepLink');
const storageKey='typeTowerRoadmapChecksV8';
const legacyKeys=['typeTowerRoadmapChecksV7','typeTowerRoadmapChecksV6','typeTowerRoadmapChecksV5'];
const implementedKeys=new Set(['step1','step2','step3','step4']);

const steps=[
  {title:'SELECTと画面切替を確認する',text:'HOME→SELECT→GAME SETTING→GAMEの画面切替を確認する。'},
  {title:'漢字問題を表示する',text:'レベル別の漢字データを読み込み、問題を1問ずつ表示する。'},
  {title:'タイピング判定を完成させる',text:'Enterで正解かMISSかを判定し、次の問題へ進む。'},
  {title:'タワーの上下とクリアをつなぐ',text:'通常モードで正解+1F、MISS-1F、10Fの問題を正解したらRESULTへ進む。'},
  {title:'RESULTの動作確認をする',text:'正解数・MISS数・正答率・TIME、再挑戦、SELECTへ戻る動作を実ブラウザで確認する。'},
  {title:'MODE / LEVEL / TIMEを確認する',text:'NORMAL / ENDLESS、Lv.1〜3、60 / 90 / 120秒 / 無制限を確認する。'},
  {title:'3つの塔の問題切替を確認する',text:'漢字は漢字データ、英訳・和訳は共有英単語データを正しい向きで使うことを確認する。'},
  {title:'ENDLESSとRESULT詳細を確認する',text:'ENDLESSが10Fで終わらず、時間切れまたは手動終了でRESULTへ進むことを確認する。'},
  {title:'演出と二重入力防止を確認する',text:'正解 / MISSの演出と、Enter連打でも二重判定しないことを確認する。'},
  {title:'問題追加・最終テスト・発表準備',text:'HOMEから3モードのRESULTまで通して確認し、重大バグを直して発表準備へ進む。'}
];

function setStepStatus(stepNumber,text){
  const title=document.querySelector(`#step-${stepNumber} .road-title`);
  if(!title) return;
  let status=title.querySelector('.status');
  if(!status){
    status=document.createElement('span');
    status.className='status';
    title.appendChild(status);
  }
  status.textContent=text;
}

function syncCurrentProjectState(){
  const heroLead=document.querySelector('.hero-copy .lead');
  if(heroLead){
    heroLead.textContent='現在のゲーム本体に合わせて、画面構成・設定・作る順番・完成条件をまとめた制作方針ページです。';
  }

  const homePlan=document.getElementById('home-screen-plan');
  if(homePlan && !document.getElementById('current-state')){
    const section=document.createElement('section');
    section.className='section section-soft';
    section.id='current-state';
    section.innerHTML=`
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">CURRENT REPOSITORY STATE</p>
          <h2>GAME SETTING・LEVEL・ENDLESSまで本体へ反映済み</h2>
          <p>2026-09-11時点の type-tower-a / main を基準にしています。Static / Logic Validationは済んでいますが、実ブラウザPlaytestと最終Visual確認はまだ必要です。</p>
        </div>
        <div class="policy-grid">
          <article class="policy-card primary-policy"><span class="policy-label">FLOW</span><h3>HOME → SELECT → SETTING → GAME → RESULT</h3><p>塔を選んだあとにGAME SETTINGを開き、MODE・LEVEL・TIMEを決めてからゲームを開始します。</p></article>
          <article class="policy-card"><span class="policy-label">MODE</span><h3>NORMAL / ENDLESS</h3><p>NORMALは10Fの問題正解でCLEAR。ENDLESSは10Fでは終わらず、時間切れか手動終了まで続きます。</p></article>
          <article class="policy-card"><span class="policy-label">LEVEL</span><h3>Lv.1 / Lv.2 / Lv.3</h3><p>時間ではなく問題内容の難しさを3段階に分けます。漢字・英単語とも各レベル30問です。</p></article>
          <article class="policy-card"><span class="policy-label">TIME</span><h3>60 / 90 / 120秒 / 無制限</h3><p>初期値は90秒。問題が変わっても時間はリセットせず、無制限では∞を表示します。</p></article>
          <article class="policy-card"><span class="policy-label">LEARNING</span><h3>漢字は外国人、英訳・和訳は日本人向け</h3><p>漢字は読みを練習。英訳・和訳は文章ではなく英単語・語彙問題として扱います。</p></article>
          <article class="policy-card"><span class="policy-label">DATA</span><h3>英訳・和訳は同じ単語データを共有</h3><p>english-words.json の日本語と英語を、選んだ塔に応じて逆向きに出題します。</p></article>
          <article class="policy-card"><span class="policy-label">NOT NEEDED</span><h3>COMBO・ゲーム記録保存は作らない</h3><p>LEVELは今回追加しましたが、COMBOやlocalStorage等を使ったプレイ履歴・ハイスコア保存は要件外です。</p></article>
        </div>
      </div>`;
    homePlan.before(section);
  }

  if(homePlan && !document.getElementById('game-setting-plan')){
    const setting=document.createElement('section');
    setting.className='section wrap';
    setting.id='game-setting-plan';
    setting.innerHTML=`
      <div class="section-head">
        <p class="eyebrow">GAME SETTING</p>
        <h2>塔を選んだあとに遊び方を決める</h2>
        <p>普通に遊ぶ場合は初期値の NORMAL / Lv.2 / 90秒 のままSTARTでき、細かく変えたい人だけ設定を触ります。</p>
      </div>
      <div class="policy-grid">
        <article class="policy-card primary-policy"><span class="policy-label">MODE</span><h3>通常 / ENDLESS</h3><p>通常は塔を登って10F CLEAR。ENDLESSは正解数を伸ばし続けます。</p></article>
        <article class="policy-card"><span class="policy-label">LEVEL</span><h3>基礎 / 標準 / 発展</h3><p>Lv.1は初心者向け、Lv.2は標準、Lv.3は難しい語彙・漢字を出題します。</p></article>
        <article class="policy-card"><span class="policy-label">TIME</span><h3>60 / 90 / 120 / ∞</h3><p>難易度とは独立して選択します。無制限ENDLESSは手動終了できます。</p></article>
      </div>`;
    homePlan.before(setting);
  }

  if(homePlan && !document.getElementById('future-home-plan')){
    const futureHome=document.createElement('section');
    futureHome.className='section wrap';
    futureHome.id='future-home-plan';
    futureHome.innerHTML=`
      <div class="section-head">
        <p class="eyebrow">HOME / TAB ICON</p>
        <h2>HOMEは実装済み。ロゴはタブ用に使う</h2>
        <p>HOMEは背景・大きなTYPE TOWERタイトル・大きなSTARTボタンで構成します。ロゴはHOMEには出さず、faviconとして使います。</p>
      </div>
      <div class="home-flow" aria-label="HOMEからGAME開始までの流れ">
        <div><span>STEP A</span><b>HOME</b><p>TYPE TOWERタイトルとSTARTを表示。</p></div>
        <div><span>STEP B</span><b>SELECT</b><p>漢字・英訳・和訳から塔を選ぶ。</p></div>
        <div><span>STEP C</span><b>SETTING</b><p>MODE・LEVEL・TIMEを決める。</p></div>
        <div><span>STEP D</span><b>GAME</b><p>設定した内容でゲーム開始。</p></div>
      </div>`;
    homePlan.before(futureHome);
  }

  const specCards=[...document.querySelectorAll('#home-screen-plan .home-spec-card')];
  if(specCards[0]){specCards[0].querySelector('h3').textContent='SELECT背景は動画を維持';specCards[0].querySelector('p').textContent='assets/videos/menu-bg.mp4 を画面全体でループ表示します。';}
  if(specCards[1]){specCards[1].querySelector('h3').textContent='3つの塔を横並び';specCards[1].querySelector('p').textContent='漢字・英訳・和訳の3つを選び、次にGAME SETTINGへ進みます。';}
  if(specCards[2]){specCards[2].querySelector('h3').textContent='塔名はtower-image内を正とする';specCards[2].querySelector('p').textContent='本体の .tower-image 内に表示している塔名を基準にします。';}
  if(specCards[3]){specCards[3].querySelector('h3').textContent='選択モードをGAME背景にも使う';specCards[3].querySelector('p').textContent='selectedModeを使い、漢字=black.png / 英訳=white.png / 和訳=blue.pngへ切り替えます。';}

  setStepStatus(1,'実装済み');
  setStepStatus(2,'実装済み');
  setStepStatus(3,'実装済み');
  setStepStatus(4,'実装済み');
  setStepStatus(5,'本体反映済み / 動作確認待ち');
  setStepStatus(6,'本体反映済み / 動作確認待ち');
  setStepStatus(7,'本体反映済み / 動作確認待ち');
  setStepStatus(8,'本体反映済み / 動作確認待ち');
  setStepStatus(9,'本体反映済み / 動作確認待ち');

  const step5=document.getElementById('step-5');
  if(step5){
    step5.querySelector('h3').textContent='RESULT・再挑戦・塔選択へ戻る';
    step5.querySelector('.why').textContent='RESULTの基本処理は本体反映済み。NORMAL / ENDLESSの両方から正しいRESULTへ進むか実ブラウザで確認する。';
    step5.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>正解数 / MISS数 / 正答率 / TIME</li><li>再挑戦</li><li>塔選択へ戻る</li></ul></div><div><b>確認すること</b><ul><li>NORMALのCLEAR</li><li>TIME UP</li><li>ENDLESSの手動終了</li><li>再挑戦 / SELECTへ戻る</li></ul></div>';
  }

  const step6=document.getElementById('step-6');
  if(step6){
    step6.querySelector('h3').textContent='MODE・LEVEL・TIME';
    step6.querySelector('.why').textContent='GAME SETTINGからNORMAL / ENDLESS、Lv.1〜3、60 / 90 / 120秒 / 無制限を選べるようにした。時間と問題難易度は別設定にする。';
    step6.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>NORMAL / ENDLESS</li><li>Lv.1 / Lv.2 / Lv.3</li><li>60 / 90 / 120秒 / 無制限</li></ul></div><div><b>確認すること</b><ul><li>初期値はNORMAL / Lv.2 / 90秒</li><li>無制限は∞表示</li><li>問題が変わってもTIME維持</li><li>ENDLESSは10Fで終了しない</li></ul></div>';
  }

  const step7=document.getElementById('step-7');
  if(step7){
    step7.querySelector('h3').textContent='3つの塔 + レベル別問題データ';
    step7.querySelector('.why').textContent='漢字はkanji-levels.json、英訳・和訳はenglish-words.jsonを共有し、selectedModeとlevelで問題を切り替える。';
    step7.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>kanji → kanji-levels.json</li><li>eiyaku / wayaku → english-words.json</li><li>各Lv.30問</li></ul></div><div><b>確認すること</b><ul><li>漢字は読み問題</li><li>英訳は日本語→英単語</li><li>和訳は英単語→日本語</li><li>Lv.1〜3で内容が変わる</li></ul></div>';
  }

  const step8=document.getElementById('step-8');
  if(step8){
    step8.querySelector('h3').textContent='ENDLESS + RESULT詳細';
    step8.querySelector('.why').textContent='ENDLESSは10Fで終わらず、時間切れまたは手動終了でRESULTへ進む。RESULTには選んだMODE / LEVEL / TIMEも表示する。';
    step8.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>ENDLESS正解数表示</li><li>手動終了ボタン</li><li>RESULT設定表示</li><li>正答率 / プレイ時間</li></ul></div><div><b>確認すること</b><ul><li>10問以上正解しても継続</li><li>TIME UPで終了</li><li>無制限でも手動終了可能</li><li>RESULTの数字が一致</li></ul></div>';
  }

  const step9=document.getElementById('step-9');
  if(step9){
    step9.querySelector('h3').textContent='階移動演出 + 二重入力防止';
    step9.querySelector('.why').textContent='既存演出を維持しつつ、関数名をgameJunbi / seikaiSyori / floorMove等へ整理した。実ブラウザで演出と二重入力防止を確認する。';
    step9.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>正解 / MISSフラッシュ</li><li>NORMALの階移動</li><li>isJudgingによる二重判定防止</li></ul></div><div><b>確認すること</b><ul><li>正解で上方向</li><li>MISSで下方向</li><li>ENDLESSで不要な階表示が出ない</li><li>Enter連打で二重判定しない</li></ul></div>';
  }

  const finishCards=[...document.querySelectorAll('#finish .finish-grid article')];
  if(finishCards[0]) finishCards[0].innerHTML='<b>HOME / 3つの塔 / SETTING</b><p>HOMEから塔を選び、MODE・LEVEL・TIMEを設定して3モードすべて開始できる。</p>';
  if(finishCards[2]) finishCards[2].innerHTML='<b>ルール</b><p>NORMALの10F CLEAR、ENDLESS、60 / 90 / 120秒 / 無制限が想定どおり動く。</p>';
  if(finishCards[3]) finishCards[3].innerHTML='<b>RESULT</b><p>正解数、MISS、正答率、プレイ時間、選択設定が実プレイと合う。ゲーム記録保存は不要。</p>';

  const scheduleBuild=[...document.querySelectorAll('.schedule-item.build p')];
  if(scheduleBuild[1]) scheduleBuild[1].textContent='RESULT、3モード、演出、GAME SETTING、LEVEL、ENDLESS、TIME選択まで本体へ反映。';
  const schedulePolish=document.querySelector('.schedule-item.polish p');
  if(schedulePolish) schedulePolish.textContent='HOME / SELECT / SETTING / GAME / RESULTの見た目、問題追加、実ブラウザPlaytestを仕上げる。';
}

function loadSaved(){
  let saved=null;
  for(const key of [storageKey,...legacyKeys]){
    try{
      const value=JSON.parse(localStorage.getItem(key));
      if(value){saved=value;break;}
    }catch(error){console.warn('進捗を読み込めませんでした',error);}
  }

  boxes.forEach(box=>{
    if(implementedKeys.has(box.dataset.key)){
      box.checked=true;
      box.disabled=true;
      return;
    }
    if(Array.isArray(saved)) box.checked=saved.includes(box.dataset.key);
    else if(saved && typeof saved==='object') box.checked=Boolean(saved[box.dataset.key]);
  });
}

function save(){
  const value={};
  boxes.forEach(box=>{value[box.dataset.key]=box.checked;});
  localStorage.setItem(storageKey,JSON.stringify(value));
}

function render(){
  const done=boxes.filter(box=>box.checked).length;
  const percent=Math.round(done/boxes.length*100);
  if(progressText) progressText.textContent=`${percent}% (${done}/${boxes.length})`;
  if(progressBar) progressBar.style.width=percent+'%';

  const nextIndex=boxes.findIndex(box=>!box.checked);
  if(nextIndex===-1){
    if(nextStepLabel) nextStepLabel.textContent='COMPLETE';
    if(nextStepTitle) nextStepTitle.textContent='全STEP完了';
    if(nextStepText) nextStepText.textContent='HOMEから3モードを通しプレイし、NORMAL / ENDLESS / LEVEL / TIMEと発表準備を最終確認する。';
    if(nextStepLink) nextStepLink.href='#finish';
    return;
  }

  const step=steps[nextIndex];
  if(nextStepLabel) nextStepLabel.textContent='STEP '+(nextIndex+1);
  if(nextStepTitle) nextStepTitle.textContent=step.title;
  if(nextStepText) nextStepText.textContent=step.text;
  if(nextStepLink) nextStepLink.href='#step-'+(nextIndex+1);
}

syncCurrentProjectState();
loadSaved();
render();

boxes.forEach(box=>{
  box.addEventListener('change',()=>{
    save();
    render();
  });
});

if(resetButton){
  resetButton.addEventListener('click',()=>{
    boxes.forEach(box=>{
      if(!implementedKeys.has(box.dataset.key)) box.checked=false;
    });
    save();
    render();
  });
}
