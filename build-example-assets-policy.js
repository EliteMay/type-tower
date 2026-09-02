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

function updateCssExamples() {
  document.querySelectorAll('.full-file').forEach(file => {
    const path = file.querySelector('summary span')?.textContent?.trim();
    if (path !== 'css/style.css') return;

    const code = file.querySelector('pre code');
    if (!code) return;

    code.textContent = applyStudentAssetPolicy(code.textContent);
  });
}

updateCssExamples();
