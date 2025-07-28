import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class SpacePortfolio {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planets = [];
        this.sun = null;
        this.animationId = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.loader = new GLTFLoader();
        
        // Simplified camera state - always overview
        this.cameraState = 'overview';
        
        // Project data - you can modify this to add your actual projects
        this.projectData = {
            sun: {
                title: "About Me",
                description: "Welcome to my portfolio! I'm a passionate developer who loves creating interactive experiences. The sun represents the core of my journey in tech.",
                demo: "#",
                github: "#"
            },
            mercury: {
                title: "Project Mercury",
                description: "A fast and lightweight web application built with modern technologies. This project showcases my skills in frontend development.",
                demo: "#",
                github: "#"
            },
            venus: {
                title: "Project Venus",
                description: "A beautiful and responsive design system. This project demonstrates my expertise in UI/UX design and CSS animations.",
                demo: "#",
                github: "#"
            },
            earth: {
                title: "Project Earth",
                description: "A full-stack application that connects people and ideas. Built with Node.js, React, and MongoDB.",
                demo: "#",
                github: "#"
            },
            mars: {
                title: "Project Mars",
                description: "An ambitious machine learning project that explores data analysis and prediction algorithms.",
                demo: "#",
                github: "#"
            },
            jupiter: {
                title: "Project Jupiter",
                description: "A large-scale enterprise solution with microservices architecture. Showcases my backend development skills.",
                demo: "#",
                github: "#"
            },
            saturn: {
                title: "Project Saturn",
                description: "A comprehensive enterprise platform with beautiful ring architecture. Features scalable microservices design.",
                demo: "#",
                github: "#"
            },
            uranus: {
                title: "Project Uranus",
                description: "An innovative tilted approach to problem solving. Unique perspective on conventional development challenges.",
                demo: "#",
                github: "#"
            },
            neptune: {
                title: "Project Neptune",
                description: "An advanced data analytics platform with machine learning capabilities. Deep dive into complex algorithms.",
                demo: "#",
                github: "#"
            },

        };

        this.init();
    }

    init() {
        console.log('Initializing Space Portfolio...');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createStarField();
        console.log('Creating solar system...');
        this.createSolarSystem();
        this.setupEventListeners();
        this.setupUI();
        this.animate();
        
        // Force hide loading screen after animation starts
        this.forceHideLoadingScreen();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 25, 60); // Zoomed out more to see the expanded solar system
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true 
        });
        
        // Force canvas to full viewport size
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // AGGRESSIVELY force canvas to full size
        canvas.style.cssText = `
            width: ${width}px !important;
            height: ${height}px !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1 !important;
            display: block !important;
        `;
        
        // Also force the attributes
        canvas.width = width;
        canvas.height = height;
        
        console.log('Renderer created - Canvas size:', width, 'x', height);
        console.log('Canvas element dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
        console.log('Canvas actual width/height attributes:', canvas.width, 'x', canvas.height);
    }

    createLights() {
        // Brighter ambient light for better visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Point light from the sun - brighter and longer range for bigger system
        const sunLight = new THREE.PointLight(0xffffff, 4, 150);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Additional directional light for better overall illumination
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Hemisphere light for more natural lighting
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x362d1d, 0.5);
        this.scene.add(hemisphereLight);
    }

    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 200;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    createSolarSystem() {
        // Create Sun
        this.createSun();
        
                // Create Planets with wider orbits to prevent overlapping
        this.createPlanet('mercury', 25, 0xff6b47, 8, 'assets/models/Mercury.glb', 0);
        this.createPlanet('venus', 0.02, 0xffc649, 12, 'assets/models/Venus.glb', Math.PI * 0.3);
        this.createPlanet('earth', 0.06, 0x6b93d6, 16, 'assets/models/Earth-2.glb', Math.PI * 0.6);
        this.createPlanet('mars', 1.33, 0xff4500, 20, null, Math.PI * 0.9); // Red sphere - Mars models have compatibility issues
        this.createPlanet('jupiter', 0.25, 0xd8ca9d, 26, 'assets/models/Jupiter.glb', Math.PI * 1.2);
        this.createPlanet('saturn', 2.5, 0xfad5a5, 32, 'assets/models/Saturn.glb', Math.PI * 1.5);
        this.createPlanet('uranus', 2.5, 0x4fd0e7, 38, 'assets/models/Uranus.glb', Math.PI * 1.8);
        this.createPlanet('neptune', 2.5, 0x4169E1, 44, 'assets/models/Neptune.glb', Math.PI * 0.1);
        
        // Moon removed for now
    }

    createSun() {
        console.log('Loading Sun model...');
        // Load 3D Sun model
        this.loader.load('assets/models/Sun.glb', (gltf) => {
            this.sun = gltf.scene;
            
            // Scale the sun much bigger - same size as planets
            this.sun.scale.setScalar(7);
            
            // Position at center
            this.sun.position.set(0, 0, 0);
            
            // Add user data for interaction
            this.sun.userData = { 
                type: 'sun', 
                project: 'sun',
                clickable: true 
            };
            
            // Make it glow
            this.sun.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0xffaa00);
                    child.material.emissiveIntensity = 0.2;
                }
            });
            
            this.scene.add(this.sun);
            console.log('Sun model loaded successfully!');
        }, undefined, (error) => {
            console.error('Failed to load Sun model:', error);
            // Create fallback sun
            const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32);
            const sunMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                emissive: 0xffaa00,
                emissiveIntensity: 0.3
            });
            this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
            this.sun.userData = { 
                type: 'sun', 
                project: 'sun',
                clickable: true 
            };
            this.scene.add(this.sun);
            console.log('Fallback sun created!');
        });
    }

    createPlanet(name, size, color, distance, modelPath, initialRotation = 0) {
        // Create planet group for orbit
        const planetGroup = new THREE.Group();
        
        // Set initial orbital position to spread planets out
        planetGroup.rotation.y = initialRotation;
        
        if (modelPath) {
            // Load 3D model
            this.loader.load(modelPath, (gltf) => {
                const planet = gltf.scene;
                
                // Scale the model to appropriate size
                planet.scale.setScalar(size);
                
                // Position planet
                planet.position.x = distance;
                planet.castShadow = true;
                planet.receiveShadow = true;
                
                // Add user data for interaction
                planet.userData = { 
                    type: 'planet', 
                    name: name,
                    project: name,
                    distance: distance,
                    clickable: true 
                };
                
                planetGroup.add(planet);
                
                // Store planet data with better speed calculation
                this.planets.push({
                    group: planetGroup,
                    mesh: planet,
                    name: name,
                    distance: distance,
                    speed: 0.02 / Math.sqrt(distance) // More realistic orbital speed
                });

                console.log(`${name} planet loaded successfully! Scale: ${size}, Position: ${distance}`);
            }, undefined, (error) => {
                console.error(`Failed to load ${name} planet model:`, error);
                console.log(`Model path: ${modelPath}`);
                
                // Create a fallback sphere if model fails to load
                console.log(`Creating fallback sphere for ${name}`);
                const fallbackGeometry = new THREE.SphereGeometry(size, 32, 32);
                const fallbackMaterial = new THREE.MeshLambertMaterial({ color: color });
                const fallbackPlanet = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
                
                fallbackPlanet.position.x = distance;
                fallbackPlanet.castShadow = true;
                fallbackPlanet.receiveShadow = true;
                fallbackPlanet.userData = { 
                    type: 'planet', 
                    name: name,
                    project: name,
                    distance: distance,
                    clickable: true 
                };
                
                planetGroup.add(fallbackPlanet);
                
                this.planets.push({
                    group: planetGroup,
                    mesh: fallbackPlanet,
                    name: name,
                    distance: distance,
                    speed: 0.02 / Math.sqrt(distance)
                });
            });
        } else {
            // Fallback to simple sphere for planets without models
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshLambertMaterial({ color: color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            // Position planet
            planet.position.x = distance;
            planet.castShadow = true;
            planet.receiveShadow = true;
            
            // Add user data for interaction
            planet.userData = { 
                type: 'planet', 
                name: name,
                project: name,
                distance: distance,
                clickable: true 
            };
            
            planetGroup.add(planet);
            
            // Store planet data with better speed calculation
            this.planets.push({
                group: planetGroup,
                mesh: planet,
                name: name,
                distance: distance,
                speed: 0.02 / Math.sqrt(distance) // More realistic orbital speed
            });
        }
        
        this.scene.add(planetGroup);
        
        // Create orbit line
        this.createOrbitLine(distance);
    }



    createOrbitLine(radius) {
        const points = [];
        const segments = 64;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            ));
        }
        
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.3
        });
        
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        this.scene.add(orbitLine);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Mouse interaction
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Force a resize check after setup
        setTimeout(() => {
            console.log('Triggering manual resize check...');
            this.onWindowResize();
            
                    // AGGRESSIVELY force canvas size again  
        const canvas = document.getElementById('three-canvas');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.style.cssText = `
            width: ${width}px !important;
            height: ${height}px !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1 !important;
            display: block !important;
        `;
        canvas.width = width;
        canvas.height = height;
        console.log('AGGRESSIVELY forced canvas resize to:', width, 'x', height);
        }, 100);
        
        // Keyboard controls
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        
        console.log('Event listeners set up successfully');
    }

    setupUI() {
        // Close modal when clicking the X or outside the modal
        const modal = document.getElementById('project-modal');
        const closeBtn = modal.querySelector('.close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    onMouseClick(event) {
        console.log('Mouse click detected!', event.clientX, event.clientY);
        
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        console.log('Mouse normalized coords:', this.mouse.x, this.mouse.y);

        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Get all clickable objects
        const clickableObjects = [];
        
        // Add sun if it exists
        if (this.sun) {
            clickableObjects.push(this.sun);
            console.log('Added sun to clickable objects');
        }
        
        // Add planets if they exist
        this.planets.forEach(planet => {
            if (planet.mesh) {
                clickableObjects.push(planet.mesh);
                console.log('Added planet to clickable:', planet.name);
            }
        });

        console.log('Clickable objects:', clickableObjects.length);
        console.log('Clickable objects array:', clickableObjects);

        // Calculate intersections - use recursive to find nested objects
        const intersects = this.raycaster.intersectObjects(clickableObjects, true);

        console.log('Intersections found:', intersects.length);
        console.log('Raycaster ray direction:', this.raycaster.ray.direction);
        console.log('Raycaster ray origin:', this.raycaster.ray.origin);
        
        if (intersects.length > 0) {
            console.log('First intersection:', intersects[0]);
        } else {
            // Debug: Let's see what's in our scene
            console.log('No intersections. Checking object positions:');
            if (this.sun) {
                console.log('Sun position:', this.sun.position);
                console.log('Sun scale:', this.sun.scale);
            }
            this.planets.slice(0, 2).forEach(planet => {
                console.log(`${planet.name} position:`, planet.mesh.position);
                console.log(`${planet.name} scale:`, planet.mesh.scale);
            });
        }

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log('Clicked object:', clickedObject);
            
            // Find which planet/sun was clicked using simple detection
            let projectKey = null;
            
            // Check if it's the sun
            if (clickedObject === this.sun || clickedObject.parent === this.sun) {
                projectKey = 'sun';
            } else {
                // Check planets
                for (const planet of this.planets) {
                    if (clickedObject === planet.mesh || clickedObject.parent === planet.mesh) {
                        projectKey = planet.name;
                        break;
                    }
                }
            }

            console.log('Detected project:', projectKey);
            if (projectKey && this.projectData[projectKey]) {
                this.showProjectModal(projectKey);
            }
        }
    }

    onMouseMove(event) {
        // Update mouse position for hover effects
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for hover
        const clickableObjects = [this.sun];
        this.planets.forEach(planet => clickableObjects.push(planet.mesh));
        
        const intersects = this.raycaster.intersectObjects(clickableObjects);
        
        // Update cursor
        document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }

    onKeyDown(event) {
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                // Pause/resume animation
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                } else {
                    this.animate();
                }
                break;
            case 'KeyR':
                // Reset camera position
                this.camera.position.set(0, 25, 60);
                this.camera.lookAt(0, 0, 0);
                break;
        }
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // AGGRESSIVELY force canvas to full size
        const canvas = document.getElementById('three-canvas');
        canvas.style.cssText = `
            width: ${width}px !important;
            height: ${height}px !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1 !important;
            display: block !important;
        `;
        canvas.width = width;
        canvas.height = height;
        
        console.log('Window resized to:', width, 'x', height);
        console.log('Canvas element dimensions after resize:', canvas.offsetWidth, 'x', canvas.offsetHeight);
        console.log('Canvas actual width/height attributes:', canvas.width, 'x', canvas.height);
    }

    forceHideLoadingScreen() {
        // Hide loading screen aggressively with multiple attempts
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
                loadingScreen.style.visibility = 'hidden';
                loadingScreen.style.opacity = '0';
                loadingScreen.remove(); // Completely remove it
                console.log('Loading screen FORCE HIDDEN and removed');
            }
        }, 500);
        
        // Backup hide attempt
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.remove();
                console.log('Loading screen backup removal');
            }
        }, 2000);
    }

    showProjectModal(projectKey) {
        const project = this.projectData[projectKey];
        if (!project) return;

        console.log('Showing modal for:', projectKey);
        
        // Update modal content
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        
        // Update tech stack if exists
        const techElement = document.getElementById('modal-tech');
        if (project.tech && techElement) {
            techElement.innerHTML = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
        }
        
        // Update link if exists
        const linkElement = document.getElementById('modal-link');
        if (project.link && linkElement) {
            linkElement.href = project.link;
            linkElement.style.display = 'inline-block';
        } else if (linkElement) {
            linkElement.style.display = 'none';
        }
        
        // Show modal
        document.getElementById('project-modal').style.display = 'flex';
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        // Rotate sun - slower spin
        if (this.sun && this.sun.rotation) {
            this.sun.rotation.y += deltaTime * 0.2;
        }
        
        // Animate planets
        this.planets.forEach(planetData => {
            // Orbit around sun with improved speed
            planetData.group.rotation.y += planetData.speed * deltaTime * 10;
            
            // Rotate planet on its own axis - slower spin
            if (planetData.mesh.rotation) {
                planetData.mesh.rotation.y += deltaTime * 0.5;
            }
        });
        
        // Camera transitions removed - simplified to basic controls
        
        // Moon removed
        
        // Simple camera orbit (optional - remove if you want manual control)
        // this.camera.position.x = Math.cos(elapsedTime * 0.1) * 15;
        // this.camera.position.z = Math.sin(elapsedTime * 0.1) * 15;
        // this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Camera transitions removed - using simple drag/zoom controls only

    // Camera controls for dragging to rotate around solar system
    addCameraControls() {
        console.log('Adding camera controls...');
        
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        
        // Store reference to this for event handlers
        const self = this;
        
        // Mouse down - start dragging
        window.addEventListener('mousedown', (e) => {
            console.log('Mouse down detected');
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.body.style.cursor = 'grabbing';
        });
        
        // Mouse up - stop dragging
        window.addEventListener('mouseup', () => {
            console.log('Mouse up detected');
            isMouseDown = false;
            document.body.style.cursor = 'default';
        });
        
        // Mouse move - rotate camera around solar system
        window.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                console.log('Mouse drag detected, camera state:', self.cameraState);
                // TEMPORARILY REMOVE camera state check to fix drag
                if (true) { // was: if (self.cameraState === 'overview') {
                    const deltaX = e.clientX - mouseX;
                    const deltaY = e.clientY - mouseY;
                    
                    // Convert camera position to spherical coordinates
                    const spherical = new THREE.Spherical();
                    spherical.setFromVector3(self.camera.position);
                    
                    // Rotate around Y-axis (horizontal movement)
                    spherical.theta -= deltaX * 0.005;
                    
                    // Rotate around X-axis (vertical movement)
                    spherical.phi += deltaY * 0.005;
                    
                    // Clamp vertical rotation to prevent flipping
                    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
                    
                    // Update camera position
                    self.camera.position.setFromSpherical(spherical);
                    self.camera.lookAt(0, 0, 0);
                    
                    console.log('Camera position updated:', self.camera.position.x, self.camera.position.y, self.camera.position.z);
                    
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                }
            }
        });
        
        // Zoom with mouse wheel - only in overview mode
        window.addEventListener('wheel', (e) => {
            console.log('Mouse wheel detected, camera state:', self.cameraState);
            console.log('Wheel deltaY:', e.deltaY);
            // TEMPORARILY REMOVE camera state check to fix wheel
            if (true) { // was: if (self.cameraState === 'overview') {
                e.preventDefault();
                const distance = self.camera.position.length();
                const newDistance = distance + e.deltaY * 0.02;
                
                console.log('Current distance:', distance, 'New distance:', newDistance);
                
                // Clamp zoom distance
                if (newDistance > 20 && newDistance < 150) {
                    self.camera.position.normalize().multiplyScalar(newDistance);
                    console.log('Camera zoom updated to:', newDistance);
                } else {
                    console.log('Zoom clamped - out of range:', newDistance);
                }
            } else {
                console.log('Zoom blocked - not in overview mode');
            }
        });
        
        console.log('Camera controls added successfully');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new SpacePortfolio();
    portfolio.addCameraControls();
});

// Export for potential use in other modules
export default SpacePortfolio; 