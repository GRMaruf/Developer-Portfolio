# Golam Rasul Maruf — Developer Portfolio

> A fast, accessible, and modern developer portfolio built with HTML5, Vanilla CSS, and Vanilla JavaScript. 
> Designed to showcase backend and Django development skills while demonstrating strong web fundamentals.

🔗 **Live Demo:** [https://your-portfolio-demo.vercel.app](https://your-portfolio-demo.vercel.app)

![Portfolio Preview](https://picsum.photos/seed/devfolio-readme-banner/1200/600)

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Website Sections](#-website-sections)
- [Accessibility & SEO](#-accessibility--seo)
- [Local Setup](#-local-setup)
- [Customization Guide](#-customization-guide)
- [License](#-license)

---

## 📝 Overview

This portfolio is built as a flagship project to demonstrate proficiency in web fundamentals. Instead of relying on frontend frameworks (React, Vue, etc.), it uses semantic HTML, modern vanilla CSS (Custom Properties, Grid, Flexbox), and progressive enhancement with Vanilla JS. 

The design philosophy is inspired by modern developer tools (GitHub, Linear, Vercel, Stripe) — featuring a dark-mode-first aesthetic, soft shadows, rounded cards, and smooth but restrained animations.

## ✨ Key Features

- **Dark / Light Theme Toggle:** Remembers user preference via `localStorage` and respects `prefers-color-scheme`.
- **Responsive Design:** Mobile-first approach using modern CSS functions like `clamp()` for fluid typography.
- **CSS Architecture:** Modular CSS structure (Variables, Reset, Utilities, Animations, Components) ready to be split into separate files.
- **Interactive Project Modals:** View detailed project descriptions, tech stacks, and lessons learned without leaving the page.
- **3D Scroll-Driven Word Ring:** A vanilla JS perspective-transformed ring in the "Currently Learning" section that responds to scroll velocity.
- **Form Validation:** Client-side validation with real-time error messages and accessibility attributes.
- **Zero Dependencies:** No npm install required. Just pure HTML, CSS, and JS.

## 🛠 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Flexbox, Grid, Custom Properties), Vanilla JavaScript (ES6+) |
| **Fonts** | Poppins (Display), Inter (Body), JetBrains Mono (Code) |
| **Icons** | Inline SVGs |
| **Deployment** | GitHub Pages / Vercel / Netlify *(choose one)* |

## 📂 Project Architecture

Currently, the project is delivered as a single `index.html` file for ease of deployment, but the CSS and JS are heavily commented to map exactly to the following modular architecture:

```text
portfolio/
│
├── index.html              # Main semantic HTML structure
│
├── assets/
│   ├── css/
│   │   ├── variables.css   # Colors, Typography, Spacing, Shadows
│   │   ├── reset.css       # Box-sizing, margins, defaults
│   │   ├── utilities.css   # Containers, Buttons, Cards, Helpers
│   │   ├── animations.css  # Keyframes, scroll reveals
│   │   ├── responsive.css  # Media queries
│   │   └── style.css       # Main imports & component styles
│   │
│   ├── js/
│   │   ├── theme.js        # Dark/light toggle logic
│   │   ├── navbar.js       # Mobile menu, scroll progress, active links
│   │   └── app.js          # Typing effect, modal, counters, 3D ring
│   │
│   ├── images/             # Project thumbnails, profile picture
│   └── resume/             # Resume.pdf
│
└── README.md
```

## 📄 Website Sections

1. **Hero:** Introduction, animated typing effect, CTA buttons, and floating profile badges.
2. **About:** Professional summary, animated stat counters, and fun facts.
3. **Skills:** Categorized tech stack (Languages, Backend, Frontend, Database, Tools, Practices).
4. **Projects:** Grid of project cards. Clicking opens a detailed modal with features, architecture, and lessons learned.
5. **Journey:** Combined timeline of Experience, Education, and Achievements.
6. **Certificates:** Verifiable credential cards with issuer and date.
7. **Currently Learning:** Scroll-driven 3D word ring highlighting continuous learning (Docker, Redis, System Design, etc.).
8. **Coding Profiles:** Links to GitHub, LeetCode, HackerRank, and GitHub stats.
9. **Contact:** Accessible contact form with client-side validation and availability status.

## ♿ Accessibility & SEO

- **Semantic HTML:** Uses `<header>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- **Keyboard Navigation:** Visible focus states, Esc-to-close modals, and logical tab order.
- **Reduced Motion:** All animations are disabled or minimized via `@media (prefers-reduced-motion: reduce)`.
- **ARIA:** Proper `aria-label`, `aria-expanded`, and `aria-modal` attributes where necessary.
- **SEO:** Includes Open Graph tags, Twitter Card tags, Canonical URL, and JSON-LD structured data for the `Person` schema.

## 🚀 Local Setup

Because this project uses no build tools or dependencies, running it locally is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-portfolio-repo.git
   ```
2. **Navigate to the folder:**
   ```bash
   cd your-portfolio-repo
   ```
3. **Open `index.html`:**
   Simply double-click the `index.html` file to open it in your default browser.
   *(Alternatively, use the VS Code "Live Server" extension for hot-reloading).*

## ⚙️ Customization Guide

To make this portfolio truly yours, update the following areas:

1. **Content:** Update the text, project details, and timeline information directly in `index.html`.
2. **Project Data:** The data for the project detail modals is stored in a JavaScript object named `PROJECTS` inside the `<script>` tag at the bottom of the file.
3. **Colors & Fonts:** Modify the CSS Custom Properties in the `:root` selector at the top of the `<style>` tag to instantly change the theme.
4. **Assets:** Replace placeholder images (currently using `picsum.photos`) in the `<img>` `src` attributes with your local image paths.
5. **Resume:** Add your actual `Resume.pdf` to an `assets/` folder and update the `href` on the download button.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

--- 

<p align="center">Built with ☕ and clean code by Aarav Sharma</p>
