function removeDeclaration(body, property) {
  const pattern = new RegExp(`\\n?\\s*${property}\\s*:[\\s\\S]*?;`, 'g');
  return body.replace(pattern, '');
}

function cleanRule(css, selector, properties) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${escapedSelector}\\s*\\{)([^{}]*)(\\})`, 'g');

  return css.replace(pattern, (match, open, body, close) => {
    let nextBody = body;
    properties.forEach(property => {
      nextBody = removeDeclaration(nextBody, property);
    });
    return `${open}${nextBody}${close}`;
  });
}

function applyStudentAssetPolicy(css) {
  let nextCss = css;

  // 背景・塔画像などの素材は自分たちで用意する。
  // 記入例側では、配置・ボタン・入力欄などのUIだけを担当する。
  nextCss = cleanRule(nextCss, 'body', ['background', 'background-attachment']);
  nextCss = cleanRule(nextCss, '.tower-image', [
    'border',
    'border-bottom-width',
    'background',
    'background-color',
    'background-image',
    'color',
    'box-shadow'
  ]);
  nextCss = cleanRule(nextCss, '.tower-kanji', ['background', 'background-color', 'background-image', 'border-color']);
  nextCss = cleanRule(nextCss, '.tower-eiyaku', ['background', 'background-color', 'background-image', 'border-color']);
  nextCss = cleanRule(nextCss, '.tower-wayaku', ['background', 'background-color', 'background-image', 'border-color']);
  nextCss = cleanRule(nextCss, '.game-stage', ['background']);
  nextCss = cleanRule(nextCss, '.stone-wall', ['background', 'background-color', 'background-image']);

  const note = `/*\n  背景・塔画像・塔内部の素材は自分たちで用意する。\n  この記入例では素材の見た目は決めず、配置・ボタン・入力欄などのUIだけを扱う。\n*/\n\n`;

  return note + nextCss.trimStart();
}

const CURRENT_HOME_CSS = `* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
}

body {
  margin: 0;
  overflow-x: hidden;
  font-family: "Yu Gothic UI", "Yu Gothic", system-ui, sans-serif;
  color: #fff;
}

button {
  font: inherit;
}

[hidden] {
  display: none !important;
}

[data-screen="select"] {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100svh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding: clamp(18px, 3vh, 34px) clamp(18px, 4vw, 58px) clamp(24px, 4vh, 46px);
}

.select-bg-video {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.select-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(5, 18, 38, .34) 0%,
    rgba(5, 18, 38, .06) 30%,
    rgba(5, 18, 38, .04) 58%,
    rgba(5, 18, 38, .48) 100%
  );
}

/* 上部：ロゴ + タイトル */
.select-brand {
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 1.4vw, 18px);
  min-height: 72px;
}

.select-logo {
  width: clamp(62px, 7vw, 96px);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, .38));
}

.select-title {
  margin: 0;
  font-size: clamp(2.15rem, 4.8vw, 4.5rem);
  line-height: .96;
  font-weight: 900;
  letter-spacing: .055em;
  text-shadow:
    0 3px 0 rgba(11, 31, 58, .35),
    0 5px 14px rgba(0, 0, 0, .48);
}

/* 中央〜下：3つの塔。塔そのものの見た目は素材側で作る */
.tower-select {
  align-self: end;
  width: min(1100px, 100%);
  margin: clamp(18px, 4vh, 44px) auto 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(18px, 3vw, 38px);
  align-items: end;
}

.tower-option {
  min-width: 0;
  display: grid;
  justify-items: center;
  grid-template-rows: minmax(0, 1fr) auto auto;
  gap: 10px;
  text-align: center;
}

/* 後から塔画像を入れるためのスペース。色や背景は付けない */
.tower-image {
  width: 100%;
  min-height: clamp(190px, 34vh, 360px);
  display: grid;
  place-items: end center;
  pointer-events: none;
}

.tower-image img {
  display: block;
  max-width: min(240px, 88%);
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 16px rgba(0, 0, 0, .22));
}

.tower-name {
  margin: 0;
  min-width: min(220px, 100%);
  padding: 7px 16px 8px;
  border: 1px solid rgba(222, 183, 102, .92);
  border-radius: 7px;
  background: rgba(9, 27, 52, .84);
  color: #fff8e8;
  font-size: clamp(1.05rem, 1.65vw, 1.38rem);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: .04em;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .45);
  box-shadow: 0 5px 12px rgba(0, 0, 0, .16);
}

.tower-option button {
  width: min(220px, 100%);
  min-height: 48px;
  padding: 10px 18px;
  border: 2px solid #ddb568;
  border-radius: 7px;
  background: #142f55;
  color: #fff;
  font-weight: 900;
  letter-spacing: .02em;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(0, 0, 0, .2);
  transition:
    transform .16s ease,
    background-color .16s ease,
    box-shadow .16s ease;
}

.tower-option button:hover {
  transform: translateY(-2px);
  background: #1a3e6f;
  box-shadow: 0 8px 16px rgba(0, 0, 0, .24);
}

.tower-option button:active {
  transform: translateY(0);
}

.tower-option button:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

@media (max-width: 720px) {
  [data-screen="select"] {
    min-height: 100svh;
    overflow: auto;
    grid-template-rows: auto auto;
    padding: 16px 18px 28px;
  }

  .select-brand {
    min-height: 58px;
  }

  .select-logo {
    width: 54px;
  }

  .select-title {
    font-size: clamp(1.8rem, 9vw, 2.8rem);
  }

  .tower-select {
    align-self: start;
    grid-template-columns: 1fr;
    width: min(350px, 100%);
    margin-top: 20px;
    gap: 24px;
  }

  .tower-image {
    min-height: 120px;
  }
}

@media (max-height: 720px) and (min-width: 721px) {
  [data-screen="select"] {
    padding-top: 14px;
    padding-bottom: 20px;
  }

  .select-brand {
    min-height: 56px;
  }

  .select-logo {
    width: 54px;
  }

  .select-title {
    font-size: clamp(2rem, 4vw, 3.3rem);
  }

  .tower-image {
    min-height: clamp(130px, 26vh, 210px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tower-option button {
    transition: none;
  }
}`;

function updateCssExamples() {
  document.querySelectorAll('.full-file').forEach(file => {
    const path = file.querySelector('summary span')?.textContent?.trim();
    if (path !== 'css/style.css') return;

    const code = file.querySelector('pre code');
    if (!code) return;

    code.textContent = applyStudentAssetPolicy(code.textContent);
  });
}

function updateCurrentHomeCss() {
  const files = document.querySelectorAll('#homeUiDecision .full-file');
  files.forEach(file => {
    const label = file.querySelector('summary span')?.textContent?.trim();
    if (label !== 'css/style.css の記入例') return;

    const code = file.querySelector('pre code');
    if (code) code.textContent = CURRENT_HOME_CSS;
  });
}

updateCssExamples();
updateCurrentHomeCss();
