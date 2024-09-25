class Blade {
  constructor(effect) {
    this.effect = effect;
    this.len = this.effect.width / 3;
    this.angle = toRad(270);
    this.w1 = new Vector(this.effect.width / 2, this.effect.height);
    this.w2 = new Vector(
      this.w1.x + this.len * Math.cos(this.angle),
      this.w1.y + this.len * Math.sin(this.angle)
    );
    this.bobX = this.w2.x;
    this.bobY = this.w2.y;
    this.bobRadius = 60;
    this.speed = toRad(0.9);
  }
  draw(ctx) {
    ctx.lineWidth = 6;
    ctx.strokeStyle = "grad1";
    ctx.beginPath();
    ctx.moveTo(this.w1.x, this.w1.y);
    ctx.lineTo(this.w2.x, this.w2.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = grad1;
    ctx.arc(this.bobX, this.bobY, this.bobRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  connectParticles(ctx) {}
  update() {
    this.w1 = new Vector(this.effect.width / 2, this.effect.height);
    this.w2 = new Vector(
      this.w1.x + this.len * Math.cos(this.angle),
      this.w1.y + this.len * Math.sin(this.angle)
    );
    this.angle += this.speed;

    if (this.angle < toRad(150) || this.angle > toRad(390)) {
      this.speed *= -1;
    }
    this.bobX = this.w2.x;
    this.bobY = this.w2.y;
  }
}
class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.random() * 2.5 + 2.5;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.velX = Math.random() * 1 - 0.5;
    this.velY = Math.random() * 1 - 0.5;
  }
  draw(ctx) {
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    if (this.x < this.radius) {
      this.x = this.radius;
      this.velX *= -1;
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.velX *= -1;
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.velY *= -1;
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.velY *= -1;
    }
    this.x += this.velX;
    this.y += this.velY;
  }
  collision() {
    let dx = this.x - this.effect.blade.bobX;
    let dy = this.y - this.effect.blade.bobY;
    let distance = Math.hypot(dx, dy);
    let force = this.effect.blade.bobRadius / distance;
    if (distance < this.effect.blade.bobRadius + this.radius) {
      let angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * force * 10;
      this.y += Math.sin(angle) + force * 10;
    }
  }
  reset() {
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2);
  }
}
class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numParticles = 400;
    this.blade = new Blade(this);
    this.maxDistance = 50;

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(new Particle(this));
    }
    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
  }
  connectParticles(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i; j < this.particles.length; j++) {
        let dx = this.particles[i].x - this.particles[j].x;
        let dy = this.particles[i].y - this.particles[j].y;
        let distance = Math.hypot(dx, dy);
        if (distance < this.maxDistance) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = grad;
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }
  resize(width, height) {
    canvas.width = width;
    canvas.height = height;
    this.width = width;
    this.height = height;
    this.blade.len = width / 3;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "white");
    grad.addColorStop(0.5, "blue");
    grad.addColorStop(1, "orange");

    const grad1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad1.addColorStop(0, "white");
    grad1.addColorStop(0.5, "blue");
    grad1.addColorStop(1, "orange");

    this.particles.forEach((particle) => particle.reset());
  }
  render(ctx) {
    this.connectParticles(ctx);
    this.particles.forEach((particle) => {
      particle.draw(ctx);
      particle.update();
      particle.collision();
    });
    this.connectParticles(ctx);
    this.blade.draw(ctx);
    this.blade.update();
  }
}
