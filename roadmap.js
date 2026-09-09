const boxes=[...document.querySelectorAll('.stage-check input[type="checkbox"]')];
const progressText=document.getElementById('progressText');
const progressBar=document.getElementById('progressBar');
const resetButton=document.getElementById('resetChecks');
const nextStepLabel=document.getElementById('nextStepLabel');
const nextStepTitle=document.getElementById('nextStepTitle');
const nextStepText=document.getElementById('nextStepText');
const nextStepLink=document.getElementById('nextStepLink');
const storageKey='typeTowerRoadmapChecksV7';
const legacyKeys=['typeTowerRoadmapChecksV6','typeTowerRoadmapChecksV5'];
const implementedKeys=new Set(['step1','step2','step3','step4']);

const steps=[
  {title:'SELECTと3画面の箱を確認する',text:'背景動画、3つの塔、SELECT→GAMEの画面切替までを確認する。'},
  {title:'漢字問題を表示する',text:'kanji.jsonを読み込み、漢字問題を1問ずつ表示する。'},
  {title:'タイピング判定を完成させる',text:'Enterで正解かMISSかを判定し、次の問題へ進む。'},
  {title:'タワーの上下とクリアをつなぐ',text:'正解で1階上がり、MISSで1階下がり、10Fの問題を正解したらRESULTへ進む。'},
  {title:'STEP 5の動作確認をする',text:'RESULTの正解数・MISS数、再挑戦、塔選択へ戻る動作を実ブラウザで確認する。'},
  {title:'全体TIME 90秒を確認する',text:'ゲーム開始からRESULTまで通しで90秒。問題が変わっても時間はリセットしない。'},
  {title:'3つの塔の問題切替を確認する',text:'kanji.json / ja-en.json / en-ja.json が塔ごとに正しく切り替わるか確認する。'},
  {title:'RESULT詳細を確認する',text:'正答率とクリア時間が実プレイと一致するか確認する。保存機能は作らない。'},
  {title:'階移動演出と二重入力防止を確認する',text:'正解で上方向、MISSで下方向の演出が出て、Enter連打でも二重判定しないことを確認する。'},
  {title:'問題追加・テスト・発表準備',text:'HOMEから3モードのRESULTまで通して確認し、重大バグを直して動画・発表準備へ進む。'}
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

function replaceVisibleWord(root,from,to){
  root.querySelectorAll('h1,h2,h3,p,b,strong,li,span,a').forEach(node=>{
    if(node.children.length===0 && node.textContent.includes(from)){
      node.textContent=node.textContent.replaceAll(from,to);
    }
  });
}

function syncCurrentProjectState(){
  const heroLead=document.querySelector('.hero-copy .lead');
  if(heroLead){
    heroLead.textContent='画面構成、作る順番、学校日程、3人での進め方、完成条件をまとめた制作方針ページです。';
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
          <h2>HOMEとSTEP 9まで本体へ反映済み。現在は動作確認中</h2>
          <p>制作方針は現在の type-tower-a / main を基準にします。関数名・変数名・実装状態が変わった場合は、この方針サイト側を本体へ合わせます。</p>
        </div>
        <div class="policy-grid">
          <article class="policy-card primary-policy"><span class="policy-label">HOME</span><h3>背景 + 大きいタイトル + START</h3><p>現在の本体はHOMEから始まり、大きなTYPE TOWERタイトルとSTARTボタンを表示します。STARTでSELECTへ進みます。</p></article>
          <article class="policy-card"><span class="policy-label">SELECT</span><h3>背景動画 + 3つの塔選択</h3><p>漢字・英訳・和訳の3ボタンからGAMEへ切り替えます。</p></article>
          <article class="policy-card"><span class="policy-label">GAME</span><h3>入力判定 + 階数処理まで反映済み</h3><p>Enterで正解 / MISSを判定し、正解 +1F / MISS -1F。10Fへ到達後、10Fの問題を正解するとRESULTへ進みます。</p></article>
          <article class="policy-card"><span class="policy-label">TIME</span><h3>ゲーム全体90秒を実装済み</h3><p>ゲーム開始からRESULTまで90秒を通しで減らし、問題が変わっても残り時間を維持します。</p></article>
          <article class="policy-card"><span class="policy-label">EFFECT</span><h3>STEP 9の演出と二重入力防止を反映</h3><p>正解 / MISSの判定演出、階移動演出、Enter連打による二重判定防止を本体へ反映しています。</p></article>
          <article class="policy-card"><span class="policy-label">TAB ICON</span><h3>ロゴはブラウザのタブに使う</h3><p>ロゴはHOMEには表示せず、faviconとしてブラウザのタブ用アイコンに使います。ロゴ画像が本体へ追加されたら設定します。</p></article>
          <article class="policy-card"><span class="policy-label">NOT NEEDED</span><h3>COMBO・難易度・保存は作らない</h3><p>RESULTは正答率とクリア時間を表示し、localStorage等へのゲーム記録保存は行いません。</p></article>
        </div>
      </div>`;
    homePlan.before(section);
  }

  if(homePlan && !document.getElementById('future-home-plan')){
    const futureHome=document.createElement('section');
    futureHome.className='section wrap';
    futureHome.id='future-home-plan';
    futureHome.innerHTML=`
      <div class="section-head">
        <p class="eyebrow">HOME / TAB ICON</p>
        <h2>HOMEは実装済み。ロゴはタブ用に使う</h2>
        <p>HOMEは背景・大きなTYPE TOWERタイトル・大きなSTARTボタンで構成します。ロゴはHOMEには出さず、ブラウザのタブ用faviconとして使います。</p>
      </div>
      <div class="policy-grid">
        <article class="policy-card primary-policy"><span class="policy-label">TITLE</span><h3>でっかいタイトル</h3><p>画面を開いた瞬間に作品名が分かるよう、TYPE TOWERのタイトルを大きく見せます。</p></article>
        <article class="policy-card"><span class="policy-label">START</span><h3>でっかいSTARTボタン</h3><p>迷わずゲームを始められる大きなSTARTボタンを1つ置き、押したら塔選択のSELECTへ進みます。</p></article>
        <article class="policy-card"><span class="policy-label">FAVICON</span><h3>ロゴはタブに表示</h3><p>用意済みロゴはfaviconとして使います。HOME内にはロゴ画像を表示しません。</p></article>
      </div>
      <div class="home-flow" aria-label="HOMEからGAME開始までの流れ">
        <div><span>STEP A</span><b>HOME</b><p>背景と大きいTYPE TOWERタイトルを見せる。</p></div>
        <div><span>STEP B</span><b>START</b><p>大きいSTARTボタンを押す。</p></div>
        <div><span>STEP C</span><b>SELECT</b><p>漢字・英訳・和訳から塔を選ぶ。</p></div>
        <div><span>STEP D</span><b>GAME</b><p>選んだ塔の問題で1Fから開始する。</p></div>
      </div>
      <div class="home-note"><b>現在：</b>HOMEは本体反映済み。faviconはロゴ画像ファイルが本体へ入った時点で設定する。</div>`;
    homePlan.before(futureHome);
  }

  const specCards=[...document.querySelectorAll('#home-screen-plan .home-spec-card')];
  if(specCards[0]){specCards[0].querySelector('h3').textContent='SELECT背景は動画を維持';specCards[0].querySelector('p').textContent='assets/videos/menu-bg.mp4 を画面全体でループ表示します。';}
  if(specCards[1]){specCards[1].querySelector('h3').textContent='3つの塔を横並び';specCards[1].querySelector('p').textContent='漢字・英訳・和訳の3つを現在の横並びのまま使います。';}
  if(specCards[2]){specCards[2].querySelector('h3').textContent='塔名は現在のtower-image内を正とする';specCards[2].querySelector('p').textContent='本体では塔名を .tower-image 内に表示しています。方針サイトもこの実装を基準にします。';}
  if(specCards[3]){specCards[3].querySelector('h3').textContent='選択モードをGAME背景にも使う';specCards[3].querySelector('p').textContent='main.js の selectedMode と data-mode を使い、塔ごとにGAME背景を切り替えます。';}

  setStepStatus(1,'実装済み');
  setStepStatus(2,'実装済み');
  setStepStatus(3,'実装済み');
  setStepStatus(4,'実装済み');
  setStepStatus(5,'本体反映済み');
  setStepStatus(6,'本体反映済み');
  setStepStatus(7,'本体反映済み / 動作確認待ち');
  setStepStatus(8,'本体反映済み / 動作確認待ち');
  setStepStatus(9,'本体反映済み / 動作確認待ち');

  const step5=document.getElementById('step-5');
  if(step5){
    step5.querySelector('h3').textContent='RESULT・再挑戦・塔選択へ戻る';
    step5.querySelector('.why').textContent='本体へのコード反映は済んでいるため、10Fの問題を正解してRESULTへ進む流れ、再挑戦、SELECTへ戻る流れを確認する。';
    step5.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>正解数 / MISS数</li><li>再挑戦</li><li>塔選択へ戻る</li></ul></div><div><b>確認すること</b><ul><li>9F正解で10Fへ進む</li><li>10Fの問題を正解するとRESULTに数字が出る</li><li>再挑戦できる</li><li>SELECTへ戻れる</li></ul></div>';
  }

  const step6=document.getElementById('step-6');
  if(step6){
    step6.querySelector('h3').textContent='TIME（ゲーム全体90秒）';
    step6.querySelector('.why').textContent='ゲーム開始から10Fクリアまで90秒を通しで減らす。問題が変わっても時間はリセットしない。COMBOと難易度は追加しない。';
    step6.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>TIME表示</li><li>ゲーム全体90秒タイマー</li><li>0秒でTIME UP → RESULT</li></ul></div><div><b>確認すること</b><ul><li>開始時に90秒</li><li>問題が変わっても残り時間を維持</li><li>1秒ずつ減る</li><li>0秒でRESULTへ進む</li></ul></div>';
  }

  const step7=document.getElementById('step-7');
  if(step7){
    step7.querySelector('h3').textContent='英訳・和訳の問題データを接続';
    step7.querySelector('.why').textContent='本体のDATA_FILESを3モード対応にし、selectedModeに応じて読み込むJSONを切り替える。コード反映済みなので、3つの塔で実際の問題が変わるか確認する。';
    step7.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>kanji → kanji.json</li><li>eiyaku → ja-en.json</li><li>wayaku → en-ja.json</li></ul></div><div><b>確認すること</b><ul><li>漢字の塔で漢字問題</li><li>英訳の塔で日本語→英語</li><li>和訳の塔で英語→日本語</li></ul></div>';
  }

  const step8=document.getElementById('step-8');
  if(step8){
    step8.querySelector('h3').textContent='RESULT詳細';
    step8.querySelector('.why').textContent='正答率とプレイ時間のコードは本体へ反映済み。実プレイと数字が一致するか確認する。保存機能は追加しない。';
    step8.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>正解数 / MISS数</li><li>正答率</li><li>プレイ時間</li></ul></div><div><b>確認すること</b><ul><li>実プレイと数字が合う</li><li>プレイ時間が表示される</li><li>localStorage等へ保存しない</li></ul></div>';
  }

  const step9=document.getElementById('step-9');
  if(step9){
    step9.querySelector('h3').textContent='階移動演出 + 二重入力防止';
    step9.querySelector('.why').textContent='スクショに出ていたSTEP 9の追加作業は本体へ反映済み。正解 / MISSの演出配線も本体側で修正済みなので、実ブラウザで確認する。';
    step9.querySelector('.task-grid').innerHTML='<div><b>本体へ反映済み</b><ul><li>正解で判定演出 + 上方向の階移動</li><li>MISSで判定演出 + 下方向の階移動</li><li>isJudgingによる二重入力防止</li><li>effects.jsをgame.jsより先に読み込み</li></ul></div><div><b>確認すること</b><ul><li>正解で上方向だけ動く</li><li>MISSで下方向だけ動く</li><li>Enter連打で二重判定しない</li><li>GAME背景が消えない</li></ul></div>';
  }

  const finishCards=[...document.querySelectorAll('#finish .finish-grid article')];
  if(finishCards[0]) finishCards[0].innerHTML='<b>HOME / 3つの塔</b><p>HOMEの大きなSTARTからSELECTへ進み、漢字・英訳・和訳の3つすべてからゲームを始められる。</p>';
  if(finishCards[2]) finishCards[2].innerHTML='<b>ルール</b><p>正解、MISS、10Fクリア、ゲーム全体90秒のTIMEが想定どおり動く。</p>';
  if(finishCards[3]) finishCards[3].innerHTML='<b>RESULT</b><p>正解数、MISS数、正答率、クリア時間が実プレイと合う。記録保存は不要。</p>';

  const scheduleBuild=[...document.querySelectorAll('.schedule-item.build p')];
  if(scheduleBuild[1]) scheduleBuild[1].textContent='RESULT、全体90秒TIME、英訳・和訳、RESULT詳細、階移動演出と二重入力防止まで進める。';

  const schedulePolish=document.querySelector('.schedule-item.polish p');
  if(schedulePolish) schedulePolish.textContent='HOMEの大きなタイトル・START、タブ用favicon、SELECT / GAMEの見た目、問題追加を仕上げる。';
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
    if(nextStepText) nextStepText.textContent='HOMEから3モードの最終通しプレイ、favicon、発表準備を確認する。';
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
