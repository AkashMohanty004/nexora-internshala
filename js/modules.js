/* ==========================================================================
   NEXORA MODULES PAGE INTERACTIVE SCRIPT (IDE SIMULATOR & QUIZ)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Background Particles
  if (window.NexoraParticles) {
    new window.NexoraParticles('bg-canvas');
  }

  // 2. Syllabus Accordion Toggle Logic
  const headers = document.querySelectorAll('.syllabus-group-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const group = header.parentElement;
      const isOpen = group.classList.contains('open');
      
      // Close other folders
      document.querySelectorAll('.syllabus-group').forEach(sg => sg.classList.remove('open'));
      
      if (!isOpen) {
        group.classList.add('open');
      }
    });
  });

  // 3. Lesson Database & Interaction
  const lessonData = {
    'q-superposition': {
      title: 'Quantum Superposition & Qubits',
      code: `// OpenQASM 2.0 - Superposition State
include "qelib1.inc";
qreg q[2];
creg c[2];

h q[0];             // Place qubit 0 in superposition
cx q[0], q[1];      // Entangle qubit 0 and 1
measure q -> c;     // Measure state registers`,
      compilerOutput: `COMPILER v1.0.4 ONLINE // TARGET: QPU_CHIP_RIGEL
19:10:42 [INFO] Parsing registers...
19:10:42 [INFO] Allocating qubits: q[0], q[1]
19:10:42 [SUCCESS] Assembly parsed. Ready for execution.
19:10:43 [QPU LINK] Simulating 1024 shots...
--------------------------------------------------
|00> : ###################### [50.8%]
|01> : [0.0%]
|10> : [0.0%]
|11> : ##################### [49.2%]
--------------------------------------------------
EXECUTION VELOCITY: 14.8 ms // COGNITIVE ALIGNMENT STABLE`,
      quiz: {
        question: 'Which gate is used to place a standard qubit into a state of quantum superposition?',
        options: ['X Gate (Pauli-X)', 'H Gate (Hadamard)', 'Z Gate (Pauli-Z)', 'CX Gate (CNOT)'],
        correctIndex: 1,
        feedback: 'Correct! The Hadamard (H) gate maps the basis state |0> to (|0> + |1>)/√2, placing it in an equal superposition of states.'
      }
    },
    'q-gates': {
      title: 'Phase Gates & Blochs Sphere',
      code: `// Bloch Sphere Rotations
include "qelib1.inc";
qreg q[1];
creg c[1];

h q[0];
rz(pi/4) q[0];      // Phase rotation around Z-axis
h q[0];
measure q -> c;`,
      compilerOutput: `COMPILER v1.0.4 ONLINE // TARGET: QPU_CHIP_RIGEL
19:10:45 [INFO] Translating phase angles...
19:10:45 [SUCCESS] Transpilation completed.
19:10:46 [QPU LINK] Executing phase rotations...
--------------------------------------------------
|0> : ######################## [85.3%]
|1> : #### [14.7%]
--------------------------------------------------
EXECUTION VELOCITY: 12.1 ms // PHASE LOCK CONFIRMED`,
      quiz: {
        question: 'Which coordinates of the Bloch Sphere represent the standard bases states of a qubit?',
        options: ['Equatorial axis points', 'North and South poles', 'Center point coordinates', 'Longitude intersection nodes'],
        correctIndex: 1,
        feedback: 'Correct! The North pole represents the |0> state, and the South pole represents the |1> state.'
      }
    },
    'ns-logic': {
      title: 'Logic Constraint Embeddings',
      code: `# Neuro-Symbolic AI Logic Model
import torch
import neuro_symbolic as ns

knowledge_base = ns.KB(
    rules=[
        "IsA(x, Mammal) -> IsA(x, Animal)",
        "IsA(x, Dog) -> IsA(x, Mammal)"
    ]
)
model = ns.ConstrainedNN(kb=knowledge_base)`,
      compilerOutput: `TENSORFLUX NEURO-COMPILER v2.8.1
19:10:50 [INFO] Loading logical rules...
19:10:50 [INFO] Embedding 2 horn-clause constraints.
19:10:51 [SUCCESS] Linked logic constraints to tensor parameters.
19:10:51 [TRAINING] Loss: 0.082 (Logic violation penalty: 0.001)
--------------------------------------------------
MODEL SUMMARY:
Neural Nodes: 1,480,000
Logical Axioms: 2 (100% satisfied)
Loss Optimization Index: 0.985
--------------------------------------------------
SYNAPTIC SYNC LOCKED`,
      quiz: {
        question: 'What is the primary objective of Neuro-Symbolic AI models?',
        options: ['Combining vector neural networks with symbolic logic', 'Eliminating gradient backpropagation loops', 'Compiling Python files to binary assemblies', 'Generating raw audio frequencies'],
        correctIndex: 0,
        feedback: 'Correct! Neuro-symbolic AI combines neural network learning with symbolic, explainable reasoning logic.'
      }
    }
  };

  const codeTextarea = document.getElementById('ide-textarea');
  const compilerBody = document.getElementById('compiler-body');
  const runBtn = document.getElementById('run-code-btn');
  const lessonItems = document.querySelectorAll('.syllabus-lesson-item');
  const sandboxTitleText = document.getElementById('sandbox-title-text');
  
  // Quiz Elements
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');

  let activeLessonKey = 'q-superposition';

  function loadLesson(key) {
    const data = lessonData[key];
    if (!data) return;
    
    activeLessonKey = key;
    sandboxTitleText.textContent = data.title;
    codeTextarea.value = data.code;
    compilerBody.textContent = 'Awaiting compilation input... Click "Compile Code" to execute.';
    
    // Load Quiz
    quizQuestion.textContent = data.quiz.question;
    quizOptions.innerHTML = '';
    quizFeedback.className = 'quiz-feedback';
    quizFeedback.textContent = '';
    
    data.quiz.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleQuizSelect(btn, idx, data.quiz.correctIndex, data.quiz.feedback));
      quizOptions.appendChild(btn);
    });
  }

  function handleQuizSelect(btn, selectedIndex, correctIndex, feedbackText) {
    // Clear previous state
    const btns = quizOptions.querySelectorAll('.quiz-choice-btn');
    btns.forEach(b => {
      b.className = 'quiz-choice-btn';
      b.disabled = true;
    });

    if (selectedIndex === correctIndex) {
      btn.classList.add('correct');
      quizFeedback.className = 'quiz-feedback success';
      quizFeedback.textContent = feedbackText;
      
      // Update local storage XP
      let currentXp = parseInt(localStorage.getItem('cognitive_xp') || '8450');
      localStorage.setItem('cognitive_xp', currentXp + 200);
      
      // Attempt to dispatch event if sidebar is loaded
      window.dispatchEvent(new Event('xpChange'));
    } else {
      btn.classList.add('incorrect');
      btns[correctIndex].classList.add('correct');
      quizFeedback.className = 'quiz-feedback error';
      quizFeedback.textContent = 'Incorrect synapse. Try reviewing the lesson details.';
    }
  }

  // Handle lesson click
  lessonItems.forEach(item => {
    item.addEventListener('click', () => {
      lessonItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');
      const lessonKey = item.getAttribute('data-lesson');
      loadLesson(lessonKey);
    });
  });

  // Handle compile button click
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      compilerBody.textContent = 'INITIALIZING SANDBOX PROCESS...\n';
      let lines = [
        '19:10:55 [GATEWAY] Securing container registers...',
        '19:10:55 [COMPILER] Analyzing syntax code tree...',
        '19:10:56 [EXECUTOR] Invoking cognitive sync matrix...',
        lessonData[activeLessonKey].compilerOutput
      ];
      
      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex < lines.length) {
          compilerBody.textContent += lines[lineIndex] + '\n';
          compilerBody.scrollTop = compilerBody.scrollHeight;
          lineIndex++;
        } else {
          clearInterval(interval);
        }
      }, 300);
    });
  }

  // Load default lesson on start
  loadLesson('q-superposition');
});
