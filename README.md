# Space Portfolio - Interactive Solar System

An immersive Three.js-based portfolio website featuring a space theme where visitors can explore projects by interacting with a solar system. Each planet and the sun represent different projects, creating an engaging and memorable way to showcase technical skills.

![Space Portfolio Preview](https://via.placeholder.com/800x400/000011/ffffff?text=Space+Portfolio+Preview)

## 🌟 Features

- **Interactive 3D Solar System** - Fully navigable 3D space environment
- **Planetary Project Showcase** - Each planet represents a different project
- **Realistic Orbital Mechanics** - Planets orbit the sun with realistic timing
- **Click Interactions** - Click on any celestial body to learn about projects
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Clean, space-themed interface with smooth animations
- **Performance Optimized** - 60fps on desktop, optimized for mobile devices

## 🚀 Live Demo

[View Live Demo](https://your-portfolio-url.com) *(Replace with your actual URL)*

## 🛠️ Technologies Used

- **Three.js** - 3D graphics and WebGL rendering
- **Vanilla JavaScript** - Core application logic
- **CSS3** - Styling and animations
- **Vite** - Build tool and development server
- **HTML5** - Semantic markup

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/space-portfolio.git
   cd space-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Alternative Setup (Simple HTTP Server)

If you prefer not to use Node.js:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have it)
npx serve .
```

## 🎮 Controls

- **Mouse Click** - Interact with planets and sun
- **Mouse Drag** - Rotate camera around the solar system
- **Mouse Wheel** - Zoom in/out
- **Middle Mouse Button** - Pan camera
- **Space Bar** - Pause/resume planetary motion
- **R Key** - Reset camera position

## 🔧 Customization

### Adding Your Projects

1. **Update Project Data** in `main.js`:

```javascript
this.projectData = {
    sun: {
        title: "About Me",
        description: "Your bio and introduction",
        demo: "https://your-website.com",
        github: "https://github.com/yourusername"
    },
    mercury: {
        title: "Your Project Name",
        description: "Project description and technologies used",
        demo: "https://your-demo-link.com",
        github: "https://github.com/yourusername/project"
    },
    // Add more planets...
};
```

2. **Customize Planet Appearance**:

```javascript
// In createSolarSystem() method
this.createPlanet('planetname', size, color, distance);
```

### Styling Customization

- **Colors**: Modify the CSS variables in `style.css`
- **Fonts**: Update font imports and CSS font-family declarations
- **Animations**: Adjust animation durations and easing functions
- **Layout**: Modify the responsive breakpoints and UI positioning

### Adding New Features

The codebase is modular and extensible:

- **New celestial bodies**: Add methods similar to `createPlanet()`
- **Visual effects**: Extend the scene with particle systems
- **UI components**: Add new modal types or overlay elements
- **Interactions**: Extend the raycasting system for new interactive elements

## 📁 Project Structure

```
space-portfolio/
├── index.html          # Main HTML file
├── main.js            # Three.js application logic
├── style.css          # Styling and animations
├── package.json       # Dependencies and scripts
├── README.md          # Project documentation
├── PRD.md            # Product Requirements Document
└── assets/           # 3D models and textures (add your own)
    ├── models/
    ├── textures/
    └── sounds/
```

## 🎨 Adding 3D Assets

### Planet Textures

1. Create an `assets/textures/` directory
2. Add planet texture images (JPG/PNG format)
3. Update the material creation in `createPlanet()`:

```javascript
const texture = new THREE.TextureLoader().load('assets/textures/earth.jpg');
const planetMaterial = new THREE.MeshLambertMaterial({ map: texture });
```

### 3D Models

1. Export models in GLTF/GLB format
2. Use Three.js GLTFLoader:

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('assets/models/spaceship.glb', (gltf) => {
    scene.add(gltf.scene);
});
```

## 📱 Mobile Optimization

The portfolio is optimized for mobile devices with:

- Touch-friendly controls
- Reduced particle counts on mobile
- Optimized rendering settings
- Responsive UI scaling
- Performance monitoring

To further optimize for mobile:

1. Reduce polygon counts for complex models
2. Use texture compression
3. Implement level-of-detail (LOD) systems
4. Add performance-based quality settings

## 🔍 SEO and Accessibility

### SEO Features

- Semantic HTML structure
- Meta tags and Open Graph data
- Structured data markup
- Fast loading times

### Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences
- Focus indicators

## 🚀 Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects if needed

### Vercel

1. Connect your GitHub repository
2. Vercel will automatically build and deploy
3. Configure custom domains as needed

### GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

## 🐛 Troubleshooting

### Common Issues

**Three.js not loading:**
- Check browser WebGL support
- Verify Three.js import paths
- Check browser console for errors

**Performance issues:**
- Reduce star count in `createStarField()`
- Lower planet geometry detail
- Disable shadows on lower-end devices

**Mobile compatibility:**
- Test on actual devices, not just browser dev tools
- Implement touch event fallbacks
- Optimize texture sizes for mobile

### Performance Monitoring

Add performance monitoring:

```javascript
// Monitor FPS
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    // ... rendering code
    stats.end();
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - Amazing 3D library that makes this possible
- **WebGL** - For hardware-accelerated 3D graphics in browsers
- **Vite** - Fast and modern build tool
- **Space imagery** - NASA and ESA for inspiration

## 📞 Contact

- **Portfolio**: [Your Website](https://your-website.com)
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Email**: your.email@example.com

---

⭐ **Star this repository if you found it helpful!**

Built with ❤️ and JavaScript 