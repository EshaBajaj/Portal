# 🚀 Placement Management Portal

A futuristic, smart, and highly interactive Placement Management Portal built for tech-savvy colleges. This modern web application provides a seamless experience for students and recruiters with stunning animations and responsive design.

## ✨ Features

### 🎬 Animated Logo Splash Screen
- Full-screen logo display with glow and stroke animations
- Smooth fade-up transition using Framer Motion
- Professional loading experience

### 🎯 Landing Page Hero Section
- Eye-catching headline: "Your Career, One Click Away"
- Interactive hover animations and effects
- Responsive design with gradient backgrounds
- Smooth scroll indicators

### ⚡ Zig-Zag Resume Timeline
- Animated vertical timeline showing resume flow process:
  1. Student uploads resume
  2. Admin reviews submission
  3. AI/NLP matches with job descriptions
  4. Recruiter receives top matches
- Scroll-based animations using AOS.js
- Responsive zig-zag layout for desktop and mobile

### 📊 Placement Dashboard
- Interactive company cards with hover effects
- Student photos reveal on hover
- Direct LinkedIn profile integration
- Success statistics display
- 3D transform effects

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Animations:** 
  - Framer Motion (for element transitions)
  - AOS.js (for scroll-based animations)
- **Theme Colors:**
  - Primary: Blue (#002B5B)
  - Secondary: Silver (#B4B4B4)
  - Accent: White (#F1F1F1)

## 🏗️ Project Structure

```
/src
  /assets
    /logo.svg
    /students/
  /components
    LoaderLogo.jsx          # Animated splash screen
    HeroSection.jsx         # Landing hero section
    TimelineResumeFlow.jsx  # Zig-zag timeline
    PlacementDashboard.jsx  # Company/student cards
  /pages
    Landing.jsx             # Main landing page
    Login.jsx               # Future login page
    Dashboard.jsx           # Future dashboard page
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd placement-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

## 🎨 Design Features

### Animations
- **Loader Animation:** 3-second logo display with glow effects
- **Hero Animations:** Staggered text appearance with hover effects
- **Timeline Animations:** Scroll-triggered card reveals
- **Dashboard Hover:** 3D card transforms and student info reveals

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized typography scaling

### Performance Optimizations
- Lazy loading for images
- Optimized animations with GPU acceleration
- Minimal bundle size with tree shaking
- Fast initial load times

## 🔧 Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: '#002B5B',    // Main blue
  secondary: '#B4B4B4',  // Silver
  accent: '#F1F1F1',     // Light gray/white
}
```

### Animations
Modify animation settings in components or add new ones in the Tailwind config.

### Content
- Update company data in `PlacementDashboard.jsx`
- Modify timeline steps in `TimelineResumeFlow.jsx`
- Customize hero text in `HeroSection.jsx`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from [Icons8](https://icons8.com/)
- Student photos from [Unsplash](https://unsplash.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Scroll animations by [AOS](https://michalsnik.github.io/aos/)

---

Built with ❤️ for the next generation of placement management systems.