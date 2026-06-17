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
      "冷蔵庫だ。\nヤニ色に変色した扉のあちこちにシールが貼ってある。",
    ],
  },
  {
    name: "消しゴム",
    floorName: "消しゴムの階",
    encounters: [
      "消しゴムだ。\n昔なくした使いかけの消しゴム。いびつな形をしている。",
      "消しゴムだ。\nすべての角が使用済みで、包んでいる紙も薄汚い。",
      "消しゴムだ。\nたのしい香りがする。ずっと嗅いでると頭が痛くなってくる。",
    ],
  },
  {
    name: "色鉛筆",
    floorName: "色鉛筆の階",
    encounters: [
      "色鉛筆だ。\nあなたの大好きな色だけ、妙に短くなっている。",
      "色鉛筆だ。\n白色だけ失くしたが、白だから誰も困らない。",
      "色鉛筆だ。\n持ち運ぶときに折れてしまった芯が箱の中に散乱している。",
    ],
  },
  {
    name: "りんご",
    floorName: "りんごの階",
    encounters: [
      "りんごだ。\nつややかで美味しそう。ごろんと重い。",
      "りんごだ。\n蜜がたっぷりの品種だよ、と言われた気がする",
      "りんごだ。\nさっき齧ったところが、もう茶色くなっている",
    ],
  },
  {
    name: "メモ帳",
    floorName: "メモ帳の階",
    encounters: [
      "メモ帳だ。\n何を書こうとしたのか、ミミズのような字がのたくっている。",
      "メモ帳だ。\n端っこが折れてて、じんわりと嫌な気分になる。",
      "メモ帳だ。\n筆圧が強すぎて痕になっている。",
    ],
  },
  {
    name: "ネクタイ",
    floorName: "ネクタイの階",
    encounters: [
      "ネクタイだ。\nほどくのが面倒で結びっぱなしの、怠惰な結び目。",
      "ネクタイだ。\n一足先に卒業した、先輩からもらったおさがり。",
      "ネクタイだ。\n趣味じゃないが、プレゼントなので文句が言えない。",
    ],
  },
  {
    name: "漫画",
    floorName: "漫画の階",
    encounters: [
      "漫画だ。\nお菓子を食べながら読んだ友達の指の油が染みている。",
      "漫画だ。\n意味不明のギャグマンガだが、読むとたまにしんみりする。",
      "漫画だ。\n大好きなコマを全部切り抜いたから、もうとても読めるものじゃない。",
    ],
  },
  {
    name: "スプーン",
    floorName: "スプーンの階",
    encounters: [
      "スプーンだ。\nマジックの練習台にされ、かわいそうに曲がっている。",
      "スプーンだ。\nひどく醜い形に伸びた自分の顔が映り込んでいて不快だ。",
      "スプーンだ。\nコーヒーの粉が溶け切らずに残っている。",
    ],
  },
  {
    name: "眼鏡",
    floorName: "眼鏡の階",
    encounters: [
      "眼鏡だ。\n黒縁が目立つ。べっとりと指紋が付いている。",
      "眼鏡だ。\nもう度数は合わないけど、今は廃盤のフレームがお気に入り。",
      "眼鏡だ。\nこれを買った店はもう何年も前に閉店してしまった。",
    ],
  },
  {
    name: "イス",
    floorName: "イスの階",
    encounters: [
      "イスだ。\n座ると軋む。体重移動のたびに不愉快な声で鳴く。",
      "イスだ。\n木製で、ささくれがひどい。早く捨てたらいいのに。",
      "イスだ。\n中の綿がへたってきたので明日捨てる座椅子。",
    ],
  },
  {
    name: "電子レンジ",
    floorName: "電子レンジの階",
    encounters: [
      "電子レンジだ。\n中できのうの夕飯がぐるぐる回っている。",
      "電子レンジだ。\nずっと使っているのに何ワットなのか知らない。",
      "電子レンジだ。\n爆発した卵の黄身がこびりついて取れない。",
    ],
  },
  {
    name: "ランドセル",
    floorName: "ランドセルの階",
    encounters: [
      "ランドセルだ。\n色は一番人気のパープルだし、模様もしゃれている。",
      "ランドセルだ。\n黄色いカバーで包まれている。雨のにおいがする。",
      "ランドセルだ。\nぶら下がっている袋の中に、まだ洗ってない給食着がある。",
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

const enemyHpFill = document.getElementById("enemyHpFill");
const enemyMpFill = document.getElementById("enemyMpFill");
const playerHpFill = document.getElementById("playerHpFill");
const playerMpFill = document.getElementById("playerMpFill");
const playerExpFill = document.getElementById("playerExpFill");

const enemyHpText = document.getElementById("enemyHpText");
const enemyMpText = document.getElementById("enemyMpText");
const playerHpText = document.getElementById("playerHpText");
const playerMpText = document.getElementById("playerMpText");
const playerExpText = document.getElementById("playerExpText");

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

let playerStatus = {
  hp: 10,
  maxHp: 10,
  mp: 1,
  maxMp: 1,
  exp: 0,
  maxExp: 5,
  atk: 1,
  def: 1,
  int: 1,
  mr: 1,
  statusPoint: 0,
};

let enemyStatus = null;

// ---------- 初期化 ----------

forwardButton.addEventListener("click", goForward);
backButton.addEventListener("click", goBack);
attackButton.addEventListener("click", () => {
  if (!enemyStatus) {
    showText("攻撃する相手がいない。");
    return;
  }

  showAttackEffect();

  const damage = calculatePhysicalDamage(playerStatus, enemyStatus);

  enemyStatus.hp -= damage;

  if (enemyStatus.hp <= 0) {
    enemyStatus.hp = 0;

    const expReward = enemyStatus.expReward;
    const gainedPoint = gainExp(expReward);

    isBattle = false;
    enemyStatus = null;

    showText(
      `こうげきした。\n` +
      `${damage}のダメージ。\n` +
      `敵は動かなくなった。\n\n` +
      `EXPを${expReward}手に入れた。` +
      createStatusPointText(gainedPoint)
    );
    return;
  }

  const enemyAttackText = createEnemyAttackText();

  showText(`こうげきした。\n${damage}のダメージ。${enemyAttackText}`);
});

magicButton.addEventListener("click", () => {
  if (!enemyStatus) {
    showText("魔法を使う相手がいない。");
    return;
  }

  if (playerStatus.mp < 1) {
    showText("MPが足りない。");
    return;
  }

  showMagicEffect();

  playerStatus.mp -= 1;

  const damage = calculateMagicDamage(playerStatus, enemyStatus);

  enemyStatus.hp -= damage;

  if (enemyStatus.hp <= 0) {
    enemyStatus.hp = 0;

    const expReward = enemyStatus.expReward;
    const gainedPoint = gainExp(expReward);

    isBattle = false;
    enemyStatus = null;

    showText(
      `魔法を使った。\n` +
      `${damage}のダメージ。\n` +
      `敵は沈黙した。\n\n` +
      `EXPを${expReward}手に入れた。` +
      createStatusPointText(gainedPoint)
    );
    return;
  }

  const enemyAttackText = createEnemyAttackText();

  showText(`魔法を使った。\n${damage}のダメージ。${enemyAttackText}`);
});

escapeButton.addEventListener("click", () => {
  isBattle = false;
  enemyStatus = null;
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
    startBattle();
    return pickRandom(theme.encounters);
  }

  isBattle = false;

  if (eventRoll < 0.50) {
    return pickRandom(SPECIAL_EVENTS);
  }

  return "移動した。";
}

function startBattle() {
  enemyStatus = {
    hp: 3,
    maxHp: 3,
    mp: 0,
    maxMp: 0,
    atk: 1,
    def: 0,
    int: 0,
    mr: 0,
    expReward: 1,
    materialReward: 1,
  };

  isBattle = true;
}

function calculatePhysicalDamage(attacker, defender) {
  const baseDamage = attacker.atk - Math.floor(defender.def / 2);
  const randomDamage = Math.floor(Math.random() * 3) - 1; // -1, 0, +1

  return Math.max(1, baseDamage + randomDamage);
}

function calculateMagicDamage(attacker, defender) {
  const baseDamage = attacker.int + 2 - Math.floor(defender.mr / 2);
  const randomDamage = Math.floor(Math.random() * 3) - 1; // -1, 0, +1

  return Math.max(1, baseDamage + randomDamage);
}

function createEnemyAttackText() {
  if (!enemyStatus) return "";

  const damage = calculatePhysicalDamage(enemyStatus, playerStatus);

  playerStatus.hp -= damage;

  if (playerStatus.hp <= 0) {
    playerStatus.hp = 0;
    isBattle = false;
    enemyStatus = null;

    return `\n\n敵の反撃。\n${damage}のダメージ。\n倒れた。`;
  }

  return `\n\n敵の反撃。\n${damage}のダメージ。`;
}

function gainExp(amount) {
  playerStatus.exp += amount;

  let gainedPoint = 0;

  while (playerStatus.exp >= playerStatus.maxExp) {
    playerStatus.exp -= playerStatus.maxExp;
    playerStatus.statusPoint += 1;
    gainedPoint += 1;
  }

  return gainedPoint;
}

function createStatusPointText(gainedPoint) {
  if (gainedPoint <= 0) return "";

  return `\nステータスポイントを${gainedPoint}手に入れた。`;
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
  renderStatusGauges();

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

function renderStatusGauges() {
  if (enemyStatus) {
    setGauge(enemyHpFill, enemyHpText, "敵HP", enemyStatus.hp, enemyStatus.maxHp);
    setGauge(enemyMpFill, enemyMpText, "敵MP", enemyStatus.mp, enemyStatus.maxMp);
  } else {
    setGauge(enemyHpFill, enemyHpText, "敵HP", 0, 0);
    setGauge(enemyMpFill, enemyMpText, "敵MP", 0, 0);
  }

  setGauge(playerHpFill, playerHpText, "HP", playerStatus.hp, playerStatus.maxHp);
  setGauge(playerMpFill, playerMpText, "MP", playerStatus.mp, playerStatus.maxMp);
  setGauge(playerExpFill, playerExpText, "EXP", playerStatus.exp, playerStatus.maxExp);
}

function setGauge(fillElement, textElement, label, currentValue, maxValue) {
  if (!fillElement || !textElement) return;

  textElement.textContent = `${label} ${currentValue}/${maxValue}`;

  if (maxValue <= 0) {
    fillElement.style.width = "0%";
    return;
  }

  const rate = Math.max(0, Math.min(100, (currentValue / maxValue) * 100));

  fillElement.style.width = `${rate}%`;
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