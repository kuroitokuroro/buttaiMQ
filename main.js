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
      "冷蔵庫だ。\nきのうの夕飯と、おやつのプリンが隣同士で並んでいる。",
    ],
  },
  {
    name: "消しゴム",
    floorName: "消しゴムの階",
    encounters: [
      "消しゴムだ。\n昔なくした使いかけの消しゴム。いびつな形をしている。",
      "消しゴムだ。\nすべての角が使用済みで、包んでいる紙も薄汚い。",
    ],
  },
  {
    name: "色鉛筆",
    floorName: "色鉛筆の階",
    encounters: [
      "色鉛筆だ。\nあなたの大好きな色だけ、妙に短くなっている。",
      "色鉛筆だ。\n白色だけ失くしたけど、白だから誰も困らない。",
    ],
  },
  {
    name: "りんご",
    floorName: "りんごの階",
    encounters: [
      "りんごだ。\nつややかで美味しそう。ごろんと重い。",
      "りんごだ。\n蜜がたっぷりの品種だよ、と言われた気がする",
    ],
  },
  {
    name: "メモ帳",
    floorName: "メモ帳の階",
    encounters: [
      "メモ帳だ。\n何を書こうとしたのか、ミミズのような字がのたくっている。",
      "メモ帳だ。\n端っこが折れてて、じんわりと嫌な気分になる。",
    ],
  },
  {
    name: "ネクタイ",
    floorName: "ネクタイの階",
    encounters: [
      "ネクタイだ。\nほどくのが面倒で結びっぱなしの、怠惰な結び目。",
      "ネクタイだ。\n一足先に卒業した、先輩からもらったおさがり。",
    ],
  },
  {
    name: "漫画",
    floorName: "漫画の階",
    encounters: [
      "漫画だ。\nお菓子を食べながら読んだ友達の指の油が染みている。",
      "漫画だ。\n意味不明のギャグマンガだが、読むとたまにしんみりする。",
    ],
  },
  {
    name: "スプーン",
    floorName: "スプーンの階",
    encounters: [
      "スプーンだ。\nマジックの練習台にされ、かわいそうに曲がっている。",
      "スプーンだ。\nひどく醜い形に伸びた自分の顔が映り込んでいて不快だ。",
    ],
  },
  {
    name: "眼鏡",
    floorName: "眼鏡の階",
    encounters: [
      "眼鏡だ。\n黒縁が目立つ。べっとりと指紋が付いている。",
      "眼鏡だ。\nもう度数が合わないけど、今は廃盤のフレームがお気に入り。",
    ],
  },
  {
    name: "イス",
    floorName: "イスの階",
    encounters: [
      "イスだ。\n座ると軋む。体重移動のたびに不愉快な声で鳴く。",
      "イスだ。\n木製で、ささくれがひどい。早く捨てたらいいのに。",
    ],
  },
  {
    name: "電子レンジ",
    floorName: "電子レンジの階",
    encounters: [
      "電子レンジだ。\n中できのうの夕飯がぐるぐる回っている。",
      "電子レンジだ。\nずっと使っているのに何ワットなのか知らない。",
    ],
  },
  {
    name: "ランドセル",
    floorName: "ランドセルの階",
    encounters: [
      "ランドセルだ。\n色は一番人気のパープルだし、模様もしゃれている。",
      "ランドセルだ。\n黄色いカバーで包まれている。雨のにおいがする。",
    ],
  },
];

const PROGRESS_STEP = 5;
const MAX_PROGRESS = 100;

const SPECIAL_EVENTS = [
  "箱がある。\n開ける手段は、まだない。",
  "足元に違和感がある。\n何かが仕込まれている気がする。",
  "遠くで物音がした。\nそれはすぐに止んだ。",
  "壁際に、何かの影が落ちている。\n近づくと、ただの汚れだった。",
  "床に小さな傷がある。\n誰かがここで争ったようだ。",
  "空気が重い、気がする。\nだが、進むしかない。",
];
// ---------- DOM取得 ----------

const floorDisplay = document.getElementById("floorDisplay");
const progressGauge = document.getElementById("progressGauge");
const themeDisplay = document.getElementById("themeDisplay");
const textWindow = document.getElementById("textWindow");
const effectLayer = document.getElementById("effectLayer");
const moveActions = document.querySelector(".move-actions");
const battleActions = document.querySelector(".battle-actions");
const forwardButton = document.getElementById("forwardButton");
const backButton = document.getElementById("backButton");
const attackButton = document.getElementById("attackButton");
const magicButton = document.getElementById("magicButton");
const escapeButton = document.getElementById("escapeButton");
const menuButtons = document.querySelectorAll("[data-menu]");



// ---------- 状態 ----------

let floorNumber = 1;
let progress = 0;
let currentText = "物体迷宮に入った。";
let history = [];
let isBattle = false;

// ---------- 初期化 ----------

forwardButton.addEventListener("click", goForward);
backButton.addEventListener("click", goBack);
attackButton.addEventListener("click", () => {
  showAttackEffect();
  isBattle = false;
  showText("こうげきした。\n敵は動かなくなった。");
});

magicButton.addEventListener("click", () => {
  showMagicEffect();
  isBattle = false;
  showText("魔法を使った。\n白い輪がほどけ、敵は沈黙した。");
});

escapeButton.addEventListener("click", () => {
  isBattle = false;
  showText("逃げ出した。\n背後で何かが軋んだ。");
});

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
    isBattle,
  });
  if (progress >= MAX_PROGRESS) {
    goNextFloor();
    return;
  }

  progress += PROGRESS_STEP;

  if (progress > MAX_PROGRESS) {
    progress = MAX_PROGRESS;
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
  isBattle = previousState.isBattle;

  render();
}

function goNextFloor() {
  floorNumber += 1;
  progress = 0;
  history = [];
  isBattle = false;

  const theme = getCurrentTheme();

  showText(
    `階段を降りた。\n\nここはＦ${toFullWidthNumber(floorNumber)}。\n${theme.floorName}だ。`
  );
}

function createForwardText() {
  const theme = getCurrentTheme();
  const eventRoll = Math.random();

  if (eventRoll < 0.25) {
    isBattle = true;
    return pickRandom(theme.encounters);
  }

  isBattle = false;

  if (eventRoll < 0.50) {
    return pickRandom(SPECIAL_EVENTS);
  }

  return "先に進んだ。";
}

// ---------- 表示 ----------

function showText(text) {
  currentText = text;
  render();
}

function showAttackEffect() {
  const effect = document.createElement("div");
  effect.className = "attack-effect";

  const lineCount = 12;

  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement("div");
    line.className = "attack-line";

    const angle = (360 / lineCount) * i;
    line.style.setProperty("--angle", `${angle}deg`);

    effect.appendChild(line);
  }

  effectLayer.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 400);
}

function showMagicEffect() {
  const effect = document.createElement("div");
  effect.className = "magic-effect";

  effectLayer.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 400);
}

function render() {
  const theme = getCurrentTheme();

  floorDisplay.textContent = `Ｆ${toFullWidthNumber(floorNumber)}`;
  themeDisplay.textContent = theme.floorName;
  moveActions.style.display = isBattle ? "none" : "flex";
  battleActions.style.display = isBattle ? "flex" : "none";

  renderProgressGauge();

  textWindow.innerHTML = "";

  const paragraph = document.createElement("p");
  paragraph.textContent = currentText;

  textWindow.appendChild(paragraph);
}

function renderProgressGauge() {
  progressGauge.innerHTML = "";

  const fill = document.createElement("div");
  fill.className = "progress-gauge-fill";
  fill.style.width = `${progress}%`;

  progressGauge.appendChild(fill);
}

function createProgressGauge() {
  return "";
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

function toFullWidthNumber(number) {
  return String(number).replace(/[0-9]/g, (digit) => {
    return String.fromCharCode(digit.charCodeAt(0) + 0xFEE0);
  });
}