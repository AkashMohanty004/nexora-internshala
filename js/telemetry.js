/* ==========================================================================
   NEXORA TELEMETRY PAGE INTERACTIVE VISUALS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Background Particles
  if (window.NexoraParticles) {
    new window.NexoraParticles('bg-canvas');
  }

  // 2. Large 30-Day Focus Area Line Chart
  const initBigChart = () => {
    const canvas = document.getElementById('big-focus-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    // Generate data: 30 days of focus percentages (50% to 95%)
    let dataPoints = [];
    const dates = [];
    const count = 30;
    
    let currentVal = 70;
    for (let i = 0; i < count; i++) {
      currentVal += (Math.random() - 0.48) * 12;
      currentVal = Math.max(52, Math.min(96, currentVal));
      dataPoints.push(Math.round(currentVal));
      
      const d = new Date();
      d.setDate(d.getDate() - (count - 1 - i));
      dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    let hoveredIndex = null;
    
    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      draw();
    }
    
    function draw() {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      ctx.clearRect(0, 0, w, h);
      
      const paddingX = 40;
      const paddingY = 30;
      
      const chartW = w - paddingX * 2;
      const chartH = h - paddingY * 2;
      
      const stepX = chartW / (count - 1);
      
      // Calculate Y coords
      const minVal = 40;
      const maxVal = 100;
      const range = maxVal - minVal;
      
      const points = dataPoints.map((val, idx) => {
        const px = paddingX + idx * stepX;
        const py = paddingY + chartH - ((val - minVal) / range) * chartH;
        return { x: px, y: py, val: val, date: dates[idx] };
      });
      
      // Draw Grid Lines (Horizontal)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.font = '9px "Share Tech Mono"';
      ctx.fillStyle = '#525262';
      ctx.textBaseline = 'middle';
      
      for (let g = 0; g <= 4; g++) {
        const yVal = minVal + g * (range / 4);
        const gy = paddingY + chartH - (g / 4) * chartH;
        ctx.beginPath();
        ctx.moveTo(paddingX, gy);
        ctx.lineTo(w - paddingX, gy);
        ctx.stroke();
        ctx.fillText(`${yVal}%`, 10, gy);
      }
      
      // Draw Area Gradient Underneath
      ctx.save();
      const areaGrad = ctx.createLinearGradient(0, paddingY, 0, h - paddingY);
      areaGrad.addColorStop(0, 'rgba(0, 245, 255, 0.15)');
      areaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = areaGrad;
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, h - paddingY);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, h - paddingY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      
      // Draw Main Glow Line
      ctx.save();
      ctx.strokeStyle = 'var(--accent-cyan)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'var(--accent-cyan)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();
      
      // Draw Crosshair Indicator if Hovered
      if (hoveredIndex !== null && points[hoveredIndex]) {
        const p = points[hoveredIndex];
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, paddingY);
        ctx.lineTo(p.x, h - paddingY);
        ctx.stroke();
        
        ctx.fillStyle = 'var(--accent-cyan)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'var(--accent-cyan)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Tooltip text
        const txt = `${p.val}% Sync // ${p.date}`;
        ctx.font = '10px "Inter"';
        const txtW = ctx.measureText(txt).width + 16;
        const tx = Math.min(Math.max(10, p.x - txtW/2), w - txtW - 10);
        const ty = p.y - 35;
        
        ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(tx, ty, txtW, 24);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, tx + txtW/2, ty + 12);
        ctx.textAlign = 'left';
      }
      
      // Draw bottom dates labels
      ctx.fillStyle = '#525262';
      ctx.font = '8px "Share Tech Mono"';
      ctx.textBaseline = 'top';
      ctx.fillText(dates[0], paddingX, h - paddingY + 8);
      ctx.textAlign = 'right';
      ctx.fillText(dates[dates.length - 1], w - paddingX, h - paddingY + 8);
      ctx.textAlign = 'left';
    }
    
    canvas.addEventListener('mousemove', (e) => {
      const crect = canvas.getBoundingClientRect();
      const mx = e.clientX - crect.left;
      
      const paddingX = 40;
      const chartW = crect.width - paddingX * 2;
      const stepX = chartW / (count - 1);
      
      let closestIdx = Math.round((mx - paddingX) / stepX);
      closestIdx = Math.max(0, Math.min(count - 1, closestIdx));
      
      if (hoveredIndex !== closestIdx) {
        hoveredIndex = closestIdx;
        draw();
      }
    });
    
    canvas.addEventListener('mouseleave', () => {
      hoveredIndex = null;
      draw();
    });
    
    window.addEventListener('resize', resize);
    resize();
  };
  
  initBigChart();

  // 3. Fluctuating Brainwave Radar Chart Points
  const animateRadar = () => {
    const radarPoly = document.getElementById('radar-poly');
    if (!radarPoly) return;
    
    const center = 110;
    const maxRadius = 80;
    
    // Strengths targets: [Quantum, NeuroAI, BioSynth, Focus, Autonomy]
    let baseStrengths = [0.82, 0.65, 0.88, 0.78, 0.45];
    let angles = [
      -Math.PI / 2,                  // Quantum (Top)
      -Math.PI / 2 + (Math.PI * 2)/5,  // NeuroAI
      -Math.PI / 2 + (Math.PI * 2)*2/5,// BioSynth
      -Math.PI / 2 + (Math.PI * 2)*3/5,// Focus
      -Math.PI / 2 + (Math.PI * 2)*4/5 // Autonomy
    ];
    
    let time = 0;
    
    const render = () => {
      time += 0.035;
      
      // Calculate fluctuated coordinates
      const coords = baseStrengths.map((str, idx) => {
        const noise = Math.sin(time + idx * 1.5) * 0.03;
        const radius = (str + noise) * maxRadius;
        const x = center + Math.cos(angles[idx]) * radius;
        const y = center + Math.sin(angles[idx]) * radius;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      
      radarPoly.setAttribute('points', coords.join(' '));
      requestAnimationFrame(render);
    };
    
    render();
  };
  
  animateRadar();
});
