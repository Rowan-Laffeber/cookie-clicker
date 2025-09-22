<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bot Animation with Add Button & Consistent Cycle</title>
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

    const numBotsMax = 36;
    const minDistance = 110;
    const maxDistance = 130;
    const moveSpeed = 2;

    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    // Precompute fixed angles/spots
    const spots = [];
    for (let i = 0; i < numBotsMax; i++) {
      const angle = (i / numBotsMax) * 2 * Math.PI;
      spots.push(angle);
    }

    const bots = [];

    let currentSlotIndex = 0;
    let isAnimating = false;
    let animationPhase = 0; // 0 = moving inward, 1 = moving outward
    let distance = maxDistance;

    // Animate function: animates one slot at a time, regardless of bot presence
    function animate() {
      if (!isAnimating) {
        requestAnimationFrame(animate);
        return;
      }

      // Total distance range for animation
      const distanceRange = maxDistance - minDistance;
      const step = moveSpeed;

      // Move distance in the current direction
      if (animationPhase === 0) {
        distance -= step;
        if (distance <= minDistance) {
          distance = minDistance;
          animationPhase = 1;
        }
      } else {
        distance += step;
        if (distance >= maxDistance) {
          distance = maxDistance;
          animationPhase = 0;

          // Move to next slot after a full in-out animation cycle
          currentSlotIndex = (currentSlotIndex + 1) % numBotsMax;
        }
      }

      // If bot exists at this slot, update its position
      if (currentSlotIndex < bots.length) {
        const bot = bots[currentSlotIndex];
        const x = centerX + distance * Math.cos(bot.angle);
        const y = centerY + distance * Math.sin(bot.angle);
        const deg = bot.angle * (180 / Math.PI) + 90;
        bot.el.style.left = `${x}px`;
        bot.el.style.top = `${y}px`;
        bot.el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
      }

      requestAnimationFrame(animate);
    }

    // Add a bot at the next free spot
    function addBot() {
      if (bots.length >= numBotsMax) {
        alert("Maximum bots reached!");
        return;
      }
      const i = bots.length;
      const angle = spots[i];

      const botEl = document.createElement("div");
      botEl.classList.add("bot");

      const x = centerX + maxDistance * Math.cos(angle);
      const y = centerY + maxDistance * Math.sin(angle);
      const deg = angle * (180 / Math.PI) + 90;

      botEl.style.left = `${x}px`;
      botEl.style.top = `${y}px`;
      botEl.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;

      container.appendChild(botEl);

      bots.push({
        el: botEl,
        angle: angle,
      });

      // Start animating if not started yet
      if (!isAnimating) {
        isAnimating = true;
        animate();
      }
    }

    const addBotBtn = document.getElementById("addBotBtn");
    addBotBtn.addEventListener("click", addBot);
  </script>
</body>
</html>
