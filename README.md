# TYPE TOWER 制作ロードマップ

3人で制作する「TYPE TOWER」の制作方針、学校日程、作る順番、共同作業方法、コード全文をまとめるサイトです。

## ページを2つに分離

制作中に説明とコードが混ざらないよう、主に見るページを2つへ分けます。

### 1. 制作方針ページ

`index.html`

表示するもの:

- 現在のゲーム本体の進み具合
- SELECT / GAME / RESULT の画面方針
- 背景・塔名・ボタン・ゲーム素材の扱い
- 学校日程
- STEP 1〜10の制作順
- 各STEPの目的と完了条件
- 3人での進め方
- 進捗チェック
- 完成条件

**このページにはコード例を表示しません。**

### 2. コード全文ページ

`code.html`

表示するもの:

- 現在の `type-tower-a` の主要ファイル状況
- 現在作っているSELECT画面のHTML / CSS / JavaScript
- STEP 1〜10それぞれのファイル全文
- 自分たちが書いたコードを優先するための注意

制作方針を確認するときは `index.html`、実際に書く内容を確認するときだけ `code.html` を使います。

旧URLの `build-example.html` / `build-example-files.html` / `build-example-full.html` は `code.html` へ移動します。

## 現在のゲーム本体

実装側のSource of Truthは `EliteMay/type-tower-a` の `main` です。

現在はおおむね **STEP 1完了〜STEP 2準備中** の状態です。

### SELECT画面

- 最初に表示する画面は `select`
- `assets/videos/menu-bg.mp4` を背景動画として自動再生・無限ループ
- 漢字 / 英訳 / 和訳の3つの選択肢を横並び
- 塔名は現在 `.tower-image` の領域内に文字として表示
- 塔名はCSSで明朝系・淡い金色・影付きに調整済み
- ボタンを押すと `main.js` が選択モードを保持してGAMEへ切り替える

### GAME / RESULT

- `game` と `result` の画面枠は `index.html` に存在
- GAMEには戻るボタン・ゲームステージ・問題カードの箱まである
- `js/game.js` は現在空ファイル
- `js/effects.js` と `js/storage.js` も現在空ファイル
- ゲーム処理、判定、階数、RESULT処理はこれから実装

### データ

- `data/kanji.json` : 問題は追加済み。ただし現在はオブジェクト間のカンマ不足があり、そのままでは正しいJSONとして読み込めない
- `data/en-ja.json` : 英語→日本語の問題データあり
- `data/ja-en.json` : 現在空

STEP 2へ進む前に、まず `kanji.json` を正しいJSONへ直してから漢字問題の読み込みを実装します。

### 素材

```text
assets/
├─ images/
│  ├─ sky-bg.jpg
│  ├─ tower-blue.jpg
│  ├─ tower-light.jpg
│  ├─ tower-dark.jpg
│  ├─ enemies/
│  └─ tower/
├─ sounds/
└─ videos/
   └─ menu-bg.mp4
```

- `menu-bg.mp4` はSELECT画面用
- `sky-bg.jpg` と3枚の塔内部画像はGAME画面用として保持
- GAME画面を作る段階まで、これら4枚をSELECT画面へ流用しない

## 一番重要な制作方針

最初から3モード・演出・記録機能などを同時に作りません。

まず漢字の塔1つだけで、次の流れを最後まで完成させます。

SELECTの漢字の塔 → 問題表示 → 入力 → 正解 / MISS → 階数変化 → 10F CLEAR → RESULT → SELECT

このゲームループが最後まで動いてから、タイマー・コンボ・難易度・残り2つの塔・見た目を追加します。

## 制作順

1. 3画面の箱 + SELECTの3つの塔
2. 漢字問題を表示
3. タイピング判定
4. 正解 +1F / MISS -1F / 10F CLEAR
5. 漢字の塔を最後まで遊べる状態にする
6. TIME / COMBO / 難易度
7. 英訳・和訳の塔を接続
8. RESULT・記録保存
9. SELECT / GAMEの見た目と階移動
10. 問題追加・最終テスト・動画準備

## 3人開発の基本方針

基本は3人で一緒に作ります。

ゲームの中心部分は完全分業せず、3人で目的を確認し、1人がその時間の操作役になります。操作役は機能や時間ごとに交代します。

分担しやすいもの:

- 問題追加
- 問題調査
- ロゴ案
- 背景・塔・敵などの素材探し
- テスト
- 動画素材

GitHubでは人別ではなく、タイピング、問題追加、RESULTなど作業内容ごとにBranchを分けます。同じファイルを別々に同時編集しないことを優先します。

## 学校日程

- 9/1: 企画・GitHub準備
- 9/2〜9/4: 漢字の塔でゲームの核を作る
- 9/8〜9/9: TIME / COMBO / 難易度 / 残り2モード / RESULT
- 9/10〜9/11: SELECT / GAMEの見た目、素材、階移動、問題追加
- 9/15: 最終テスト・重大バグ修正
- 9/16〜9/17: 動画制作・発表準備

遅れた場合は新機能を増やさず、最後まで安定して遊べることを優先します。

## 主なファイル

- `index.html` : コード例なしの制作方針ページ
- `roadmap.js` : 制作方針ページの進捗チェック・現在状態表示・次STEP表示
- `styles.css` : 制作方針サイト共通デザイン
- `home-screen-plan.css` : SELECT画面構想の表示
- `code.html` : コード全文ページ
- `build-example-full.js` : STEP別のファイル全文を生成
- `build-example-assets-policy.js` : 現在実装との同期と素材方針をコード例へ反映
- `build-example.css` / `build-example-full.css` : コード全文ページのデザイン
- `github-guide.html` : GitHub共同開発ガイド

`app.js` や旧作成例用ファイルは過去構成との互換のため残っていますが、制作方針ページでは読み込みません。

## 進捗保存

制作方針ページのSTEPチェックはブラウザ内に保存します。既存の保存状態がある場合はそれを優先します。保存状態がまだない場合は、現在の実装に合わせてSTEP 1を完了状態から開始します。

## 制作方針の正本

共通のWeb制作ルールは `EliteMay/web-project-guide` を参照し、このリポジトリではTYPE TOWER固有の制作順・画面方針・共同開発手順・完成条件を管理します。
