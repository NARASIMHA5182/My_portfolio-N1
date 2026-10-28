/**
 * ============================================================================
 * NEON CYBERPUNK AI LAB - CORE SCRIPT
 * Author: Koduri Venkata Narasimha Reddy
 * Plain Vanilla JavaScript - AWS Amplify Hosting Ready
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 01. CONSTANTS & STATE
  // --------------------------------------------------------------------------
  const THEMES = [
    { id: 'green', name: 'Matrix Green' },
    { id: 'cyan', name: 'Cyber Cyan' },
    { id: 'pink', name: 'Vapor Pink' }
  ];

  const TAGLINE_STRINGS = [
    '3rd-year CSE student',
    'Python enthusiast',
    'Future AI engineer',
    'Problem solver'
  ];

  const FUN_FACTS = [
    'I can track down edge cases and tricky bugs 2x faster with a fresh cup of hot chai in hand.',
    'Python list comprehensions and generator expressions are my absolute favorite syntactic superpowers.',
    'I once spent 3 hours optimizing a nested search loop before realizing a simple hash table lookup did it in O(1)!',
    'My local code editor terminal has more vibrant neon accents than a 1980s retro synthwave arcade cabinet.',
    'I built my very first Python script to auto-categorize and rename 200 messy university lecture PDFs in less than 2 seconds.'
  ];

  const PROGRAMMING_JOKES = [
    'Why do Python programmers prefer snake_case?\nBecause they refuse to wear camel-back backpacks in the desert!',
    'There are 10 types of people in the world: those who understand binary, and those who do not.',
    'Why did the neural network cross the road?\nTo optimize the loss function on the other side!',
    'A SQL query walks into a bar, approaches two tables, and asks: "Can I join you?"',
    'Why do programmers prefer dark mode?\nBecause light attracts bugs!'
  ];

  let currentThemeIndex = 0;
  let lastActiveElement = null;
  let isTerminalBooted = false;
  let commandHistory = [];
  let historyIndex = -1;
  let matrixRainInterval = null;

  // --------------------------------------------------------------------------
  // 02. THEME SWITCHER WITH LOCALSTORAGE PERSISTENCE
  // --------------------------------------------------------------------------
  function initTheme() {
    const themeBtn = document.getElementById('theme-switcher-btn');
    const themeLabel = document.getElementById('theme-btn-label');
    const savedTheme = localStorage.getItem('kvnr-ai-theme');

    if (savedTheme) {
      const idx = THEMES.findIndex(t => t.id === savedTheme);
      if (idx !== -1) {
        currentThemeIndex = idx;
      }
    }

    applyTheme(currentThemeIndex, false);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
        applyTheme(currentThemeIndex, true);
      });
    }
  }

  function applyTheme(index, notify = false) {
    const theme = THEMES[index];
    document.body.dataset.theme = theme.id;
    localStorage.setItem('kvnr-ai-theme', theme.id);

    const themeLabel = document.getElementById('theme-btn-label');
    const themeBtn = document.getElementById('theme-switcher-btn');
    if (themeLabel) themeLabel.textContent = theme.name;
    if (themeBtn) themeBtn.title = `Switch Theme (Current: ${theme.name})`;

    // Update meta theme-color tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      if (theme.id === 'cyan') metaTheme.content = '#050816';
      if (theme.id === 'pink') metaTheme.content = '#0a0416';
      if (theme.id === 'green') metaTheme.content = '#031008';
    }

    if (notify && isTerminalOpen()) {
      appendTerminalLine(`<span class="term-accent">[SYSTEM]</span> Palette re-calibrated to: <strong class="term-highlight">${theme.name}</strong>`);
    }
  }

  // --------------------------------------------------------------------------
  // 03. SCROLL PROGRESS BAR & STICKY NAVBAR
  // --------------------------------------------------------------------------
  function initScrollTracking() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
      }

      if (navbar) {
        if (scrollTop > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Active Section Highlighting
      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 04. MOBILE HAMBURGER MENU
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const hamburger = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 05. CUSTOM GLOWING CURSOR (DESKTOP ONLY)
  // --------------------------------------------------------------------------
  function initCustomCursor() {
    // Only enable if pointer is fine (not a touch screen)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    }
    renderRing();

    // Hover state over interactive elements
    const hoverTargets = 'a, button, input, textarea, .power-card, .project-card, .ai-orb-button';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --------------------------------------------------------------------------
  // 06. TAGLINE TYPING & DELETING ANIMATION
  // --------------------------------------------------------------------------
  function initTypingAnimation() {
    const textTarget = document.getElementById('typed-tagline');
    if (!textTarget) return;

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 75;
    const deleteSpeed = 40;
    const pauseEnd = 1800;
    const pauseStart = 400;

    function typeLoop() {
      const currentString = TAGLINE_STRINGS[stringIndex];

      if (isDeleting) {
        textTarget.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textTarget.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentString.length) {
        timeout = pauseEnd;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % TAGLINE_STRINGS.length;
        timeout = pauseStart;
      }

      setTimeout(typeLoop, timeout);
    }

    typeLoop();
  }

  // --------------------------------------------------------------------------
  // 07. NEURAL NETWORK CANVAS ANIMATION (HERO)
  // --------------------------------------------------------------------------
  function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationFrameId = null;
    let isTabVisible = true;

    // Scale nodes down on smaller mobile devices for 60fps performance
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 32 : 70;
    const maxDistance = isMobile ? 110 : 160;

    let mouse = {
      x: null,
      y: null,
      radius: 140
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Page Visibility API - Pause rendering when tab is hidden
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animationFrameId) {
        drawNodes();
      }
    });

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = (Math.random() - 0.5) * 0.85;
        this.radius = Math.random() * 2 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2.5;
            this.y -= (dy / dist) * force * 2.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff66';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff66';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }

    function drawNodes() {
      if (!isTabVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Connect nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 46, 151, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      animationFrameId = requestAnimationFrame(drawNodes);
    }

    // Check prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawNodes();
    }
  }

  // --------------------------------------------------------------------------
  // 08. SCROLL REVEAL & ANIMATED STAT COUNTERS & SKILLS FILL
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const statCards = document.querySelectorAll('.stat-card');
    const powerCards = document.querySelectorAll('.power-card');

    let countersStarted = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));

    // Stats counter animation observer
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          startStatCounters();
        }
      });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.hero-stats-grid');
    if (statsGrid) statsObserver.observe(statsGrid);

    // Power Cards progress bar trigger
    const skillCardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.2 });

    powerCards.forEach(card => skillCardObserver.observe(card));
  }

  function startStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // --------------------------------------------------------------------------
  // 09. 3D TILT EFFECT ON PROJECT CARDS
  // --------------------------------------------------------------------------
  function initTiltCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. COPY EMAIL & FORM DISPATCH FEEDBACK
  // --------------------------------------------------------------------------
  function initContactUtilities() {
    const copyBtn = document.getElementById('copy-email-btn');
    const copyText = document.getElementById('copy-btn-text');
    const contactForm = document.getElementById('quick-contact-form');
    const feedbackMsg = document.getElementById('form-feedback');

    if (copyBtn && copyText) {
      copyBtn.addEventListener('click', async () => {
        const email = copyBtn.getAttribute('data-email') || 'kodurivenkatanarasimhareddy@gmail.com';
        try {
          await navigator.clipboard.writeText(email);
          copyText.textContent = '✓ Copied to Clipboard!';
          copyBtn.style.borderColor = '#00ff66';
          copyBtn.style.color = '#00ff66';
          setTimeout(() => {
            copyText.textContent = 'Copy Email Address';
            copyBtn.style.borderColor = '';
            copyBtn.style.color = '';
          }, 2500);
        } catch (err) {
          copyText.textContent = email;
        }
      });
    }

    if (contactForm && feedbackMsg) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sender-name').value.trim();
        const email = document.getElementById('sender-email').value.trim();
        const msg = document.getElementById('sender-message').value.trim();

        if (!name || !email || !msg) return;

        feedbackMsg.className = 'form-feedback-msg feedback-success';
        feedbackMsg.innerHTML = `✓ Transmission received, <strong>${name}</strong>! Opening your email client to complete dispatch...`;

        setTimeout(() => {
          const mailto = `mailto:kodurivenkatanarasimhareddy@gmail.com?subject=Transmission%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nFrom: ' + email)}`;
          window.location.href = mailto;
        }, 1200);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 11. CREATIVE FEATURE: "WAKE THE AI" TERMINAL SYSTEM
  // --------------------------------------------------------------------------
  function isTerminalOpen() {
    const modal = document.getElementById('terminal-modal');
    return modal && modal.classList.contains('open');
  }

  function openTerminal() {
    const modal = document.getElementById('terminal-modal');
    const input = document.getElementById('terminal-input');
    lastActiveElement = document.activeElement;

    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    if (!isTerminalBooted) {
      runBootSequence();
      isTerminalBooted = true;
    } else {
      if (input) input.focus();
    }
  }

  function closeTerminal() {
    const modal = document.getElementById('terminal-modal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    stopMatrixRain();

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function appendTerminalLine(htmlContent) {
    const output = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');
    if (!output || !body) return;

    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = htmlContent;
    output.appendChild(line);

    body.scrollTop = body.scrollHeight;
  }

  function runBootSequence() {
    const input = document.getElementById('terminal-input');
    const inputRow = document.getElementById('terminal-input-container');
    if (inputRow) inputRow.style.display = 'none';

    const bootSteps = [
      { text: '<span class="term-accent">[INIT]</span> Initializing KVNR Neural Operating Kernel v2.5...', delay: 200 },
      { text: '<span class="term-accent">[BOOT]</span> Mounting core matrices: <span class="term-pink">[Python 3.12, DSA Engine, AI/ML Pipeline]</span>...', delay: 450 },
      { text: '<span class="term-accent">[NET]</span> Connecting to Koduri Venkata Narasimha Reddy knowledge base...', delay: 750 },
      { text: '<span class="term-success">[SUCCESS]</span> Status: Stage 2 ATF 2025 Qualifier Verified ✦', delay: 1050 },
      { text: '<span class="term-accent">[SYSTEM]</span> AI Terminal Online. Direct neural link established.', delay: 1350 },
      { text: '<div class="term-box">Welcome, Operator! Type <code class="term-pink">help</code> for a list of directives or try <code class="term-accent">fun-fact</code>, <code class="term-accent">joke</code>, or <code class="term-accent">theme</code>.</div>', delay: 1650 }
    ];

    bootSteps.forEach(step => {
      setTimeout(() => {
        appendTerminalLine(step.text);
      }, step.delay);
    });

    setTimeout(() => {
      if (inputRow) inputRow.style.display = 'flex';
      if (input) input.focus();
    }, 1750);
  }

  function handleTerminalCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Echo user command
    appendTerminalLine(`<span class="term-user-prefix">visitor@kvnr-ai:~$</span> <span class="term-command">${escapeHtml(trimmed)}</span>`);

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
        appendTerminalLine(`
          <div class="term-box">
            <div class="term-highlight">AVAILABLE SYSTEM DIRECTIVES:</div>
            <table class="term-table">
              <thead>
                <tr>
                  <th>COMMAND</th>
                  <th>FUNCTION</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>help</code></td><td>Display this command manual</td></tr>
                <tr><td><code>about</code></td><td>Print operator profile & background</td></tr>
                <tr><td><code>skills</code></td><td>List technical proficiencies & superpowers</td></tr>
                <tr><td><code>projects</code></td><td>Inspect systems built & competitive honors</td></tr>
                <tr><td><code>resume</code></td><td>Display full CV / launch interactive resume viewer</td></tr>
                <tr><td><code>contact</code></td><td>Display transmission channels (Email, GitHub, LinkedIn)</td></tr>
                <tr><td><code>fun-fact</code></td><td>Retrieve a harmless light-hearted personal fact</td></tr>
                <tr><td><code>joke</code></td><td>Compile a programming or AI humor subroutine</td></tr>
                <tr><td><code>theme</code></td><td>Cycle the website neon color palette live</td></tr>
                <tr><td><code>matrix</code></td><td>Trigger real-time falling digital code sequence</td></tr>
                <tr><td><code>secret</code></td><td>Decrypt classified core philosophy</td></tr>
                <tr><td><code>clear</code></td><td>Flush terminal buffer</td></tr>
                <tr><td><code>exit</code></td><td>Terminate AI session and return to lab interface</td></tr>
              </tbody>
            </table>
          </div>
        `);
        break;

      case 'about':
        appendTerminalLine(`
          <div class="term-box">
            <div class="term-highlight">OPERATOR DOSSIER // VENKATA NARASIMHA REDDY KODURI</div>
            <p>• Institution: Seshadri Rao Gudlavalleru Engineering College, Andhra Pradesh (Expected 2027).</p>
            <p>• Location: Gudlavalleru, Andhra Pradesh, India.</p>
            <p>• Passion: Python development, Data Structures & Algorithms, and Intelligent AI Architectures.</p>
            <p>• Competitive Standing: <strong>Stage 2 Qualifier in ATF competitive coding exam (2025)</strong>.</p>
            <p>• Objective: Building high-reliability, data-centric systems and advancing towards a career as an AI Engineer.</p>
          </div>
        `);
        break;

      case 'skills':
        appendTerminalLine(`
          <div class="term-box">
            <div class="term-highlight">TECHNICAL MATRIX (VERIFIED PROFICIENCIES):</div>
            <p>• <span class="term-accent">Core & Algorithmic:</span> Python (88%), DSA with Python (82%), C (76%), Java (74%)</p>
            <p>• <span class="term-accent">Data & Storage:</span> DBMS (80%), MySQL & SQL Server (78%), SQLite</p>
            <p>• <span class="term-accent">Web Technologies:</span> HTML5 (86%), CSS3 / Modern Layouts (82%), JavaScript (76%)</p>
            <p>• <span class="term-accent">Engineering Tools:</span> VS Code (86%), Git / GitHub</p>
            <p>• <span class="term-accent">Professional:</span> Technical Communication (84%), Presentation & Demos (80%)</p>
            <p>• <span class="term-pink">Currently Training:</span> AI/ML with Python and Neural Network Frameworks ⚡</p>
          </div>
        `);
        break;

      case 'projects':
        appendTerminalLine(`
          <div class="term-box">
            <div class="term-highlight">DEPLOYED SYSTEMS & HONORS:</div>
            <p><strong>1. Credit Card Approval System</strong></p>
            <p style="color: var(--text-secondary);">Stack: Python, HTML, JS, SQLite | Automated creditworthiness scoring based on heuristic evaluation.</p>
            <br>
            <p><strong>2. College Hostel Management System</strong></p>
            <p style="color: var(--text-secondary);">Stack: Streamlit, Python, SQL Server | Rapid dashboard managing student allocations, room logs & finances.</p>
            <br>
            <p><strong>3. BuildConnect</strong></p>
            <p style="color: var(--text-secondary);">Stack: Python, Web Portal, Admin Engine | Municipal contractor marketplace with manpower and budget estimation engines.</p>
            <br>
            <p><strong>4. Stage 2 Qualifier: ATF Competitive Coding Exam (2025)</strong></p>
            <p style="color: #ffd700;">Solved complex algorithmic problems under rigorous time constraints to advance into Stage 2 nationwide.</p>
          </div>
        `);
        break;

      case 'resume':
      case 'cv':
        appendTerminalLine(`
          <div class="term-box">
            <div class="term-highlight">CURRICULUM VITAE // VENKATA NARASIMHA REDDY KODURI</div>
            <p><strong>Education:</strong> B.Tech, Computer Science & Engineering (Expected 2027)</p>
            <p><strong>Institution:</strong> Seshadri Rao Gudlavalleru Engineering College, Andhra Pradesh</p>
            <p><strong>Technical Skills:</strong> Python, C, Java, HTML/CSS, JS, MySQL, SQL Server, SQLite, Streamlit, Git</p>
            <p><strong>Projects:</strong> Credit Card Approval Prediction System, College Hostel Management System</p>
            <p><strong>Competitive Exam:</strong> Qualified to Stage 2 in ATF 2025 Coding Exam</p>
            <br>
            <p><span class="term-success">[ACTION]</span> Opening Full Interactive Resume Document...</p>
            <p><a href="resume.pdf" download="KVNR_Resume.pdf" class="term-pink" style="text-decoration: underline;">Direct PDF Download: resume.pdf</a></p>
          </div>
        `);
        setTimeout(openResumeModal, 600);
        break;

      case 'contact':
        appendTerminalLine(`
          <div class="term-box">
            <div class="term-highlight">TRANSMISSION FREQUENCIES:</div>
            <p>• Email: <a href="mailto:kodurivenkatanarasimhareddy@gmail.com" class="term-accent" style="text-decoration: underline;">kodurivenkatanarasimhareddy@gmail.com</a></p>
            <p>• GitHub: <a href="https://github.com/NARASIMHA5182" target="_blank" rel="noopener noreferrer" class="term-accent" style="text-decoration: underline;">github.com/NARASIMHA5182</a></p>
            <p>• LinkedIn: <a href="https://www.linkedin.com/in/venkata-narasimha-reddy-koduri-115680338/" target="_blank" rel="noopener noreferrer" class="term-accent" style="text-decoration: underline;">linkedin.com/in/venkata-narasimha-reddy-koduri-115680338</a></p>
            <p>• Resume: <a href="resume.pdf" download="KVNR_Resume.pdf" class="term-pink" style="text-decoration: underline;">Download resume.pdf</a></p>
          </div>
        `);
        break;

      case 'fun-fact':
        const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
        appendTerminalLine(`
          <div class="term-box">
            <span class="term-pink">✦ FACT DECRYPTED:</span> "${randomFact}"
          </div>
        `);
        break;

      case 'joke':
        const randomJoke = PROGRAMMING_JOKES[Math.floor(Math.random() * PROGRAMMING_JOKES.length)];
        appendTerminalLine(`
          <div class="term-box">
            <span class="term-accent">🤖 AI HUMOR SUBROUTINE:</span><br>
            <p style="margin-top: 6px; white-space: pre-line;">${randomJoke}</p>
          </div>
        `);
        break;

      case 'secret':
        appendTerminalLine(`
          <div class="term-box" style="border-color: #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);">
            <span style="color: #ffd700; font-weight: 700;">★ CLASSIFIED DIRECTIVE:</span><br>
            <p style="font-size: 1rem; color: #ffffff; margin-top: 6px;">
              "The best superpower is consistency. Keep training your own model."
            </p>
          </div>
        `);
        break;

      case 'theme':
        if (arg === 'cyan' || arg === 'cyber cyan') {
          currentThemeIndex = 0;
        } else if (arg === 'pink' || arg === 'vapor pink') {
          currentThemeIndex = 1;
        } else if (arg === 'green' || arg === 'matrix green') {
          currentThemeIndex = 2;
        } else {
          currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
        }
        applyTheme(currentThemeIndex, true);
        break;

      case 'matrix':
        startMatrixRain();
        break;

      case 'clear':
        const output = document.getElementById('terminal-output');
        if (output) output.innerHTML = '';
        appendTerminalLine('<span class="term-accent">[BUFFER CLEARED]</span> Type <code class="term-pink">help</code> for commands.');
        break;

      case 'exit':
        appendTerminalLine('<span class="term-accent">[SESSION CLOSING]</span> Returning focus to primary interface...');
        setTimeout(closeTerminal, 400);
        break;

      default:
        appendTerminalLine(`
          <span style="color: #ff5f56;">Command not recognized: '${escapeHtml(trimmed)}'.</span><br>
          <span style="color: var(--text-muted);">Type <code class="term-accent">help</code> for available directives or <code class="term-pink">exit</code> to close.</span>
        `);
        break;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --------------------------------------------------------------------------
  // 12. TERMINAL MATRIX CODE CASCADE ANIMATION
  // --------------------------------------------------------------------------
  function startMatrixRain() {
    const canvas = document.getElementById('terminal-matrix-canvas');
    if (!canvas) return;

    stopMatrixRain();

    canvas.classList.add('active');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight - 60;

    const ctx = canvas.getContext('2d');
    const chars = '0123456789ABCDEFアイウエオカキクケコサシスセソタチツテトKVNR_AI_CORE';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -20);
    }

    appendTerminalLine('<span class="term-success">[RUNNING]</span> Matrix digital rain initialized for 3.5 seconds...');

    matrixRainInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(3, 10, 5, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);

    // Stop after 3.5 seconds
    setTimeout(() => {
      stopMatrixRain();
      appendTerminalLine('<span class="term-accent">[MATRIX STREAM COMPLETE]</span> Neural telemetry stabilized.');
    }, 3500);
  }

  function stopMatrixRain() {
    if (matrixRainInterval) {
      clearInterval(matrixRainInterval);
      matrixRainInterval = null;
    }
    const canvas = document.getElementById('terminal-matrix-canvas');
    if (canvas) {
      canvas.classList.remove('active');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // --------------------------------------------------------------------------
  // 13. TERMINAL EVENT LISTENERS & SHORTCUTS
  // --------------------------------------------------------------------------
  function initTerminalListeners() {
    const heroOrb = document.getElementById('hero-ai-orb');
    const floatingBtn = document.getElementById('floating-terminal-btn');
    const openBtns = document.querySelectorAll('.open-terminal-btn');
    const closeBtn = document.getElementById('terminal-close-btn');
    const backdrop = document.getElementById('terminal-backdrop');
    const input = document.getElementById('terminal-input');

    if (heroOrb) heroOrb.addEventListener('click', openTerminal);
    if (floatingBtn) floatingBtn.addEventListener('click', openTerminal);
    openBtns.forEach(btn => btn.addEventListener('click', openTerminal));

    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
    if (backdrop) backdrop.addEventListener('click', closeTerminal);

    // Global Keydown: Escape to close, Backtick (`) or Ctrl+K to toggle
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isTerminalOpen()) {
        closeTerminal();
        return;
      }

      // Backtick or Ctrl+K triggers terminal when not currently typing in a form input
      const isFormInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if ((e.key === '`' || e.key === '~' || (e.ctrlKey && e.key === 'k')) && (!isFormInput || isTerminalOpen())) {
        e.preventDefault();
        if (isTerminalOpen()) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }
    });

    // Terminal Input events: Enter, Up/Down history, Tab autocomplete
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = input.value;
          input.value = '';
          handleTerminalCommand(val);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (commandHistory.length > 0) {
            if (historyIndex > 0) historyIndex--;
            input.value = commandHistory[historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (commandHistory.length > 0) {
            if (historyIndex < commandHistory.length - 1) {
              historyIndex++;
              input.value = commandHistory[historyIndex] || '';
            } else {
              historyIndex = commandHistory.length;
              input.value = '';
            }
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const current = input.value.trim().toLowerCase();
          if (current) {
            const commands = ['help', 'about', 'skills', 'projects', 'resume', 'contact', 'fun-fact', 'joke', 'theme', 'matrix', 'secret', 'clear', 'exit'];
            const match = commands.find(c => c.startsWith(current));
            if (match) {
              input.value = match;
            }
          }
        }
      });
    }
  }


  // --------------------------------------------------------------------------
  // RESUME MODAL HANDLERS
  // --------------------------------------------------------------------------
  function openResumeModal() {
    const modal = document.getElementById('resume-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeResumeModal() {
    const modal = document.getElementById('resume-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function initResumeModalListeners() {
    const openBtns = document.querySelectorAll('.open-resume-modal-btn');
    const closeBtn = document.getElementById('resume-close-btn');
    const backdrop = document.getElementById('resume-modal-backdrop');

    openBtns.forEach(btn => btn.addEventListener('click', openResumeModal));
    if (closeBtn) closeBtn.addEventListener('click', closeResumeModal);
    if (backdrop) backdrop.addEventListener('click', closeResumeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const resumeModal = document.getElementById('resume-modal');
        if (resumeModal && resumeModal.classList.contains('open')) {
          closeResumeModal();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 14. INITIALIZATION ENTRY POINT
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollTracking();
    initMobileMenu();
    initCustomCursor();
    initTypingAnimation();
    initNeuralCanvas();
    initScrollReveal();
    initTiltCards();
    initContactUtilities();
    initTerminalListeners();
    initResumeModalListeners();

    // Friendly developer greeting in browser console
    console.log(
      '%c✦ KVNR NEURAL LAB // ONLINE ✦\n%cKoduri Venkata Narasimha Reddy | 3rd-Year CSE Undergrad\nStage 2 ATF Qualifier 2025 | Future AI Engineer\nAWS Amplify Ready - Pure Vanilla HTML/CSS/JS',
      'color: #00f5ff; font-family: monospace; font-size: 16px; font-weight: bold;',
      'color: #ff2e97; font-family: monospace; font-size: 12px;'
    );
  });

})();
