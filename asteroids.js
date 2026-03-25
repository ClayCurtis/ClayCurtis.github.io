(function () {
  let canvas, ctx, animFrame;
  let ship, bullets, targets, particles;
  let keys = {};
  let active = false;

  //Helpers
  function getRandColor() {
    const colors = ['#ffffff', '#aad4f5', '#88bbee', '#ccddff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  //Particle
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1.0;
      this.decay = Math.random() * 0.04 + 0.02;
      this.size = Math.random() * 3 + 1;
      this.color = getRandColor();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.life -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    isDead() { return this.life <= 0; }
  }

  //Ship
  class Ship {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.angle = -Math.PI / 2;
      this.rotSpeed = 0.045;
      this.thrust = 0.10;
      this.friction = 0.98;
      this.size = 14;
      this.shootCooldown = 0;
    }

    update() {
      if (keys['ArrowLeft'] || keys['a'])  this.angle -= this.rotSpeed;
      if (keys['ArrowRight'] || keys['d']) this.angle += this.rotSpeed;

      if (keys['ArrowUp'] || keys['w']) {
        this.vx += Math.cos(this.angle) * this.thrust;
        this.vy += Math.sin(this.angle) * this.thrust;
      }

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;

      const W = canvas.width, H = canvas.height;
      if (this.x < 0)  this.x += W;
      if (this.x > W)  this.x -= W;
      if (this.y < 0)  this.y += H;
      if (this.y > H)  this.y -= H;

      if (this.shootCooldown > 0) this.shootCooldown--;

      if ((keys[' '] || keys['Space']) && this.shootCooldown === 0) {
        bullets.push(new Bullet(
          this.x + Math.cos(this.angle) * this.size,
          this.y + Math.sin(this.angle) * this.size,
          this.angle
        ));
        this.shootCooldown = 22;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = '#063970';
      ctx.strokeStyle = '#063970';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.size, 0);
      ctx.lineTo(-this.size * 0.7, -this.size * 0.6);
      ctx.lineTo(-this.size * 0.3, 0);
      ctx.lineTo(-this.size * 0.7, this.size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (keys['ArrowUp'] || keys['w']) {
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.3, -this.size * 0.25);
        ctx.lineTo(-this.size * 0.8 - Math.random() * 6, 0);
        ctx.lineTo(-this.size * 0.3, this.size * 0.25);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  //Bullet
  class Bullet {
    constructor(x, y, angle) {
      this.x = x;
      this.y = y;
      this.speed = 6;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.life = 120;
      this.radius = 3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;

      const W = canvas.width, H = canvas.height;
      if (this.x < 0)  this.x += W;
      if (this.x > W)  this.x -= W;
      if (this.y < 0)  this.y += H;
      if (this.y > H)  this.y -= H;
    }

    draw() {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    isDead() { return this.life <= 0; }
  }

  //Targets
  function getTextRect(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect();
  }

  function collectTargets() {
    const selector = 'h1, h2, h3, h4, p, li, strong, i, a, span';
    const results = [];
    document.querySelectorAll(selector).forEach(el => {
      if (el.id === 'asteroids-trigger') return;
      if (el.closest('#asteroids-trigger')) return;
      if (!el.textContent.trim()) return;
      const dropdown = el.closest('.dropdown-content');
      if (dropdown && !dropdown.classList.contains('show')) return;
      const rect = getTextRect(el);
      if (rect.width > 0 && rect.height > 0) results.push({ el, rect });
    });
    return results;
  }

  function checkCollisions() {
    bullets.forEach((b, bi) => {
      targets.forEach(t => {
        if (!t.el) return;
        const r = getTextRect(t.el);
        if (b.x > r.left && b.x < r.right && b.y > r.top && b.y < r.bottom) {
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          for (let i = 0; i < 18; i++) particles.push(new Particle(cx, cy));
          t.el.style.visibility = 'hidden';
          t.el = null;
          bullets[bi].life = 0;
        }
      });
    });
    targets = targets.filter(t => t.el !== null);
  }

  //Game Loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.update();
    ship.draw();
    bullets.forEach(b => { b.update(); b.draw(); });
    bullets = bullets.filter(b => !b.isDead());
    particles.forEach(p => { p.update(); p.draw(); });
    particles = particles.filter(p => !p.isDead());
    checkCollisions();
    animFrame = requestAnimationFrame(loop);
  }

  //Init / Destroy
  function launch(spawnX, spawnY) {
    if (active) return;
    active = true;

    canvas = document.createElement('canvas');
    canvas.id = 'asteroids-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 99999;
    `;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const trigger = document.getElementById('asteroids-trigger');
    if (trigger) trigger.style.visibility = 'hidden';

    ship = new Ship(spawnX, spawnY);
    bullets = [];
    particles = [];
    targets = collectTargets();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);

    loop();
  }

  function destroy() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(animFrame);
    canvas.remove();
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);

    document.querySelectorAll('[style*="visibility: hidden"]').forEach(el => {
      el.style.visibility = '';
    });

    const trigger = document.getElementById('asteroids-trigger');
    if (trigger) trigger.style.visibility = '';

    keys = {};
  }

  function onKeyDown(e) {
    keys[e.key] = true;
    if (e.key === 'Escape') destroy();
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  }

  function onKeyUp(e) { keys[e.key] = false; }

  function onResize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    targets = collectTargets();
  }

  //Public API 
  window.launchAsteroids = function () {
    const trigger = document.getElementById('asteroids-trigger');
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      launch(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      launch(window.innerWidth / 2, window.innerHeight / 2);
    }
  };

  window.refreshAsteroidsTargets = function () {
    if (active) targets = collectTargets();
  };

})();