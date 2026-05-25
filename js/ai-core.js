/* ==========================================================================
   NEXORA AI CORE TERMINAL ENGINE (COMMANDS & SCANS)
   ========================================================================== */

class NexoraAiCore {
  constructor(chatBodyId, inputId, submitBtnId) {
    this.chatBody = document.getElementById(chatBodyId);
    this.input = document.getElementById(inputId);
    this.submitBtn = document.getElementById(submitBtnId);
    
    if (!this.chatBody || !this.input) return;
    
    this.init();
  }
  
  init() {
    this.submitBtn.addEventListener('click', () => this.handleInput());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleInput();
    });
    
    // Initial core greeting
    setTimeout(() => {
      this.addSystemMessage("NEXORA CORE initialized. Type `/` to access automated diagnostic commands or query the learning engine.");
    }, 1200);
  }
  
  handleInput() {
    const rawVal = this.input.value.trim();
    if (!rawVal) return;
    
    this.input.value = '';
    
    // Add user message
    this.addUserMessage(rawVal);
    
    // Process response after delay
    setTimeout(() => {
      this.processCommand(rawVal);
    }, 400);
  }
  
  addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'ai-message user';
    msg.textContent = text;
    this.chatBody.appendChild(msg);
    this.scrollChat();
  }
  
  addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'ai-message system';
    this.chatBody.appendChild(msg);
    this.scrollChat();
    
    this.decryptText(msg, text);
  }
  
  scrollChat() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }
  
  decryptText(element, finalText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=[]{}<>//';
    let iterations = 0;
    const finalLength = finalText.length;
    let textState = Array(finalLength).fill(' ');
    
    // Quick hardware-accelerated text scramble effect
    const interval = setInterval(() => {
      element.innerHTML = textState
        .map((char, index) => {
          if (index < iterations) {
            return finalText[index];
          }
          return `<span style="color: var(--accent-cyan); font-family: var(--font-mono);">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
        })
        .join('');
      
      iterations += Math.ceil(finalLength / 25);
      if (iterations >= finalLength) {
        clearInterval(interval);
        element.textContent = finalText;
        this.scrollChat();
      }
    }, 20);
  }
  
  processCommand(cmd) {
    const command = cmd.toLowerCase().trim();
    
    if (command.startsWith('/path')) {
      const response = "CURRICULUM ANALYSIS // Recommended Path: Complete 'Neuro-Symbolic AI' to unlock advanced 'Cognitive Compiler Systems'. Recommended next step: Module 4: Neural Grounding.";
      this.addSystemMessage(response);
    } else if (command.startsWith('/optimize')) {
      const response = "BIOSYNC SCAN COMPLETE // Synaptic state: 94%. Focus alignment: High. Peak hours detected. Suggest starting Focus Session under Alpha Wave presets immediately.";
      this.addSystemMessage(response);
    } else if (command.startsWith('/stats')) {
      const response = "DATA INDEXED // Focus Hours: 142.8 // Current Milestones: 72% overall completion // Velocity: 1.25x (Accelerating). Weekly XP yield is up by 18%.";
      this.addSystemMessage(response);
    } else if (command.startsWith('/sync')) {
      // Find focus timer and start it
      const startBtn = document.querySelector('.focus-btn');
      if (startBtn) {
        startBtn.click();
        this.addSystemMessage("TIMING ALIGNMENT INITIALIZED // Focus sync lock established.");
      } else {
        this.addSystemMessage("COGNITIVE SYNC ERROR // Focus timer module is offline.");
      }
    } else {
      // General response
      const fallbackReplies = [
        "Analyzing synapse queries... Nexora suggests continuing your Quantum Computing module to maximize daily XP gains.",
        "System query logged. Current biometric feeds show optimal neuro-coupling levels. Type `/optimize` to optimize focus cycles.",
        "Query parsed. Keep practicing. Remember, completing autonomous agents curriculum unlocks the 'Holographic Map' view.",
        "Awaiting instruction... Enter `/stats` to view deep telemetry analysis or `/path` to check recommended academic maps."
      ];
      const randomIdx = Math.floor(Math.random() * fallbackReplies.length);
      this.addSystemMessage(fallbackReplies[randomIdx]);
    }
  }
}

// Attach to global window
window.NexoraAiCore = NexoraAiCore;
