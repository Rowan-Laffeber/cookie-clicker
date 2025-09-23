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

function updateCounter() {
  counter.textContent = cookieInstance.count;
}

function cookieClicked() {
  cookieInstance.count += cookiesPerClick;
  updateCounter();
  saveProgress();
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
};

document.getElementById('2x-multiplier').addEventListener('click', function() {
  buyMultiplier('2x', this);
});

document.getElementById('3x-multiplier').addEventListener('click', function() {
  buyMultiplier('3x', this);
});

document.getElementById('5x-multiplier').addEventListener('click', function() {
  buyMultiplier('5x', this);
});

function buyMultiplier(key, buttonElement) {
  const upgrade = upgrades[key];
  if (!upgrade || upgrade.active) return;

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
const moveSpeed = emToPx(0.2); 

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

//test class voor oefenen
class Enemy {
  constructor(health) {
    const savedHealth = localStorage.getItem('enemyHealth');
    this.health = savedHealth !== null ? Number(savedHealth) : health;

function saveProgress() {
  const progress = {
    count: cookieInstance.count,
    cookiesPerClick: cookiesPerClick,
    upgrades: {},
    botsPerRing: rings.map(ring => ring.bots.length),
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
    upgrades[key].active = progress.upgrades[key] || false;
    const button = document.getElementById(`${key}-multiplier`);
    if (upgrades[key].active) {
      button.textContent = `${upgrades[key].multiplier}x Active`;
      button.style.backgroundColor = 'lightgreen';
    } else {
      button.textContent = `${upgrades[key].multiplier}x`;
      button.style.backgroundColor = '';
    }
  }

  updateCounter();

  // Voeg bots toe volgens opgeslagen aantal
  if (progress.botsPerRing) {
    rings.forEach((ring, index) => {
      const botsToAdd = progress.botsPerRing[index] || 0;
      for (let i = 0; i < botsToAdd; i++) {
        ring.addBot();
      }
    });

    if (rings.some(ring => ring.bots.length > 0)) {
      isAnimating = true;
      animate();
    }
  }
}

// Laad voortgang zodra script geladen is:
loadProgress();
updateCounter();

class Hallo {
  name;
  hallo() {
    console.log("hallo");
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;

    localStorage.setItem('enemyHealth', this.health);

    console.log(`Enemy took ${amount} damage, health now: ${this.health}`);
  }
}

class Player {
  constructor(damage) {
    this.damage = damage;
  }

  giveDamage(enemy) {
    enemy.takeDamage(this.damage);
  }
}

const enemy = new Enemy(100);
const player = new Player(2);

player.giveDamage(enemy);
