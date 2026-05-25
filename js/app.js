/* ==========================================================================
   NEXORA SYSTEM APPLICATION CONTROLLER (MODULAR SAFE APP.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Background Particles if canvas is present
  const canvasElement = document.getElementById('bg-canvas');
  if (canvasElement && window.NexoraParticles) {
    new window.NexoraParticles('bg-canvas');
  }
  
  // 2. Initialize Synthesizer & AI Core if elements exist
  const audioController = window.NexoraAudio ? new window.NexoraAudio() : null;
  
  const aiChatBody = document.getElementById('ai-chat-body');
  const aiChatInput = document.getElementById('ai-chat-input');
  const aiChatSubmit = document.getElementById('ai-chat-submit');
  
  const aiCore = (aiChatBody && aiChatInput && window.NexoraAiCore) 
    ? new window.NexoraAiCore('ai-chat-body', 'ai-chat-input', 'ai-chat-submit') 
    : null;
  
  // 3. Sidebar Collapsible Control
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      
      // Redraw charts/canvas elements since size changed
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 360);
    });
  }
  
  // 4. Initialize Sparklines if present
  const hoursSparkline = document.getElementById('hours-sparkline');
  const completionSparkline = document.getElementById('completion-sparkline');
  
  if (hoursSparkline && window.NexoraCharts) {
    window.NexoraCharts.initSparkline('hours-sparkline', [1.2, 3.4, 2.1, 4.5, 3.2, 5.1, 4.2], '#00f5ff', 'rgba(0, 245, 255, 0.1)');
  }
  if (completionSparkline && window.NexoraCharts) {
    window.NexoraCharts.initSparkline('completion-sparkline', [68, 71, 75, 78, 80, 84, 87.5], '#bd5cff', 'rgba(189, 92, 255, 0.1)');
  }

  // 5. Initialize Heatmap Grid if present
  const activityCanvas = document.getElementById('activity-canvas');
  if (activityCanvas && window.NexoraCharts) {
    window.NexoraCharts.initHeatmap('activity-canvas');
  }
  
  // 6. Navigation Link Event Handlers (Active page transitions)
  const menuItems = document.querySelectorAll('.sidebar-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const link = item.querySelector('a');
      if (link) {
        // Quick fade-out effect for premium feel before changing page
        document.body.style.transition = 'opacity 0.35s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = link.getAttribute('href');
        }, 300);
      }
    });
  });
  
  // 7. Course Card Click Handling
  const courseItems = document.querySelectorAll('.course-item');
  const heroTitle = document.querySelector('.hero-title-text');
  const heroTag = document.querySelector('.hero-tag');
  
  courseItems.forEach(card => {
    card.addEventListener('click', () => {
      const courseName = card.querySelector('.course-name').textContent;
      const progress = card.querySelector('.course-progress-meta span:last-child').textContent;
      
      if (heroTitle) {
        heroTitle.textContent = `Focusing: ${courseName}`;
      }
      if (heroTag) {
        heroTag.textContent = `Telemetry active // Progress: ${progress}`;
      }
      if (aiCore) {
        aiCore.addSystemMessage(`TARGET COURSE DOCKED // Loaded parameters for: ${courseName}. Overall Sync rate locked.`);
      }
    });
  });
  
  // 8. Neural Focus Timer Actions
  const focusBtn = document.querySelector('.focus-btn');
  const focusTimerText = document.querySelector('.focus-timer');
  const focusCard = document.querySelector('.card-focus-session');
  const soundBtns = document.querySelectorAll('.focus-sound-btn');
  
  let timerInterval = null;
  let isTimerRunning = false;
  let secondsRemaining = 25 * 60; // 25 minutes
  let selectedPreset = 'none';
  
  function updateTimerDisplay() {
    if (focusTimerText) {
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      focusTimerText.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }
  
  if (focusBtn && focusTimerText && focusCard && audioController) {
    focusBtn.addEventListener('click', () => {
      isTimerRunning = !isTimerRunning;
      
      if (isTimerRunning) {
        focusBtn.textContent = 'Pause Session';
        focusBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        focusBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.2)';
        focusCard.classList.add('focus-active');
        
        // Start playing focus sound if selected
        if (selectedPreset !== 'none') {
          audioController.playPreset(selectedPreset);
        }
        
        timerInterval = setInterval(() => {
          secondsRemaining--;
          updateTimerDisplay();
          
          if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            secondsRemaining = 25 * 60;
            updateTimerDisplay();
            
            focusBtn.textContent = 'Start Session';
            focusBtn.style.background = 'linear-gradient(135deg, var(--accent-purple) 0%, rgba(124, 58, 237, 0.8) 100%)';
            focusCard.classList.remove('focus-active');
            audioController.stopAll();
            
            // Update stats & XP
            const xpText = document.querySelector('.xp-number');
            if (xpText) {
              const currentXp = parseInt(xpText.textContent.replace(/,/g, ''));
              xpText.textContent = (currentXp + 500).toLocaleString();
            }
            
            if (aiCore) {
              aiCore.addSystemMessage("COGNITIVE SYNC COMPLETE // Focus session finished. +500 XP registered to Profile Akash.");
            }
          }
        }, 1000);
      } else {
        // Pause timer
        clearInterval(timerInterval);
        focusBtn.textContent = 'Start Session';
        focusBtn.style.background = 'linear-gradient(135deg, var(--accent-purple) 0%, rgba(124, 58, 237, 0.8) 100%)';
        focusBtn.style.boxShadow = '0 4px 15px rgba(189, 92, 255, 0.2)';
        focusCard.classList.remove('focus-active');
        audioController.stopAll();
      }
    });
  }
  
  // Sound selector button clicks
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundBtns.forEach(b => b.classList.remove('active'));
      const soundType = btn.getAttribute('data-sound');
      
      if (selectedPreset === soundType) {
        selectedPreset = 'none';
        btn.classList.remove('active');
        if (audioController) audioController.stopAll();
      } else {
        selectedPreset = soundType;
        btn.classList.add('active');
        if (isTimerRunning && audioController) {
          audioController.playPreset(soundType);
        }
      }
    });
  });
});
