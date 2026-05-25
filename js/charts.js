/* ==========================================================================
   NEXORA CUSTOM HIGH-TECH CANVAS CHARTS
   ========================================================================== */

class NexoraCharts {
  static initHeatmap(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    let blocks = [];
    let hoveredBlock = null;
    
    // Grid settings
    const rows = 7;
    const cols = 28;
    const spacing = 4;
    const rounded = 3;
    
    const colors = [
      'rgba(255, 255, 255, 0.03)', // Empty/Minimal
      'rgba(0, 245, 255, 0.15)',   // Low Sync
      'rgba(0, 245, 255, 0.35)',   // Medium Sync
      'rgba(189, 92, 255, 0.55)',  // High Sync
      'rgba(189, 92, 255, 0.85)'   // Overload Sync
    ];
    
    const glowColors = [
      'transparent',
      'rgba(0, 245, 255, 0.2)',
      'rgba(0, 245, 255, 0.4)',
      'rgba(189, 92, 255, 0.5)',
      'rgba(189, 92, 255, 0.8)'
    ];

    function resize() {
      const rect = container.getBoundingClientRect();
      // Set high pixel density
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      
      generateBlocks(rect.width, rect.height);
      draw();
    }
    
    function generateBlocks(width, height) {
      blocks = [];
      const headerSpace = 20;
      const leftLabelSpace = 25;
      
      const availableWidth = width - leftLabelSpace;
      const availableHeight = height - headerSpace;
      
      const boxWidth = Math.min((availableWidth - (cols - 1) * spacing) / cols, 15);
      const boxHeight = Math.min((availableHeight - (rows - 1) * spacing) / rows, 15);
      
      const startX = leftLabelSpace + (availableWidth - (cols * (boxWidth + spacing))) / 2;
      const startY = headerSpace + (availableHeight - (rows * (boxHeight + spacing))) / 2;
      
      const seed = Math.random();
      
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Semi-random yet structured distribution for cognitive waves
          let level = 0;
          const dist = Math.sin((c / cols) * Math.PI) * Math.cos((r / rows) * Math.PI);
          const randVal = Math.random();
          
          if (randVal < 0.15) {
            level = 0;
          } else {
            const score = dist * 0.6 + randVal * 0.4;
            if (score < 0.3) level = 1;
            else if (score < 0.55) level = 2;
            else if (score < 0.8) level = 3;
            else level = 4;
          }
          
          // Generate realistic dates
          const date = new Date();
          date.setDate(date.getDate() - ((cols - 1 - c) * 7 + (rows - 1 - r)));
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          blocks.push({
            x: startX + c * (boxWidth + spacing),
            y: startY + r * (boxHeight + spacing),
            w: boxWidth,
            h: boxHeight,
            level: level,
            xp: level * 125 + (level > 0 ? Math.floor(Math.random() * 80) : 0),
            hours: level > 0 ? (level * 1.2 + Math.random() * 0.8).toFixed(1) : 0,
            date: dateStr
          });
        }
      }
    }
    
    function drawRoundRect(x, y, w, h, r, fillColor, glowColor) {
      ctx.save();
      
      if (glowColor !== 'transparent') {
        ctx.shadowBlur = 8;
        ctx.shadowColor = glowColor;
      }
      
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    
    function draw() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Draw grid labels
      ctx.fillStyle = '#525262';
      ctx.font = '10px "Share Tech Mono"';
      ctx.textBaseline = 'middle';
      
      const dayLabels = ['Mon', 'Wed', 'Fri'];
      const leftLabelSpace = 25;
      const headerSpace = 20;
      
      if (blocks.length > 0) {
        // Draw day labels
        const boxH = blocks[0].h;
        ctx.fillText('Mon', 2, blocks[0].y + boxH + spacing);
        ctx.fillText('Wed', 2, blocks[0].y + 3 * (boxH + spacing));
        ctx.fillText('Fri', 2, blocks[0].y + 5 * (boxH + spacing));
        
        // Month headers
        ctx.fillText('JAN', blocks[0].x, 8);
        ctx.fillText('FEB', blocks[Math.floor(cols / 4) * rows].x, 8);
        ctx.fillText('MAR', blocks[Math.floor(cols / 2) * rows].x, 8);
        ctx.fillText('APR', blocks[Math.floor(cols * 0.75) * rows].x, 8);
      }
      
      // Draw blocks
      blocks.forEach(b => {
        const isHovered = hoveredBlock && hoveredBlock.x === b.x && hoveredBlock.y === b.y;
        let fillColor = colors[b.level];
        let glowColor = glowColors[b.level];
        
        if (isHovered) {
          fillColor = '#fff';
          glowColor = b.level > 0 ? glowColors[b.level] : 'rgba(255, 255, 255, 0.4)';
        }
        
        drawRoundRect(b.x, b.y, b.w, b.h, rounded, fillColor, glowColor);
      });
      
      // Draw Tooltip
      if (hoveredBlock) {
        drawTooltip(hoveredBlock);
      }
    }
    
    function drawTooltip(b) {
      const rect = canvas.getBoundingClientRect();
      const txt1 = `${b.hours}h Focus // +${b.xp} XP`;
      const txt2 = b.date;
      
      ctx.font = '10px "Inter"';
      const m1 = ctx.measureText(txt1).width;
      const m2 = ctx.measureText(txt2).width;
      const w = Math.max(m1, m2) + 16;
      const h = 40;
      
      let tx = b.x + b.w / 2 - w / 2;
      let ty = b.y - h - 8;
      
      // Clamp bounds
      if (tx < 10) tx = 10;
      if (tx + w > rect.width - 10) tx = rect.width - w - 10;
      if (ty < 5) ty = b.y + b.h + 8;
      
      // Draw glass panel
      ctx.save();
      ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.rect(tx, ty, w, h);
      ctx.fill();
      ctx.stroke();
      
      // Render strings
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px "Inter"';
      ctx.textBaseline = 'top';
      ctx.fillText(txt1, tx + 8, ty + 8);
      
      ctx.fillStyle = '#8e8e9f';
      ctx.font = '8px "Share Tech Mono"';
      ctx.fillText(txt2, tx + 8, ty + 22);
      ctx.restore();
    }
    
    canvas.addEventListener('mousemove', (e) => {
      const crect = canvas.getBoundingClientRect();
      const mx = e.clientX - crect.left;
      const my = e.clientY - crect.top;
      
      let found = null;
      for (let b of blocks) {
        if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
          found = b;
          break;
        }
      }
      
      if (hoveredBlock !== found) {
        hoveredBlock = found;
        draw();
        canvas.style.cursor = found ? 'pointer' : 'default';
      }
    });
    
    canvas.addEventListener('mouseleave', () => {
      hoveredBlock = null;
      draw();
    });
    
    window.addEventListener('resize', resize);
    resize();
  }
  
  static initSparkline(canvasId, values, color, glowColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      
      draw(rect.width, rect.height);
    }
    
    function draw(width, height) {
      ctx.clearRect(0, 0, width, height);
      
      const padding = 2;
      const strokeW = 1.8;
      const count = values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;
      
      const stepX = (width - padding * 2) / (count - 1);
      
      let points = [];
      for (let i = 0; i < count; i++) {
        const val = values[i];
        const px = padding + i * stepX;
        const py = height - padding - ((val - min) / (range || 1)) * (height - padding * 2 - 4);
        points.push({ x: px, y: py });
      }
      
      // Draw Gradient Underneath
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, height);
      points.forEach(p => {
        ctx.lineTo(p.x, p.y);
      });
      ctx.lineTo(points[points.length - 1].x, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      
      // Draw Glow Shadow Line
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
    
    window.addEventListener('resize', resize);
    resize();
  }
}

// Attach to global window
window.NexoraCharts = NexoraCharts;
