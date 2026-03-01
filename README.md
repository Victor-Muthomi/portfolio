# Professional Portfolio - Enterprise Grade

A high-performance, SEO-optimized portfolio website built with Astro and JavaScript, designed for professional software engineers with Enterprise + AI theming.

## 🚀 Project Structure

```text
/
├── public/
│   ├── files/              # Downloadable files (resume, documents)
│   ├── images/             # Project images and assets
│   ├── favicon.svg
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.astro       # Fixed navigation with glassmorphism
│   │   ├── Hero.astro         # Hero section with animations
│   │   └── ProjectCard.astro  # Project showcase card
│   ├── layouts/           
│   │   ├── BaseLayout.astro   # Base HTML layout with SEO
│   │   └── MainLayout.astro   # Main layout with header/footer structure
│   ├── pages/             
│   │   ├── index.astro         # Homepage with all sections
│   │   └── layout-example.astro # Layout demo page
│   └── styles/
│       └── global.css        # Global design system
├── astro.config.mjs          # Astro configuration
├── vercel.json               # Vercel deployment config
└── package.json
```

## 🎨 Design System (Phase 1)

The project includes a comprehensive Enterprise + AI design system with:
- Deep dark theme (#0a0a0f) with layered backgrounds
- Indigo to Cyan gradient accents with glow effects
- Glassmorphism utility classes
- Gradient text effects with animations
- Professional button system with hover states
- Modern font stack (Inter)
- 8px-based spacing scale
- Responsive typography with clamp()
- Custom scrollbar styling
- Full accessibility support

## 🏗️ Layout Architecture (Phase 2)

Two-tier layout system for maximum flexibility:

**BaseLayout** - Foundation layer providing:
- HTML5 semantic structure
- SEO meta tags (title, description, robots)
- Open Graph and Twitter Card support
- Global stylesheet imports
- Performance optimizations

**MainLayout** - Structural layer providing:
- Sticky header with navigation slot
- Main content area with proper ARIA roles
- Footer with customizable slot
- Skip-to-content link for accessibility
- Flexible slot system for component reusability

## 🧩 Components (Phases 3-5)

**Navbar** - Enterprise-style fixed navigation:
- Glassmorphism effect with backdrop blur
- Gradient brand name
- Responsive mobile menu
- Smooth hover animations
- Download resume button
- Accessibility features (ARIA labels, keyboard navigation)

**Hero** - Full viewport positioning section:
- Animated entrance effects
- Gradient text highlights
- Professional tagline and description
- Dual CTA buttons (View Projects, Download Resume)
- Decorative background elements
- Scroll indicator
- Responsive typography

**ProjectCard** - Reusable project showcase component:
- Glassmorphism styling
- Hover elevation and glow effects
- Technology stack tags
- Optional project images with overlay
- Link to case study pages
- Responsive grid layout

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
