class Cookie {
    constructor() {
      this.count = 0;
    }
  }
  
  let cookieInstance = new Cookie();
  const cookie = document.getElementById('cookie');
  const counter = document.getElementById('counter');
  
  function updateCounter() {
    counter.textContent = cookieInstance.count;
  }
  let cookiesPerClick = 1;
  function cookieClicked() {
    cookieInstance.count += cookiesPerClick;
    updateCounter();
  }
  
  cookie.onclick = cookieClicked;
  
  function shrinkCookie() {
    cookie.style.transition = 'transform 0.1s';
    cookie.style.transform = 'scale(0.825)';
  }
  
  function growCookie() {
    cookie.style.transition = 'transform 0.1s';
    cookie.style.transform = 'scale(1)';
  }
  
  cookie.addEventListener('mouseup', growCookie);
  cookie.addEventListener('mouseleave', growCookie);
  cookie.addEventListener('touchend', growCookie);
  cookie.addEventListener('touchcancel', growCookie);
  
  cookie.addEventListener('mousedown', shrinkCookie);
  cookie.addEventListener('touchstart', shrinkCookie);
  
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
    // add more as needed
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
  