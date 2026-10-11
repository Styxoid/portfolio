# Luxury 3D Playing Card Deck Portfolio

A sleek, high-performance personal portfolio website built around a luxury 3D interactive playing card deck theme.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **3D & Physics**: Three.js, `@react-three/fiber`, `@react-three/drei`, Framer Motion
- **Audio**: Web Audio API (procedural slide, flip, riffle, and tick synthesis with global mute toggle)
- **Palette**: Dark luxury felt (`#08090c`), velvet emerald accents (`#0f231c`), brushed gold foil (`#d4af37`), and crisp silver (`#f1f5f9`).

## ♠ Architecture & Sections

1. **The Hero: "The Shuffle & The Cut"** (`components/hero/Hero.tsx`)
   - Studio spotlighting and soft contact shadows on dark felt.
   - Suspended 3D card deck with breathing floating physics.
   - Click `[ SHUFFLE & DEAL ]` to trigger a fluid 52-card riffle shuffle, bridge cascade, and auto-camera-facing deal of the holographic "Architect Card".
   - Custom holographic GLSL shader simulating iridescence over gold-foil borders.

2. **Projects Showcase: "The Dealer's Spread"** (`components/projects/DealerSpread.tsx`)
   - 3D horizontal arc fan layout.
   - Hovering elevates and rotates cards toward camera with smooth damping.
   - Domain-specific suits:
     - ♠ Spades (The Blade): Embedded kinematics, hardware robotics, C/C++.
     - ♦ Diamonds (The Core): AI/ML, neural networks, edge vision.
     - ♣ Clubs (The Circuit): Distributed systems, APIs, telemetry dashboards.
     - ♥ Hearts (The Vector): Spatial interfaces, 3D simulation.
   - Clicking a card triggers a 3D flip and opens the focused telemetry modal with live preview, performance metrics, and source links.
   - Mobile fallback: touch-swipeable card carousel.

3. **Tech Stack: "The Card Binder"** (`components/skills/CardBinder.tsx`)
   - 4 tournament decks representing Hardware, AI & Vision, Web Architecture, and Spatial & Tools.
   - Clicking a deck deals out individual skill cards with tournament rank badges reflecting proficiency (`A` = Expert, `K` = Advanced, `Q` = Proficient, `J` = Working).

4. **Profiles & Contact: "The Final Hand / Pocket Aces"** (`components/profiles/PocketAces.tsx`)
   - Four Pocket Aces winning hand layout:
     - Ace of Spades: GitHub profile with repository highlights.
     - Ace of Diamonds: LinkedIn profile and professional network.
     - Ace of Clubs: One-click Curriculum Vitae download.
     - Ace of Hearts: Direct interactive contact card that flips to reveal a transmission dispatch form.

## 🚀 Getting Started

```bash
# Run local development server
npm run dev

# Create an optimized production build
npm run build
```

## ⚙ Personalization
Edit [lib/data.ts](file:///d:/SID%20PORTFOLIO/lib/data.ts) to update your name, role, bio, project links, skills, GitHub username, and social accounts. Drop your CV into `public/resume.pdf`.
