// localStorage. clear()
class Cookie {
  count;

  constructor() {
    this.count = 0;
  }
}

let cookieInstance = new Cookie();
const cookie = document.getElementById('cookie');
const counter = document.getElementById('counter');

let cookiesPerClick = 1;

// === Challenge Variables ===
let isChallengeActive = false;
let challengeClicks = 0;
let challengeTimeout;
const CHALLENGE_GOAL = 100;
const CHALLENGE_TIME = 20000; // 20 seconds

const challengeUI = document.getElementById('challengeUI');
const challengeTimerDisplay = document.getElementById('challengeTimer');
const challengeClicksDisplay = document.getElementById('challengeClicks');

let challengeTimeLeft = CHALLENGE_TIME / 1000; // seconds
let challengeInterval;

function updateCounter() {
  counter.textContent = cookieInstance.count;
  saveProgress();
}

function cookieClicked(e) {


  if (isChallengeActive) {
    challengeClicks++;
    updateChallengeUI();
    if (challengeClicks >= CHALLENGE_GOAL) {
      endChallenge(true);
    }
  } else {
    cookieInstance.count += cookiesPerClick;

    const rect = container.getBoundingClientRect();

    // Convert page coordinates to container-relative coordinates
    const x = e.pageX - (rect.left + window.scrollX);
    const y = e.pageY - (rect.top + window.scrollY);
    // Show floating number
    const number = new NumberClicks(x, y, cookiesPerClick);
    number.spawn();

    // Show jumping cookie image
    const jumpingCookie = new JumpingCookie(x, y, "assets/pictures/Cookie.png", 30);
    jumpingCookie.spawn();

    updateCounter();
  }
}

cookie.onclick = cookieClicked;

function shrinkCookie() {
  cookie.style.transition = 'transform 0.1s';
  cookie.style.transform = 'translate(-50%, -50%) scale(0.825)';
}

function growCookie() {
  cookie.style.transition = 'transform 0.1s';
  cookie.style.transform = 'translate(-50%, -50%) scale(1)';
}

cookie.addEventListener('mouseup', growCookie);
cookie.addEventListener('mouseleave', growCookie);
cookie.addEventListener('touchend', growCookie);
cookie.addEventListener('touchcancel', growCookie);

cookie.addEventListener('mousedown', shrinkCookie);
cookie.addEventListener('touchstart', shrinkCookie);

class Upgrade {
  multiplier;
  cost;
  active;

  constructor(multiplier, cost) {
    this.multiplier = multiplier;
    this.cost = cost;
    this.active = false;
  }
}

const upgrades = {
  '2x': new Upgrade(2, 10),
  '3x': new Upgrade(3, 30),
  '5x': new Upgrade(5, 100),
  '10x': new Upgrade(10, 5000),
};

document.getElementById('2x-multiplier').addEventListener('click', function () {
  buyMultiplier('2x', this);
});

document.getElementById('3x-multiplier').addEventListener('click', function () {
  buyMultiplier('3x', this);
});

document.getElementById('5x-multiplier').addEventListener('click', function () {
  buyMultiplier('5x', this);
});
document.getElementById('10x-multiplier').addEventListener('click', function () {
  buyMultiplier('10x', this);
});

function buyMultiplier(key, buttonElement) {
  const upgrade = upgrades[key];
  if (!upgrade || upgrade.active || isChallengeActive) return;

  if (cookieInstance.count >= upgrade.cost) {
    cookieInstance.count -= upgrade.cost;
    cookiesPerClick *= upgrade.multiplier;
    upgrade.active = true;

    updateCounter();

    buttonElement.textContent = `${upgrade.multiplier}x Active`;
    buttonElement.style.backgroundColor = 'lightgreen';

    saveProgress();
  } else {
    alert('Not enough cookies!');
  }
}

function emToPx(em) {
  const fontSize = parseFloat(getComputedStyle(document.body).fontSize);
  return em * fontSize;
}

function pxToEm(px) {
  const fontSize = parseFloat(getComputedStyle(document.body).fontSize);
  return px / fontSize;
}

const container = document.getElementById("botContainer");

const centerX = container.clientWidth / 2;
const centerY = container.clientHeight / 2;
const moveSpeed = emToPx(0.3);

class Bot {
  spotIndex;
  ring;
  el;

  constructor(spotIndex, ring, container) {
    this.spotIndex = spotIndex;
    this.ring = ring;
    this.el = document.createElement('div');
    this.el.classList.add('bot');
    container.appendChild(this.el);

    this.updatePosition(this.ring.maxDistance);
  }

  updatePosition(distance) {
    const angle = this.ring.spots[this.spotIndex];
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    const deg = angle * (180 / Math.PI) + 90;

    this.el.style.left = `${pxToEm(x)}em`;
    this.el.style.top = `${pxToEm(y)}em`;
    this.el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
  }
}

class Ring {
  minDistance;
  maxDistance;
  numBotsMax;
  currentSlotIndex;
  animationPhase;
  distance;
  bots;
  spots;

  constructor(minDistanceEm, maxDistanceEm, numBotsMax) {
    this.minDistance = emToPx(minDistanceEm);
    this.maxDistance = emToPx(maxDistanceEm);
    this.numBotsMax = numBotsMax;

    this.currentSlotIndex = 0;
    this.animationPhase = 0;
    this.distance = this.maxDistance;

    this.bots = [];
    this.spots = [];
    for (let i = 0; i < this.numBotsMax; i++) {
      this.spots.push((i / this.numBotsMax) * 2 * Math.PI);
    }
  }

  animate() {
    if (isChallengeActive) return; // Pause bots during challenge

    const step = moveSpeed;

    if (this.animationPhase === 0) {
      this.distance -= step;
      if (this.distance <= this.minDistance) {
        this.distance = this.minDistance;
        this.animationPhase = 1;
      }
    } else {
      this.distance += step;
      if (this.distance >= this.maxDistance) {
        this.distance = this.maxDistance;
        this.animationPhase = 0;

        if (this.currentSlotIndex < this.bots.length) {
          cookieInstance.count += 1;
          updateCounter();
        }

        this.currentSlotIndex = (this.currentSlotIndex + 1) % this.numBotsMax;
      }
    }

    if (this.currentSlotIndex < this.bots.length) {
      const bot = this.bots[this.currentSlotIndex];
      bot.updatePosition(this.distance);
    }
  }

  addBot() {
    if (this.bots.length >= this.numBotsMax) return false;

    const bot = new Bot(this.bots.length, this, container);
    this.bots.push(bot);
    return true;
  }
}

const rings = [
  new Ring(7, 8, 36),
  new Ring(9.5, 10.5, 48),
  new Ring(12, 13, 60),
];

let isAnimating = false;

function animate() {
  if (!isAnimating) {
    requestAnimationFrame(animate);
    return;
  }

  rings.forEach(ring => ring.animate());
  requestAnimationFrame(animate);
}

function addBot() {
  const botCost = 10;
  if (cookieInstance.count < botCost) {
    alert("Not enough cookies to buy a bot!");
    return;
  }

  for (const ring of rings) {
    if (ring.bots.length < ring.numBotsMax) {
      cookieInstance.count -= botCost;
      updateCounter();

      ring.addBot();

      saveProgress();

      if (!isAnimating) {
        isAnimating = true;
        animate();
      }
      return;
    }
  }
  alert("Maximum bots reached on all rings!");
}

document.getElementById("addBotBtn").addEventListener("click", addBot);

// ===== BotSpace Class =====
class BotSpace {
  constructor(el, type = "default") {
      this.el = el;
      this.type = type;
      this.bots = [];
      this.maxBots = 7;
  }

  spawnBot(botType, isRestore = false) {
      if (this.bots.length >= this.maxBots) {
          if (!isRestore) alert("This BotSpace is full!");
          return false;
      }

      if (!isRestore && cookieInstance.count < botType.cost) {
          alert("Not enough cookies!");
          return false;
      }

      const bot = new BannerBot(botType, this);
      this.bots.push(bot);

      if (!isRestore) {
          cookieInstance.count -= botType.cost;
          updateCounter();
      }

      return true;
  }
}


// ===== BannerBot Class =====
class BannerBot {
  constructor(botType, botSpace) {
      this.type = botType;
      this.botSpace = botSpace;
      this.cookiesPerTick = botType.cookiesPerTick;

      // Create bot DOM element
      this.el = document.createElement('img');
      this.el.src = botType.image;
      this.el.style.width = "50px";
      this.el.style.height = "50px";
      this.el.style.position = "absolute";
      this.el.style.bottom = "0";
      this.el.style.left = `${10 + botSpace.bots.length * 55}px`; // stagger bots horizontally
      this.el.style.transform = "translateX(0)";

      // Attach bot to the banner slot
      botSpace.el.appendChild(this.el);

      // Track globally for cookie production
      BannerBot.allBots.push(this);
  }

  produceCookies() {
      cookieInstance.count += this.cookiesPerTick;
      updateCounter();
  }
}

// ===== Static global array to track all BannerBots =====
BannerBot.allBots = [];

// ===== Cookie production tick =====
setInterval(() => {
  BannerBot.allBots.forEach(bot => bot.produceCookies());
}, 1000);

// ===== Bot Types =====
const botTypes = {
  emojiHappy: { name: "emojiHappy", image: "assets/pictures/emojiHappy.png", cookiesPerTick: 1, cost: 50 },
  emojiHands: { name: "emojiHands", image: "assets/pictures/emojiHands.png", cookiesPerTick: 5, cost: 100 },
  emojiThink: { name: "emojiThink", image: "assets/pictures/emojiThink.png", cookiesPerTick: 10, cost: 200 },
  emojiTongue: { name: "emojiTongue", image: "assets/pictures/emojiTongue.png", cookiesPerTick: 20, cost: 400 },
  emojiOops: { name: "emojiOops", image: "assets/pictures/emojiOops.png", cookiesPerTick: 30, cost: 600 },
  emojiDerp: { name: "emojiDerp", image: "assets/pictures/emojiDerp.png", cookiesPerTick: 50, cost: 1000 },
  emojiStar: { name: "emojiStar", image: "assets/pictures/emojiStar.png", cookiesPerTick: 100, cost: 2000 }
};

// ===== Initialize BotSpaces (banner slots) =====
const botSpaceIds = ["botSpace1", "botSpace2", "botSpace3", "botSpace4", "botSpace5", "botSpace6", "botSpace7"];
const botSpaces = botSpaceIds.map(id => new BotSpace(document.getElementById(id)));

// ===== Map buttons to bot types =====
const buttonBotMap = {
  bot1: botTypes.emojiHappy,
  bot2: botTypes.emojiHands,
  bot3: botTypes.emojiThink,
  bot4: botTypes.emojiTongue,
  bot5: botTypes.emojiOops,
  bot6: botTypes.emojiDerp,
  bot7: botTypes.emojiStar
};

// ===== Setup purchase buttons =====
botSpaces.forEach((botSpace, index) => {
  const buttonId = `bot${index + 1}`;
  const button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener('click', () => {
      const botType = buttonBotMap[buttonId];
      botSpace.spawnBot(botType);
  });
});

// === CHALLENGE FUNCTIONS ===

function startChallenge() {
  if (isChallengeActive) return;

  isChallengeActive = true;
  challengeClicks = 0;
  challengeTimeLeft = CHALLENGE_TIME / 1000;

  // Disable bots animation during challenge
  isAnimating = false;

  // Show challenge UI
  challengeUI.style.display = 'block';
  updateChallengeUI();

  alert("Challenge started! 100 clicks in 20 seconds - GO!");

  // Start countdown timer
  challengeInterval = setInterval(() => {
    challengeTimeLeft--;
    updateChallengeTimer();

    if (challengeTimeLeft <= 0) {
      endChallenge(challengeClicks >= CHALLENGE_GOAL);
    }
  }, 1000);

  // Start cookie animation for challenge (example: pulse)
  cookie.classList.add('challenge-pulse');
}

function updateChallengeUI() {
  challengeClicksDisplay.textContent = `Clicks: ${challengeClicks} / ${CHALLENGE_GOAL}`;
  challengeTimerDisplay.textContent = `Time: ${challengeTimeLeft}s`;
}

function updateChallengeTimer() {
  challengeTimerDisplay.textContent = `Time: ${challengeTimeLeft}s`;
}

function endChallenge(success) {
  isChallengeActive = false;
  clearTimeout(challengeTimeout);
  clearInterval(challengeInterval);

  // Hide challenge UI
  challengeUI.style.display = 'none';

  // Remove cookie animation
  cookie.classList.remove('challenge-pulse');

  if (success) {
    cookieInstance.count += 500;
    alert("Challenge complete! +500 cookies!");
  } else {
    cookieInstance.count -= 1000;
    if (cookieInstance.count < 0) cookieInstance.count = 0;
    alert("Challenge failed! -1000 cookies!");
  }

  updateCounter();

  // Resume bots animation if any bots exist
  if (rings.some(ring => ring.bots.length > 0)) {
    isAnimating = true;
    animate();
  }

  saveProgress();
}

document.getElementById("startChallengeBtn").addEventListener("click", startChallenge);

// theme-switcher
class Theme {
  cssFile;
  active;

  constructor(cssFile) {
    this.cssFile = cssFile;
    this.active = false;
  }
}

const themes = {
  lightmode: new Theme('assets/css-files/light-mode.css'),
  darkmode: new Theme('assets/css-files/dark-mode.css'),
  redmode: new Theme('assets/css-files/red-mode.css'),
};

let transitionsEnabled = false;



Object.keys(themes).forEach(key => {
  const theme = themes[key];
  const el = document.getElementById(key);

  el.addEventListener('click', () => switchTheme(key, el));
});

function enableTransitions() {
  if (!transitionsEnabled) {
    document.body.classList.add('transition-enabled');
    transitionsEnabled = true;
  }
}

function switchTheme(key, elClicked) {

  Object.keys(themes).forEach(k => {
    themes[k].active = false;
    const div = document.getElementById(k);
    div.style.backgroundColor = '';
  });

  themes[key].active = true;
  elClicked.style.backgroundColor = 'lightgreen';

  const link = document.getElementById('themeColors');
  link.setAttribute('href', themes[key].cssFile);
}



// === SAVE / LOAD ===
function saveProgress() {
    const progress = {
        count: cookieInstance.count,
        cookiesPerClick: cookiesPerClick,
        upgrades: {},
        skins: {},
        botsPerRing: rings.map(ring => ring.bots.length),
        botsPerBanner: botSpaces.map(botSpace =>
            botSpace.bots.map(bot => bot.type.name)
        ),
        activeTheme: Object.keys(themes).find(key => themes[key].active) || 'lightmode'
    };

    for (const key in upgrades) {
        progress.upgrades[key] = upgrades[key].active;
    }

    localStorage.setItem('cookieClickerProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('cookieClickerProgress');
    if (!saved) return;

    const progress = JSON.parse(saved);
    cookieInstance.count = progress.count || 0;
    cookiesPerClick = progress.cookiesPerClick || 1;

    for (const key in upgrades) {
        upgrades[key].active = !!progress.upgrades[key];
        if (upgrades[key].active) {
            const buttonElement = document.getElementById(`${key}-multiplier`);
            if (buttonElement) {
                buttonElement.textContent = `${upgrades[key].multiplier}x Active`;
                buttonElement.style.backgroundColor = 'lightgreen';
            }
        }
    }

    if (progress.botsPerRing) {
        progress.botsPerRing.forEach((count, index) => {
            for (let i = 0; i < count; i++) {
                rings[index].addBot();
            }
        });
    }

    if (progress.botsPerBanner) {
        progress.botsPerBanner.forEach((botNames, index) => {
            const botSpace = botSpaces[index];
            if (!Array.isArray(botNames)) return;

            botNames.forEach(name => {
                const botType = botTypes[name];
                if (botType) {
                    botSpace.spawnBot(botType, true);
                }
            });
        });
    }

    updateCounter();

    if (rings.some(ring => ring.bots.length > 0)) {
        isAnimating = true;
        animate();
    }

    const savedTheme = progress.activeTheme || 'lightmode';
    if (themes[savedTheme]) {
        const el = document.getElementById(savedTheme);
        switchTheme(savedTheme, el);
    }

    window.onload = () => {
        enableTransitions();
    };
}
// make the lightbeams spin
const img = document.getElementById('beams');
let angle = 0;
let spinning = true;

function spin() {
  if (!spinning) return;
  angle = (angle + 0.25) % 360; // increasing angle = increase spinning speed
  img.style.transform = `rotate(${angle}deg)`;
  requestAnimationFrame(spin);
}

spin();

//dropdown
class DropdownSidebar {
  container;
  headers;
  contents;

  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.headers = this.container.querySelectorAll('.side-header');
    this.contents = this.container.querySelectorAll('.dropdown-content');

    this.bindEvents();
  }

  bindEvents() {
    this.headers.forEach(header => {
      header.addEventListener('click', () => this.toggle(header));
    });
  }

  toggle(header) {
    const content = header.nextElementSibling;

    this.contents.forEach(c => {
      if (c !== content) {
        c.classList.remove('show');
      }
    });

    content.classList.toggle('show');
  }
}
document.querySelectorAll('.sidemenus').forEach(sidebar => {
  new DropdownSidebar(`#${sidebar.id}`);
});

//falling cookies
class FallingCookies{
  size;
  position;
  velocity;
  spinSpeed;
  startingAngle;
  //needs expanding!!!
}

//elements when clicking
class FloatingElement {
  constructor(x, y, fadeOutDuration = 1500) {
    this.x = x;
    this.y = y;
    this.fadeOutDuration = fadeOutDuration;
    this.element = null;
  }

  spawn() {
    this.createElement();
    document.getElementById('botContainer').appendChild(this.element);

    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.pointerEvents = "none";
    this.element.style.zIndex = "1000";
    this.element.style.opacity = "1";
  }
}

// Floating number
class NumberClicks extends FloatingElement {
  constructor(x, y, count, floatUpSpeed = 50, fadeOutDuration = 1500) {
    super(x, y, fadeOutDuration);
    this.count = count;
    this.floatUpSpeed = floatUpSpeed;
  }

  createElement() {
    const p = document.createElement("p");
    p.textContent = `+${this.count}`;
    p.style.fontSize = "20px";
    p.style.fontWeight = "bold";
    p.style.color = "white";
    this.element = p;
  }

  spawn() {
    super.spawn();

    this.element.style.transition = `transform ${this.fadeOutDuration}ms ease-out, opacity ${this.fadeOutDuration}ms ease-out`;

    requestAnimationFrame(() => {
      this.element.style.transform = `translateY(-${this.floatUpSpeed}px)`;
      this.element.style.opacity = "0";
    });

    setTimeout(() => {
      this.element.remove();
    }, this.fadeOutDuration);
  }
}

// Jumping cookie
class JumpingCookie extends FloatingElement {
  constructor(x, y, imageSrc = "cookie.png", size = 30, fadeOutDuration = 1500) {
    super(x, y, fadeOutDuration);
    this.imageSrc = imageSrc;
    this.size = size;

    this.vx = 0; // velocity x
    this.vy = 0; // velocity y
    this.gravity = 0.5; // gravity acceleration pixels/frame^2

    this.startTime = null;
    this.opacity = 1;
  }

  createElement() {
    const img = document.createElement("img");
    img.src = this.imageSrc;
    img.style.width = `${this.size}px`;
    img.style.height = `${this.size}px`;
    this.element = img;
  }

  spawn() {
    super.spawn();

    // Random angle  60° - 120° (upwards)
    const angleDeg = 60 + Math.random() * 60;
    const angleRad = angleDeg * (Math.PI / 180);
    const speed = 5 + Math.random() * 3;

    this.vx = speed * Math.cos(angleRad);
    this.vy = -speed * Math.sin(angleRad);

    this.startTime = performance.now();

    requestAnimationFrame(this.animate.bind(this));
  }

  animate(timestamp) {
    if (!this.startTime) this.startTime = timestamp;

    const elapsed = timestamp - this.startTime;

    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    this.opacity = 1 - elapsed / this.fadeOutDuration;
    if (this.opacity < 0) this.opacity = 0;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.element.style.opacity = this.opacity;

    if (elapsed < this.fadeOutDuration) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.element.remove();
    }
  }  
}



// Laad voortgang zodra script geladen is:
loadProgress();
updateCounter();



class Skin{
  name;
  cost;
  active;
  owned;

  constructor(name, cost) {
    this.name = name;
    this.cost = cost;
    this.active = false;
    this.owned = false;
  }
}
const skins = {
  'chain': new Skin("assets/pictures/pimp.png", 10000),
  'pinata': new Skin("assets/pictures/pinata.png", 8000),
  'dropCookie': new Skin("assets/pictures/Cookie.png", 0),
};

document.getElementById('chain').addEventListener('click', function () {
  changeSkin('chain', this);
});

document.getElementById('pinata').addEventListener('click', function () {
  changeSkin('pinata', this);
});

document.getElementById('dropCookie').addEventListener('click', function () {
  changeSkin('dropCookie', this);
});

function changeSkin(key, skinButton){
  const skin = skins[key];
  if (skin.owned === false){
    if (cookieInstance.count >= skin.cost) {
      cookieInstance.count -= skin.cost;
      skin.owned = true;
      skinButton.style.backgroundColor = 'lightgreen';
    } else return;
  }

  document.getElementById('cookie').src = skin.name;
  skin.active = true;

  saveProgress();

}









