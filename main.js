// ==================================================
// 物体迷宮 第一試作・テキスト進行版
// ==================================================

// ---------- データ ----------

const FLOOR_THEMES = [
  {
    name: "冷蔵庫",
    floorName: "冷蔵庫の階",
    encounters: [
      "冷蔵庫だ。\n扉が開いている。うすら寒い空気が伝わってくる。",
    ],
  },
  {
    name: "消しゴム",
    floorName: "消しゴムの階",
    encounters: [
      "消しゴムだ。\n昔なくした使いかけの消しゴム。いびつな形をしている。",
    ],
  },
  {
    name: "色鉛筆",
    floorName: "色鉛筆の階",
    encounters: [
      "色鉛筆だ。\nあなたの大好きな色だけ、妙に短くなっている。",
    ],
  },
  {
    name: "りんご",
    floorName: "りんごの階",
    encounters: [
      "りんごだ。\nつややかで美味しそうだ。ごろんと重い。",
    ],
  },
  {
    name: "メモ帳",
    floorName: "メモ帳の階",
    encounters: [
      "メモ帳だ。\n何を残そうとしたのか、ミミズのような字がのたくっている。",
    ],
  },
  {
    name: "ネクタイ",
    floorName: "ネクタイの階",
    encounters: [
      "ネクタイだ。\nほどくのが面倒で結びっぱなしの、怠惰な結び目。",
    ],
  },
  {
    name: "漫画",
    floorName: "漫画の階",
    encounters: [
      "漫画だ。\nお菓子を食べながら読んだ友達の指の油が染みている。",
    ],
  },
  {
    name: "スプーン",
    floorName: "スプーンの階",
    encounters: [
      "スプーンだ。\nマジックの練習台になり、かわいそうに曲がっている。",
    ],
  },
  {
    name: "眼鏡",
    floorName: "眼鏡の階",
    encounters: [
      "眼鏡だ。\n黒縁が目立つ。べっとりと指紋が付いている。",
    ],
  },
  {
    name: "イス",
    floorName: "イスの階",
    encounters: [
      "イスだ。\n座ると軋む。体重移動のたびに不愉快な声で鳴く。",
    ],
  },
  {
    name: "電子レンジ",
    floorName: "電子レンジの階",
    encounters: [
      "電子レンジだ。\nきのうの夕飯が中でぐるぐる回っている。",
    ],
  },
  {
    name: "ランドセル",
    floorName: "ランドセルの階",
    encounters: [
      "ランドセルだ。\n色は一番人気のパープルだし、模様もしゃれている。",
    ],
  },
];

const MAX_PROGRESS = 10;

const SPECIAL_EVENTS = [
  "箱がある。\n開ける機能は、まだない。",
  "足元に違和感がある。\n何かが仕込まれている気がする。",
  "遠くで物音がした。\nそれはすぐに止んだ。",
];

// ---------- DOM取得 ----------

const floorDisplay = document.getElementById("floorDisplay");
const progressGauge = document.getElementById("progressGauge");
const themeDisplay = document.getElementById("themeDisplay");
const textWindow = document.getElementById("textWindow");
const forwardButton = document.getElementById("forwardButton");
const backButton = document.getElementById("backButton");
const menuButtons = document.querySelectorAll("[data-menu]");

// ---------- 状態 ----------

let floorNumber = 1;
let progress = 0;
let currentText = "物体迷宮に入った。";
let history = [];

// ---------- 初期化 ----------

forwardButton.addEventListener("click", goForward);
backButton.addEventListener("click", goBack);

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showText(`${button.dataset.menu}は、まだ使えない。`);
  });
});

document.addEventListener("keydown", handleKeyDown);

render();

// ---------- 入力 ----------

function handleKeyDown(event) {
  const key = event.key.toLowerCase();

  if (key === "arrowright" || key === "d" || key === "enter") {
    event.preventDefault();
    goForward();
    return;
  }

  if (key === "arrowleft" || key === "a" || key === "backspace") {
    event.preventDefault();
    goBack();
  }
}

// ---------- 進行 ----------

function goForward() {
  history.push({
    floorNumber,
    progress,
    currentText,
  });

  progress += 1;

  if (progress > MAX_PROGRESS) {
    goNextFloor();
    return;
  }

  const text = createForwardText();
  showText(text);
}

function goBack() {
  if (history.length === 0) {
    showText("これ以上は戻れない。");
    return;
  }

  const previousState = history.pop();

  floorNumber = previousState.floorNumber;
  progress = previousState.progress;
  currentText = previousState.currentText;

  render();
}

function goNextFloor() {
  floorNumber += 1;
  progress = 0;
  history = [];

  const theme = getCurrentTheme();

  showText(
    `階段を降りた。\n\nここはＦ${floorNumber}。\n${theme.floorName}だ。`
  );
}

function createForwardText() {
  const eventRoll = Math.random();

  if (eventRoll < 0.18) {
    return pickRandom(SPECIAL_EVENTS);
  }

  const theme = getCurrentTheme();

  return pickRandom(theme.encounters);
}

// ---------- 表示 ----------

function showText(text) {
  currentText = text;
  render();
}

function render() {
  const theme = getCurrentTheme();

  floorDisplay.textContent = `Ｆ${floorNumber}`;
  progressGauge.textContent = createProgressGauge();
  themeDisplay.textContent = theme.floorName;

  textWindow.innerHTML = "";

  const paragraph = document.createElement("p");
  paragraph.textContent = currentText;

  textWindow.appendChild(paragraph);
}

function createProgressGauge() {
  let gauge = "";

  for (let i = 0; i < MAX_PROGRESS; i++) {
    gauge += i < progress ? "■" : "□";
  }

  return gauge;
}

// ---------- 汎用 ----------

function getCurrentTheme() {
  const index = (floorNumber - 1) % FLOOR_THEMES.length;

  return FLOOR_THEMES[index];
}

function pickRandom(items) {
  const index = Math.floor(Math.random() * items.length);

  return items[index];
}