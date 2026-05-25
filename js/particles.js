/* ==========================================================================
   NEXORA INTERACTIVE CANVAS PARTICLES & ORBS
   ========================================================================== */

class NexoraParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.glowOrbs = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.mouseMove(e));
    window.addEventListener('mouseleave', () => this.mouseLeave());
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.createGlowOrbs();
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  
  mouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }
  
  mouseLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }
  
  createParticles() {
    this.particles = [];
    const count = Math.min(Math.floor((this.width * this.height) / 18000), 75);
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  createGlowOrbs() {
    this.glowOrbs = [
      {
        x: this.width * 0.8,
        y: this.height * 0.2,
        vx: 0.1,
        vy: -0.05,
        radius: 300,
        color: 'rgba(0, 245, 255, 0.05)'
      },
      {
        x: this.width * 0.2,
        y: this.height * 0.8,
        vx: -0.08,
        vy: 0.1,
        radius: 350,
        color: 'rgba(189, 92, 255, 0.04)'
      }
    ];
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // 1. Draw drifting orbs
    this.drawOrbs();
    
    // 2. Draw connecting mesh and dots
    this.drawMesh();
  }
  
  drawOrbs() {
    this.glowOrbs.forEach(orb => {
      orb.x += orb.vx;
      orb.y += orb.vy;
      
      // Boundary check
      if (orb.x < -orb.radius || orb.x > this.width + orb.radius) orb.vx *= -1;
      if (orb.y < -orb.radius || orb.y > this.height + orb.radius) orb.vy *= -1;
      
      const gradient = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  drawMesh() {
    const size = this.particles.length;
    
    // Move and draw particles
    for (let i = 0; i < size; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      
      // Screen wrap
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
      
      // Mouse push effect
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }
      }
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Drawing lines between close particles
      for (let j = i + 1; j < size; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const grad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          const alpha = (1 - (dist / 120)) * 0.12;
          
          grad.addColorStop(0, `rgba(0, 245, 255, ${alpha})`);
          grad.addColorStop(1, `rgba(189, 92, 255, ${alpha})`);
          
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
      
      // Line to mouse
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius - 20) {
          const alpha = (1 - (dist / (this.mouse.radius - 20))) * 0.15;
          this.ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }
  }
}

// Attach to global window
window.NexoraParticles = NexoraParticles;
