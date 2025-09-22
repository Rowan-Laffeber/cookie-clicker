// ===== Cookie clicker logic =====

class Cookie {
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

// ===== Upgrades =====

class Upgrade {
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
  if (!upgrade || upgrade.active) return;  // Already bought or invalid

  if (cookieInstance.count >= upgrade.cost) {
    cookieInstance.count -= upgrade.cost;
    cookiesPerClick *= upgrade.multiplier;
    upgrade.active = true;

    updateCounter();

    buttonElement.textContent = `${upgrade.multiplier}x Active`;
    buttonElement.style.backgroundColor = 'lightgreen';
  } else {
    alert('Not enough cookies!');
  }
}

// ===== Bot orbit animation =====

const container = document.getElementById("botContainer");

const centerX = container.clientWidth / 2;
const centerY = container.clientHeight / 2;
const moveSpeed = 3;

// Bot class stores spotIndex, references ring, handles its own DOM & position
class Bot {
  constructor(spotIndex, ring, container) {
    this.spotIndex = spotIndex;
    this.ring = ring;
    this.el = document.createElement('div');
    this.el.classList.add('bot');
    container.appendChild(this.el);

    // Initial position at maxDistance
    this.updatePosition(this.ring.maxDistance);
  }

  updatePosition(distance) {
    const angle = this.ring.spots[this.spotIndex];
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    const deg = angle * (180 / Math.PI) + 90;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
  }
}

// Ring class to hold ring parameters and state
class Ring {
  constructor(minDistance, maxDistance, numBotsMax) {
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
    this.numBotsMax = numBotsMax;

    this.currentSlotIndex = 0;
    this.animationPhase = 0; // 0 = inward, 1 = outward
    this.distance = maxDistance;

    this.bots = [];
    this.spots = [];
    for (let i = 0; i < this.numBotsMax; i++) {
      this.spots.push((i / this.numBotsMax) * 2 * Math.PI);
    }
  }

  // Animate this ring one slot at a time, full cycle per slot, independent of bots presence
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

    // Move bot at current slot if exists
    if (this.currentSlotIndex < this.bots.length) {
      const bot = this.bots[this.currentSlotIndex];
      bot.updatePosition(this.distance);
    }
  }

  // Add a bot to this ring
  addBot() {
    if (this.bots.length >= this.numBotsMax) return false;

    const bot = new Bot(this.bots.length, this, container);
    this.bots.push(bot);
    return true;
  }
}

// Create rings array for easy management
const rings = [
  new Ring(110, 130, 36),
  new Ring(150, 170, 48),
];

let isAnimating = false;

// Animate all rings together
function animate() {
  if (!isAnimating) {
    requestAnimationFrame(animate);
    return;
  }

  rings.forEach(ring => ring.animate());

  requestAnimationFrame(animate);
}

// Add bot to rings in order, start animation if not running
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

// ===== Optional test class =====
class Hallo {
  hallo() {
    console.log("hallo");
  }
}
let hello = new Hallo();
hello.name = "hoi";
hello.hallo();

