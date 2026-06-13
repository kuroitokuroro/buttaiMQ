// ==================================================
// 物体迷宮 第一試作
// ==================================================

// ---------- 定数 ----------

const MAP_WIDTH = 32;
const MAP_HEIGHT = 18;

const MIN_ROOMS = 3;
const MAX_ROOMS = 7;

const MIN_ROOM_WIDTH = 4;
const MAX_ROOM_WIDTH = 8;
const MIN_ROOM_HEIGHT = 3;
const MAX_ROOM_HEIGHT = 6;

const ROOM_PLACE_ATTEMPTS = 120;

const TILE = {
  WALL: "wall",
  FLOOR: "floor",
  PLAYER: "player",
  ENEMY: "enemy",
  BOX: "box",
  EVENT: "event",
  DOOR: "door",
  STAIRS_UP: "stairsUp",
  STAIRS_DOWN: "stairsDown",
};

const TILE_SYMBOL = {
  [TILE.WALL]: "■",
  [TILE.FLOOR]: "□",
  [TILE.PLAYER]: "＠",
  [TILE.ENEMY]: "敵",
  [TILE.BOX]: "箱",
  [TILE.EVENT]: "？",
  [TILE.DOOR]: "＋",
  [TILE.STAIRS_UP]: "↑",
  [TILE.STAIRS_DOWN]: "↓",
};

const OBJECT_LOGS = {
  [TILE.ENEMY]: [
    "敵がこちらを向いた。",
    "暗がりの中で、何かが身じろぎした。",
    "それが何なのかは、まだ分からない。",
  ],
  [TILE.BOX]: [
    "箱が置かれている。",
    "宝か、罠か。開けてみるまで分からない。",
  ],
  [TILE.EVENT]: [
    "床に違和感がある。",
    "今はまだ、これ以上調べられない。",
  ],
  [TILE.STAIRS_UP]: [
    "上り階段がある。",
    "戻る処理はまだ実装されていない。",
  ],
};

// ---------- DOM取得 ----------

const mapView = document.getElementById("mapView");
const logView = document.getElementById("logView");
const floorDisplay = document.getElementById("floorDisplay");

// ---------- 状態 ----------

let floorNumber = 1;
let map = [];
let rooms = [];

const player = {
  x: 0,
  y: 0,
};

let logs = [];

// ---------- 初期化 ----------

startGame();

document.addEventListener("keydown", handleKeyDown);

// ---------- ゲーム進行 ----------

function startGame() {
  generateFloor();
  addLog("地下1階に降り立った。");
  addLog("矢印キーまたはWASDで移動できる。");
  render();
}

function generateFloor() {
  map = createFilledMap(TILE.WALL);
  rooms = [];

  createRooms();
  connectRooms();
  placePlayer();
  placeStairs();
  placeObjects();
}

function goNextFloor() {
  floorNumber += 1;
  generateFloor();

  addLog(`地下${floorNumber}階へ降りた。`);
  addLog("空気が少し変わった。");

  render();
}

// ---------- マップ生成 ----------

function createFilledMap(tileType) {
  const newMap = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = [];

    for (let x = 0; x < MAP_WIDTH; x++) {
      row.push(tileType);
    }

    newMap.push(row);
  }

  return newMap;
}

function createRooms() {
  const targetRoomCount = randomInt(MIN_ROOMS, MAX_ROOMS);
  let attempts = 0;

  while (
    rooms.length < targetRoomCount &&
    attempts < ROOM_PLACE_ATTEMPTS
  ) {
    attempts += 1;

    const width = randomInt(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
    const height = randomInt(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT);

    const x = randomInt(1, MAP_WIDTH - width - 2);
    const y = randomInt(1, MAP_HEIGHT - height - 2);

    const room = {
      x,
      y,
      width,
      height,
      centerX: Math.floor(x + width / 2),
      centerY: Math.floor(y + height / 2),
    };

    if (doesRoomOverlap(room)) continue;

    rooms.push(room);
    carveRoom(room);
  }

  if (rooms.length < 2) {
    map = createFilledMap(TILE.WALL);
    rooms = [];

    const fallbackRoom = {
      x: 4,
      y: 4,
      width: 10,
      height: 6,
      centerX: 9,
      centerY: 7,
    };

    const secondRoom = {
      x: 18,
      y: 9,
      width: 8,
      height: 5,
      centerX: 22,
      centerY: 11,
    };

    rooms.push(fallbackRoom, secondRoom);
    carveRoom(fallbackRoom);
    carveRoom(secondRoom);
  }
}

function doesRoomOverlap(newRoom) {
  return rooms.some((room) => {
    const hasGap =
      newRoom.x + newRoom.width + 1 < room.x ||
      room.x + room.width + 1 < newRoom.x ||
      newRoom.y + newRoom.height + 1 < room.y ||
      room.y + room.height + 1 < newRoom.y;

    return !hasGap;
  });
}

function carveRoom(room) {
  for (let y = room.y; y < room.y + room.height; y++) {
    for (let x = room.x; x < room.x + room.width; x++) {
      map[y][x] = TILE.FLOOR;
    }
  }
}

function connectRooms() {
  for (let i = 1; i < rooms.length; i++) {
    const previousRoom = rooms[i - 1];
    const currentRoom = rooms[i];

    carveCorridor(
      previousRoom.centerX,
      previousRoom.centerY,
      currentRoom.centerX,
      currentRoom.centerY,
    );
  }
}

function carveCorridor(startX, startY, endX, endY) {
  let x = startX;
  let y = startY;

  while (x !== endX) {
    map[y][x] = TILE.FLOOR;
    x += x < endX ? 1 : -1;
  }

  while (y !== endY) {
    map[y][x] = TILE.FLOOR;
    y += y < endY ? 1 : -1;
  }

  map[y][x] = TILE.FLOOR;

  placeDoorNearRoom(startX, startY, endX, endY);
}

function placeDoorNearRoom(startX, startY, endX, endY) {
  const doorCandidates = [
    { x: startX, y: startY },
    { x: endX, y: endY },
  ];

  doorCandidates.forEach((candidate) => {
    if (map[candidate.y]?.[candidate.x] === TILE.FLOOR) {
      if (Math.random() < 0.35) {
        map[candidate.y][candidate.x] = TILE.DOOR;
      }
    }
  });
}

// ---------- 配置 ----------

function placePlayer() {
  const firstRoom = rooms[0];

  player.x = firstRoom.centerX;
  player.y = firstRoom.centerY;
}

function placeStairs() {
  const firstRoom = rooms[0];
  const lastRoom = rooms[rooms.length - 1];

  map[firstRoom.centerY][firstRoom.centerX] = TILE.STAIRS_UP;
  map[lastRoom.centerY][lastRoom.centerX] = TILE.STAIRS_DOWN;
}

function placeObjects() {
  placeRandomObjects(TILE.ENEMY, randomInt(2, 5));
  placeRandomObjects(TILE.BOX, randomInt(1, 3));
  placeRandomObjects(TILE.EVENT, randomInt(1, 3));
}

function placeRandomObjects(tileType, count) {
  let placed = 0;
  let attempts = 0;

  while (placed < count && attempts < 200) {
    attempts += 1;

    const position = getRandomFloorPosition();

    if (!position) return;
    if (position.x === player.x && position.y === player.y) continue;

    map[position.y][position.x] = tileType;
    placed += 1;
  }
}

function getRandomFloorPosition() {
  const candidates = [];

  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      if (map[y][x] === TILE.FLOOR) {
        candidates.push({ x, y });
      }
    }
  }

  if (candidates.length === 0) return null;

  return candidates[randomInt(0, candidates.length - 1)];
}

// ---------- 入力 ----------

function handleKeyDown(event) {
  const key = event.key.toLowerCase();

  const direction = getDirectionFromKey(key);

  if (!direction) return;

  event.preventDefault();

  movePlayer(direction.dx, direction.dy);
}

function getDirectionFromKey(key) {
  const directions = {
    arrowup: { dx: 0, dy: -1 },
    w: { dx: 0, dy: -1 },

    arrowdown: { dx: 0, dy: 1 },
    s: { dx: 0, dy: 1 },

    arrowleft: { dx: -1, dy: 0 },
    a: { dx: -1, dy: 0 },

    arrowright: { dx: 1, dy: 0 },
    d: { dx: 1, dy: 0 },
  };

  return directions[key] || null;
}

// ---------- 移動 ----------

function movePlayer(dx, dy) {
  const nextX = player.x + dx;
  const nextY = player.y + dy;

  if (!isInsideMap(nextX, nextY)) return;

  const nextTile = map[nextY][nextX];

  if (nextTile === TILE.WALL) {
    addLog("壁がある。");
    render();
    return;
  }

  player.x = nextX;
  player.y = nextY;

  handleTileStep(nextTile);
  render();
}

function handleTileStep(tileType) {
  if (tileType === TILE.STAIRS_DOWN) {
    goNextFloor();
    return;
  }

  if (tileType === TILE.DOOR) {
    addLog("扉をくぐった。");
    return;
  }

  const tileLogs = OBJECT_LOGS[tileType];

  if (!tileLogs) return;

  tileLogs.forEach((message) => addLog(message));
}

function isInsideMap(x, y) {
  return (
    x >= 0 &&
    x < MAP_WIDTH &&
    y >= 0 &&
    y < MAP_HEIGHT
  );
}

// ---------- 描画 ----------

function render() {
  floorDisplay.textContent = `B${floorNumber}F`;
  renderMap();
  renderLogs();
}

function renderMap() {
  const lines = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    let line = "";

    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === player.x && y === player.y) {
        line += TILE_SYMBOL[TILE.PLAYER];
      } else {
        line += TILE_SYMBOL[map[y][x]];
      }
    }

    lines.push(line);
  }

  mapView.textContent = lines.join("\n");
}

function renderLogs() {
  logView.innerHTML = "";

  logs.slice(-5).forEach((message) => {
    const line = document.createElement("div");
    line.textContent = `> ${message}`;
    logView.appendChild(line);
  });
}

// ---------- ログ ----------

function addLog(message) {
  logs.push(message);

  if (logs.length > 40) {
    logs = logs.slice(-40);
  }
}

// ---------- 汎用 ----------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}