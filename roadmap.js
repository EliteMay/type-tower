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
  {title:'タワーの上下とクリアをつなぐ',text:'正解で1階上がり、MISSで1階下がり、10階でRESULTへ進む。'},
  {title:'漢字の塔を最後まで遊べる状態にする',text:'RESULTに正解数・MISS数を出し、再挑戦と塔選択へ戻る流れを完成させる。'},
  {title:'TIME（制限時間）を追加する',text:'各問題に固定の制限時間を追加する。COMBOと難易度は作らない。'},
  {title:'残り2つの塔をゲームにつなぐ',text:'既存のja-en.json / en-ja.jsonを使い、塔ごとに問題データを切り替える。'},
  {title:'RESULT詳細を追加する',text:'正答率とクリア時間を表示する。保存機能は作らない。'},
  {title:'SELECTとGAMEの見た目を仕上げる',text:'現在の背景素材を残したまま、階移動演出と二重入力防止を整える。'},
  {title:'問題追加・テスト・発表準備',text:'3モードを通して確認し、重大バグを直して動画・発表準備へ進む。'}
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
  replaceVisibleWord(document.body,'HOME','SELECT');

  document.querySelectorAll('a[href="code.html"]').forEach(link=>{
    link.textContent=link.classList.contains('btn') ? 'STEP追加コードを開く' : 'STEP追加コード';
  });

  const heroLead=document.querySelector('.hero-copy .lead');
  if(heroLead){
    heroLead.textContent='ここにはコード例を置きません。何を作るか、どの順番で進めるかだけをまとめます。実際に書く内容は「STEP追加コード」で、大体の行番号と本体コードの目印を確認して追加します。';
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
          <h2>STEP 4まで実装済み。次はRESULT</h2>
          <p>制作方針は現在の type-tower-a / main を基準にします。関数名・変数名・実装状態が変わった場合は、この方針サイト側を本体へ合わせます。</p>
        </div>
        <div class="policy-grid">
          <article class="policy-card primary-policy"><span class="policy-label">SELECT</span><h3>背景動画 + 3つの塔選択</h3><p>menu-bg.mp4を背景にし、漢字・英訳・和訳の3ボタンからGAMEへ切り替えます。</p></article>
          <article class="policy-card"><span class="policy-label">GAME</span><h3>入力判定 + 階数処理まで完成</h3><p>kanji.jsonを読み、Enterで正解 / MISSを判定し、正解 +1F / MISS -1F、10FでRESULTへ進みます。</p></article>
          <article class="policy-card"><span class="policy-label">DATA</span><h3>3つのJSONは本体に存在</h3><p>kanji.jsonは使用中。ja-en.jsonとen-ja.jsonにも問題データがあり、STEP 7でゲームへ接続します。</p></article>
          <article class="policy-card"><span class="policy-label">NOT NEEDED</span><h3>COMBO・難易度・保存は作らない</h3><p>追加ルールはTIMEだけ。RESULTは正答率とクリア時間を表示し、localStorage等への記録保存は行いません。</p></article>
          <article class="policy-card"><span class="policy-label">CODE GUIDE</span><h3>行番号 + 実コード目印で案内</h3><p>「処理の後」だけではなく、大体何行目かと、type-tower-aに実在するコードの直後 / 直前をセットで示します。</p></article>
          <article class="policy-card"><span class="policy-label">NEXT</span><h3>STEP 5：RESULTを完成させる</h3><p>正解数・MISS数、再挑戦、塔選択へ戻る流れを追加します。</p></article>
        </div>
      </div>`;
    homePlan.before(section);
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
  setStepStatus(5,'次');

  const step5=document.getElementById('step-5');
  if(step5){
    step5.querySelector('h3').textContent='RESULT・再挑戦・塔選択へ戻る';
    step5.querySelector('.why').textContent='10F到達後の空RESULTを完成させ、漢字の塔を最初から最後まで遊べる状態にする。';
    step5.querySelector('.task-grid').innerHTML='<div><b>追加するもの</b><ul><li>正解数 / MISS数</li><li>再挑戦</li><li>塔選択へ戻る</li></ul></div><div><b>完了条件</b><ul><li>10FでRESULTに数字が出る</li><li>再挑戦できる</li><li>SELECTへ戻れる</li></ul></div>';
  }

  const step6=document.getElementById('step-6');
  if(step6){
    step6.querySelector('h3').textContent='TIME（制限時間）';
    step6.querySelector('.why').textContent='各問題に固定の制限時間を付ける。COMBOと難易度は追加しない。';
    step6.querySelector('.task-grid').innerHTML='<div><b>追加するもの</b><ul><li>TIME表示</li><li>固定10秒タイマー</li><li>0秒でMISS</li></ul></div><div><b>完了条件</b><ul><li>問題ごとに10秒へ戻る</li><li>1秒ずつ減る</li><li>0秒で既存のMISS処理へ進む</li></ul></div>';
  }

  const step7=document.getElementById('step-7');
  if(step7){
    step7.querySelector('.task-grid').innerHTML='<div><b>追加するもの</b><ul><li>DATA_FILESを3モード対応</li><li>selectedModeでfetch先を切替</li></ul></div><div><b>本体に既にあるデータ</b><ul><li>kanji.json</li><li>ja-en.json</li><li>en-ja.json</li></ul></div>';
  }

  const step8=document.getElementById('step-8');
  if(step8){
    step8.querySelector('h3').textContent='RESULT詳細';
    step8.querySelector('.why').textContent='1回のプレイ結果を分かりやすくする。保存機能は追加しない。';
    step8.querySelector('.task-grid').innerHTML='<div><b>表示するもの</b><ul><li>正解数 / MISS数</li><li>正答率</li><li>クリア時間</li></ul></div><div><b>完了条件</b><ul><li>実プレイと数字が合う</li><li>クリア時間が表示される</li><li>localStorage等へ保存しない</li></ul></div>';
  }

  const finishCards=[...document.querySelectorAll('#finish .finish-grid article')];
  if(finishCards[2]) finishCards[2].innerHTML='<b>ルール</b><p>正解、MISS、TIMEが想定どおり動く。</p>';
  if(finishCards[3]) finishCards[3].innerHTML='<b>RESULT</b><p>正解数、MISS数、正答率、クリア時間が実プレイと合う。記録保存は不要。</p>';

  const scheduleBuild=[...document.querySelectorAll('.schedule-item.build p')];
  if(scheduleBuild[1]) scheduleBuild[1].textContent='RESULT、TIME、英訳・和訳、RESULT詳細を追加する。';
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
    if(nextStepText) nextStepText.textContent='最終通しプレイと発表準備を確認する。';
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
