<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>bot animation</title>
  <style>
    html, body {
        margin: 0;
        padding: 0;
    }
    body {
        background: #222;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        overflow: hidden;
        gap: 20px;
        color: white;
        font-family: sans-serif;
    }

    .container {
        position: relative;
        width: 400px;
        height: 400px;
        border: 1px solid #444;
        box-sizing: border-box;
    }

    .center {
        position: absolute;
        width: 200px;
        height: 200px;
        background: gold;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }

    .bot {
        position: absolute;
        width: 15px;
        height: 15px;
        background: cyan;
        border-radius: 50%;
        transform-origin: 50% 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background: #444;
      border: none;
      border-radius: 5px;
      color: white;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background: #666;
    }
  </style>
</head>
<body>

  <button id="addBotBtn">Add Bot</button>

  <div class="container" id="container">
    <div class="center" id="center"></div>
  </div>

  <script>
    const container = document.getElementById("container");

    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;
    const moveSpeed = 3;

    class Bot {
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
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
        this.el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
      }
    }

    class Ring {
      constructor(minDistance, maxDistance, numBotsMax) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.numBotsMax = numBotsMax;

        this.currentSlotIndex = 0;
        this.animationPhase = 0;
        this.distance = maxDistance;

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
      new Ring(110, 130, 36),
      new Ring(150, 170, 48),
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
      for (const ring of rings) {
        if (ring.bots.length < ring.numBotsMax) {
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
  </script>
</body>
</html>
