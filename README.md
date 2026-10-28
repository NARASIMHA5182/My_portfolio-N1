# ⚡ Koduri Venkata Narasimha Reddy — Futuristic Cyberpunk AI Lab Portfolio

A high-performance, futuristic personal portfolio and interactive AI laboratory for **Koduri Venkata Narasimha Reddy** — 3rd-year CSE undergraduate, Python enthusiast, Stage 2 ATF competitive coding qualifier (2025), and future AI engineer.

Built specifically for direct deployment on **AWS Amplify Hosting**.

---

## 🚀 Live Demo & AWS Amplify Deployment

This project is engineered strictly as a pure static web application:
- **Zero build steps**
- **Zero external dependencies / npm packages**
- **Zero external image asset requests** (all graphics drawn with CSS, Canvas, and inline SVG)
- **Root Entry Point**: `index.html` located at the root of the project directory.

### Deploying to AWS Amplify Hosting
1. Connect this repository to **AWS Amplify Console**.
2. Select **Host web app**.
3. Amplify will automatically detect the static root directory without requiring any build commands (`build: []`).
4. Click **Save and Deploy**. Your site goes live instantly with global AWS CloudFront edge caching and SSL!

---

## 🌟 Visual Theme & Design Aesthetics

- **Color Palette & CSS Architecture**:
  - Near-black navy (`#050816`) foundation with electric neon cyan (`#00f5ff`), electric purple (`#8a2be2`), and hot pink (`#ff2e97`).
  - **Dynamic Theme Switcher**: Instant cycling between 3 high-contrast cyberpunk palettes (**Cyber Cyan**, **Vapor Pink**, and **Matrix Green**) saved in `localStorage`.
- **Canvas Neural Network**:
  - Full-screen HTML5 Canvas simulating an animated neural network with drifting synaptic nodes and interactive cursor gravity.
  - Automatically paused when the browser tab is hidden (via Page Visibility API) to conserve battery and CPU.
  - Dynamically lowers node density on mobile devices for rock-solid 60 FPS performance.
- **Synthwave Perspective Floor**:
  - Infinite moving perspective wireframe grid rendered with CSS 3D transforms.
- **Pure CSS Glitch Effect**:
  - Multi-channel RGB chromatic aberration glitch effect on the operator heading upon load and hover.
- **Interactive Micro-Animations**:
  - Typing & deleting tagline animation cycling through key roles.
  - 3D interactive card tilt following cursor coordinates on project showcases.
  - Animated progress bars for verified tech superpowers that fill smoothly on scroll into view.
  - Custom desktop glowing dual-ring cursor trail (automatically disabled on touch screens).
  - Continuous marquee strip showcasing core competencies.
  - Full compliance with `prefers-reduced-motion`.

---

## 🤖 The Creative Feature: "Wake the AI" Terminal

The hero section features a pulsing **AI Orb** (`"👋 Wake the AI — click me"`) along with a fixed bottom-right floating trigger button (`⌨ Open AI Terminal`) and hotkeys (<kbd>`</kbd> / <kbd>~</kbd> / <kbd>Ctrl+K</kbd> / <kbd>Esc</kbd>).

Clicking either opens an interactive sci-fi terminal overlay featuring:
- **CRT Scanline & Phosphor Glow Filter**: Styled to evoke an authentic neural research terminal.
- **Animated Boot Sequence**: Realistic kernel boot simulation loading skill vectors and operator verification.
- **Full Interactive Directives**:
  - `help`: Comprehensive directory of supported commands.
  - `about`: Operator dossier, academic standing, and AI goals.
  - `skills`: Breakdown of algorithmic, database, web, and soft competencies.
  - `projects`: Summary of built systems and competitive coding honors.
  - `contact`: Direct clickable transmission channels (Email, GitHub, LinkedIn).
  - `fun-fact`: Random harmless personal facts (e.g. debugging with chai, favorite Python list comprehensions).
  - `joke`: Real-time programming and AI humor.
  - `theme`: Live toggling and re-theming of the entire website from the terminal prompt.
  - `matrix`: Spawns a real-time falling green digital rain canvas animation directly within the terminal console.
  - `secret`: Decrypts the core engineering philosophy: *"The best superpower is consistency. Keep training your own model."*
  - `clear` & `exit`: Clear output buffer or terminate the session cleanly with restored focus.
- **Accessibility & Power Features**:
  - <kbd>↑</kbd> and <kbd>↓</kbd> command history navigation.
  - <kbd>Tab</kbd> autocomplete for command directives.
  - Full mobile responsiveness: 16px font to prevent mobile viewport zooming, touch-friendly dismissals.

---

## 🛠️ Tech Superpowers & Projects Featured

### Skills
- **Core**: Python (88%), DSA with Python (82%), C (76%), Java (74%)
- **Data**: Relational DBMS (80%), MySQL & SQL Server (78%), SQLite
- **Web**: HTML5 (86%), CSS3 (82%), JavaScript ES6+ (76%)
- **Tools & Soft Skills**: VS Code (86%), Technical Communication (84%), Presentation & Demos (80%)
- **Active Specialization**: AI / Machine Learning with Python

### Projects
1. **Credit Card Approval System**: Python, HTML, JS, SQLite heuristic evaluation platform.
2. **College Hostel Management System**: Streamlit, Python, SQL Server administration suite.
3. **BuildConnect**: Municipal marketplace connecting clients with skilled construction workers with cost/manpower estimation engines.
4. **Competitive Honor**: Stage 2 Qualifier in nationwide **ATF (Amphisoft) Competitive Coding Exam (2025)**.

---

## 📄 File Structure

```text
├── index.html        # Semantic HTML5 structure with inline SVG graphics
├── style.css         # Neon cyberpunk design system, CSS variables & animations
├── script.js         # Vanilla JS: canvas, terminal, typing engine, themes
├── resume.pdf        # Downloadable resume document
└── README.md         # Documentation & deployment guide
```

---

*Built with ❤️ for the AWS Student Builder Challenge ⚡*
