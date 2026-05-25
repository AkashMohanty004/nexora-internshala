/* ==========================================================================
   NEXORA PROCEDURAL WEB AUDIO SYNTHESIZER ENGINE
   ========================================================================== */

class NexoraAudio {
  constructor() {
    this.ctx = null;
    
    // Nodes
    this.masterGain = null;
    this.activeNodes = [];
    this.lfoInterval = null;
    this.currentPreset = 'none'; // 'alpha', 'cosmic', 'none'
  }
  
  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  
  playPreset(presetName) {
    this.stopAll();
    this.initContext();
    
    this.currentPreset = presetName;
    if (presetName === 'alpha') {
      this.playAlphaWaves();
    } else if (presetName === 'cosmic') {
      this.playCosmicRain();
    }
  }
  
  stopAll() {
    this.currentPreset = 'none';
    
    // Stop intervals
    if (this.lfoInterval) {
      clearInterval(this.lfoInterval);
      this.lfoInterval = null;
    }
    
    // Fade out and stop nodes
    const fadeOutTime = 0.6;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeOutTime);
    }
    
    const nodesToStop = [...this.activeNodes];
    this.activeNodes = [];
    
    setTimeout(() => {
      nodesToStop.forEach(item => {
        try {
          if (item.stop) item.stop();
          item.disconnect();
        } catch (e) {
          // Quiet catch for already stopped buffers
        }
      });
      // Restore master volume level
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      }
    }, fadeOutTime * 1000 + 50);
  }
  
  playAlphaWaves() {
    // Generate stereo binaural beat: Left = 120Hz, Right = 130Hz -> 10Hz Alpha pulse
    
    // Create channel merger to isolate Left/Right oscillators
    const merger = this.ctx.createChannelMerger(2);
    
    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.value = 120; // Carrier
    
    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.value = 130; // 10Hz offset
    
    const gainL = this.ctx.createGain();
    gainL.gain.value = 0.55;
    
    const gainR = this.ctx.createGain();
    gainR.gain.value = 0.55;
    
    oscL.connect(gainL);
    oscR.connect(gainR);
    
    gainL.connect(merger, 0, 0); // Left
    gainR.connect(merger, 0, 1); // Right
    
    // Cozy ambient base drone (low frequency pad)
    const baseOsc = this.ctx.createOscillator();
    baseOsc.type = 'triangle';
    baseOsc.frequency.value = 60; // Deep rumble
    
    const baseFilter = this.ctx.createBiquadFilter();
    baseFilter.type = 'lowpass';
    baseFilter.Q.value = 1;
    baseFilter.frequency.value = 90;
    
    const baseGain = this.ctx.createGain();
    baseGain.gain.value = 0.45;
    
    baseOsc.connect(baseFilter);
    baseFilter.connect(baseGain);
    
    // Pan drone slightly center
    const panNode = this.ctx.createStereoPanner();
    panNode.pan.value = -0.15;
    baseGain.connect(panNode);
    
    // Hook up outputs to Master Node
    merger.connect(this.masterGain);
    panNode.connect(this.masterGain);
    
    // Start oscillators
    oscL.start(0);
    oscR.start(0);
    baseOsc.start(0);
    
    // Save for cleanup
    this.activeNodes.push(oscL, oscR, baseOsc, merger, baseFilter, baseGain, panNode, gainL, gainR);
  }
  
  playCosmicRain() {
    // Generate dynamic sweeping space rain from white noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    // Filtering parameters
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;
    filter.frequency.value = 350; // Initial filter point
    
    // Add LFO to simulate wind cycles
    const windLfo = this.ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.08; // Very slow sweeps (12.5 seconds per cycle)
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 250; // Shift sweep scope
    
    windLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency); // Modulate bandpass frequency
    
    const volumeNode = this.ctx.createGain();
    volumeNode.gain.value = 0.65;
    
    // Synthesize warm soft ocean rumble to support rain sweeps
    const lowOsc = this.ctx.createOscillator();
    lowOsc.type = 'sawtooth';
    lowOsc.frequency.value = 45;
    
    const lowFilter = this.ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.value = 55;
    
    const lowGain = this.ctx.createGain();
    lowGain.gain.value = 0.35;
    
    lowOsc.connect(lowFilter);
    lowFilter.connect(lowGain);
    
    // Connections
    whiteNoise.connect(filter);
    filter.connect(volumeNode);
    volumeNode.connect(this.masterGain);
    lowGain.connect(this.masterGain);
    
    whiteNoise.start(0);
    windLfo.start(0);
    lowOsc.start(0);
    
    this.activeNodes.push(whiteNoise, windLfo, filter, lfoGain, volumeNode, lowOsc, lowFilter, lowGain);
  }
}

// Attach to global window
window.NexoraAudio = NexoraAudio;
