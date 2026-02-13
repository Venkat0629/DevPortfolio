# Personal Portfolio

A world-class, production-ready personal portfolio web application built with React + Vite, featuring modern UI/UX, smooth animations, and a config-driven architecture.

## Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Config-Driven**: All portfolio data comes from a single JSON file (`src/data/portfolio.json`)
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Fully Responsive**: Mobile-first design for all screen sizes
- **Smooth Animations**: Page transitions, scroll reveals, and micro-interactions
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML
- **Accessible**: ARIA labels, keyboard navigation, and proper contrast ratios
- **Performance**: Code splitting, lazy loading, and optimized builds

## Sections

- **Hero**: Animated introduction with stats and social links
- **About**: Personal bio with highlights
- **Skills**: Categorized skills with animated progress bars
- **Experience**: Timeline-based work history
- **Projects**: Filterable project cards with hover effects
- **Contact**: Form with validation and toast notifications
- **Resume Viewer**: In-app PDF viewer with download option

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Portfolio Data

Edit `src/data/portfolio.json` to customize:

- Personal information (name, bio, contact)
- Social media links
- Skills and categories
- Work experience
- Projects
- Certifications and achievements

### Theme Colors

Modify colors in `src/index.css` under the `@theme` block:

```css
@theme {
  --color-primary-500: #0ea5e9;
  --color-accent-500: #d946ef;
}
```

### Resume

Place your resume PDF in the `public` folder and update the `resumeUrl` in `portfolio.json`.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, ErrorBoundary
│   ├── sections/        # Hero, About, Skills, etc.
│   └── ui/              # Reusable components
├── context/             # Theme and Portfolio contexts
├── data/                # portfolio.json config
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and animations
└── types/               # TypeScript definitions
```

## Deployment

Build the project and deploy the `dist` folder to any static hosting:

```bash
npm run build
```

Compatible with: Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.

## License

MIT License - feel free to use this template for your own portfolio!
