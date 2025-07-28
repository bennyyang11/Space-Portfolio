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
        
        // Camera state management for planet zoom
        this.cameraState = 'overview'; // 'overview' or 'planet'
        this.selectedPlanet = null;
        this.cameraTransition = {
            active: false,
            progress: 0,
            duration: 2.0,
            startPosition: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            startLookAt: new THREE.Vector3(),
            targetLookAt: new THREE.Vector3()
        };
        
        // Project data - you can modify this to add your actual projects
        this.projectData = {
            sun: {
                title: "Ben Yang - Full Stack Developer",
                description: "Welcome to my interactive portfolio! I'm a passionate full-stack developer with expertise in modern web technologies, 3D graphics, and innovative user experiences. This solar system represents my journey through different projects and technologies.",
                tech: ["JavaScript", "React", "Node.js", "Three.js", "Python", "AWS"],
                link: "https://github.com/bennyyang11"
            },
            mercury: {
                title: "QuickChat - Real-time Messaging App",
                description: "A lightning-fast real-time chat application built with WebSocket technology. Features include instant messaging, file sharing, emoji reactions, and typing indicators. Designed for speed and efficiency just like Mercury!",
                tech: ["React", "Node.js", "Socket.io", "MongoDB", "Redis"],
                link: "https://github.com/bennyyang11/quickchat"
            },
            venus: {
                title: "VenusUI - Design System Library", 
                description: "A beautiful and elegant React component library focused on accessibility and design consistency. Features customizable themes, responsive layouts, and smooth animations that make any application look stunning.",
                tech: ["React", "TypeScript", "Styled Components", "Storybook", "Figma"],
                link: "https://github.com/bennyyang11/venus-ui"
            },
            earth: {
                title: "EcoTracker - Sustainability Platform",
                description: "My home planet inspired this environmental impact tracking platform. Users can monitor their carbon footprint, set sustainability goals, and connect with eco-friendly communities. Built with love for our planet!",
                tech: ["Next.js", "PostgreSQL", "Prisma", "Chart.js", "Docker"],
                link: "https://github.com/bennyyang11/eco-tracker"
            },
            mars: {
                title: "MarsColony - Space Exploration Game",
                description: "An ambitious browser-based strategy game where players build and manage colonies on Mars. Features resource management, terraforming mechanics, and multiplayer cooperation. The red planet awaits!",
                tech: ["Three.js", "WebGL", "Canvas API", "WebRTC", "Firebase"],
                link: "https://github.com/bennyyang11/mars-colony"
            },
            jupiter: {
                title: "JupiterDB - Distributed Database System",
                description: "A massive and complex distributed database system designed for handling large-scale applications. Features automatic sharding, replication, and fault tolerance. As powerful and vast as Jupiter itself!",
                tech: ["Go", "Kubernetes", "Redis", "Protocol Buffers", "Raft Consensus"],
                link: "https://github.com/bennyyang11/jupiter-db"
            },
            saturn: {
                title: "SaturnRings - Task Management Platform",
                description: "A beautifully structured project management platform with powerful organizational features. Teams can create projects, assign tasks, track progress, and collaborate seamlessly within Saturn's elegant rings of productivity.",
                tech: ["Vue.js", "Express.js", "MongoDB", "GraphQL", "Jest"],
                link: "https://github.com/bennyyang11/saturn-rings"
            },
            uranus: {
                title: "UranusVR - Virtual Reality Experience",
                description: "A unique and unconventional VR experience that lets users explore impossible geometries and mind-bending physics. This experimental project pushes the boundaries of what's possible in virtual reality.",
                tech: ["A-Frame", "WebXR", "Three.js", "WebGL", "Blender"],
                link: "https://github.com/bennyyang11/uranus-vr"
            },
            neptune: {
                title: "NeptuneAI - Deep Learning Platform",
                description: "A deep and mysterious machine learning platform for training and deploying AI models. Features automated hyperparameter tuning, model versioning, and scalable inference pipelines. Dive deep into the ocean of artificial intelligence!",
                tech: ["Python", "TensorFlow", "Docker", "Kubernetes", "MLflow"],
                link: "https://github.com/bennyyang11/neptune-ai"
            }
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
                
                // Create invisible larger hitbox for easier clicking - with special Mercury handling
                let hitboxSize = 1.0; // Default hitbox for most planets
                
                // Special handling for Mercury's massive scale (25x)
                if (name.toLowerCase() === 'mercury') {
                    hitboxSize = 0.15; // Extra small hitbox for Mercury
                }
                
                // Debug Earth specifically
                if (name.toLowerCase() === 'earth') {
                    console.log('Creating Earth hitbox - planet size:', size, 'hitbox size:', hitboxSize);
                }
                const hitboxGeometry = new THREE.SphereGeometry(hitboxSize, 16, 16);
                const hitboxMaterial = new THREE.MeshBasicMaterial({ 
                    transparent: true, 
                    opacity: 0,
                    visible: false // Completely invisible
                });
                const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
                hitbox.userData = { type: 'hitbox', planetName: name };
                console.log(`GLB hitbox created for ${name}:`, hitbox.userData);
                planet.add(hitbox);
                
                console.log(`${name} hitbox: planet size ${size} → hitbox size ${hitboxSize.toFixed(2)}`);
                
                planetGroup.add(planet);
                
                // Store planet data with better speed calculation and hitbox
                this.planets.push({
                    group: planetGroup,
                    mesh: planet,
                    hitbox: hitbox,
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
                
                // Create invisible larger hitbox for easier clicking (fallback) - with special Mercury handling
                let hitboxSize = 1.0; // Default hitbox for most planets
                
                // Special handling for Mercury's massive scale (25x)
                if (name.toLowerCase() === 'mercury') {
                    hitboxSize = 0.15; // Extra small hitbox for Mercury
                }
                
                // Debug Earth specifically
                if (name.toLowerCase() === 'earth') {
                    console.log('Creating Earth FALLBACK hitbox - planet size:', size, 'hitbox size:', hitboxSize);
                }
                const hitboxGeometry = new THREE.SphereGeometry(hitboxSize, 16, 16);
                const hitboxMaterial = new THREE.MeshBasicMaterial({ 
                    transparent: true, 
                    opacity: 0,
                    visible: false
                });
                const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
                hitbox.userData = { type: 'hitbox', planetName: name };
                console.log(`Fallback hitbox created for ${name}:`, hitbox.userData);
                fallbackPlanet.add(hitbox);
                
                console.log(`${name} fallback hitbox: planet size ${size} → hitbox size ${hitboxSize.toFixed(2)}`);
                
                planetGroup.add(fallbackPlanet);
                
                this.planets.push({
                    group: planetGroup,
                    mesh: fallbackPlanet,
                    hitbox: hitbox,
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
                this.zoomToOverview();
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.zoomToOverview();
            }
        });
        
        // Add escape key listener for returning to overview
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cameraState === 'planet') {
                this.zoomToOverview();
            }
        });
    }

    onMouseClick(event) {
        const self = this; // Store reference for nested functions
        console.log('Mouse click detected!', event.clientX, event.clientY);
        
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        console.log('Mouse normalized coords:', this.mouse.x, this.mouse.y);

        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Get all clickable objects (including hitboxes for easier clicking)
        const clickableObjects = [];
        
        // Add sun if it exists
        if (this.sun) {
            // Create larger hitbox for sun if it doesn't exist
            if (!this.sun.userData.hitbox) {
                const sunHitboxGeometry = new THREE.SphereGeometry(.5, 16, 16);
                const sunHitboxMaterial = new THREE.MeshBasicMaterial({ 
                    transparent: true, 
                    opacity: 0,
                    visible: false
                });
                const sunHitbox = new THREE.Mesh(sunHitboxGeometry, sunHitboxMaterial);
                sunHitbox.userData = { type: 'hitbox', planetName: 'sun' };
                this.sun.add(sunHitbox);
                this.sun.userData.hitbox = sunHitbox;
            }
            clickableObjects.push(this.sun);
            console.log('Added sun to clickable objects');
        }
        
        // Add planets and their hitboxes
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
            console.log('Clicked object userData:', clickedObject.userData);
            console.log('Clicked object userData type:', clickedObject.userData?.type);
            console.log('Clicked object userData planetName:', clickedObject.userData?.planetName);
            console.log('Clicked object parent:', clickedObject.parent);
            if (clickedObject.parent) {
                console.log('Parent userData:', clickedObject.parent.userData);
                console.log('Parent userData type:', clickedObject.parent.userData?.type);
                console.log('Parent userData name:', clickedObject.parent.userData?.name);
            }
            
            // Find which planet/sun was clicked by traversing up the scene graph
            let projectKey = null;
            
            // Function to traverse up and find planet or sun
            function findPlanetInHierarchy(object) {
                let current = object;
                while (current) {
                    // Check if it's a hitbox
                    if (current.userData && current.userData.type === 'hitbox') {
                        console.log('Found hitbox for:', current.userData.planetName);
                        return current.userData.planetName;
                    }
                    
                    // Check if it's the sun
                    if (current === self.sun) {
                        console.log('Found sun');
                        return 'sun';
                    }
                    
                    // Check if this object or any parent belongs to a planet
                    for (const planet of self.planets) {
                        if (current === planet.mesh || current === planet.group) {
                            console.log('Found planet via traversal:', planet.name);
                            return planet.name;
                        }
                        // Also check if current is a child of the planet mesh
                        if (planet.mesh && planet.mesh.children.includes(current)) {
                            console.log('Found planet via child relationship:', planet.name);
                            return planet.name;
                        }
                        // Check if current is anywhere in the planet's group hierarchy
                        if (isDescendantOf(current, planet.group)) {
                            console.log('Found planet via group hierarchy:', planet.name);
                            return planet.name;
                        }
                    }
                    
                    current = current.parent;
                }
                return null;
            }
            
            // Helper function to check if an object is a descendant of another
            function isDescendantOf(child, parent) {
                let current = child;
                while (current) {
                    if (current === parent) return true;
                    current = current.parent;
                }
                return false;
            }
            
            projectKey = findPlanetInHierarchy(clickedObject);
            console.log('Final projectKey determined:', projectKey);

            console.log('Detected project:', projectKey);
            if (projectKey && this.projectData[projectKey]) {
                console.log('Attempting to zoom to:', projectKey);
                console.log('Camera state before zoom:', this.cameraState);
                this.zoomToPlanet(projectKey);
            } else {
                console.log('No project data found for:', projectKey);
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
        
        // Set up back button
        const backBtn = document.getElementById('back-to-overview');
        if (backBtn) {
            backBtn.onclick = () => this.zoomToOverview();
        }
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
        
        // Handle smooth camera transitions for planet zoom
        this.updateCameraTransitions(deltaTime);
        
        // Moon removed
        
        // Simple camera orbit (optional - remove if you want manual control)
        // this.camera.position.x = Math.cos(elapsedTime * 0.1) * 15;
        // this.camera.position.z = Math.sin(elapsedTime * 0.1) * 15;
        // this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateCameraTransitions(deltaTime) {
        if (!this.cameraTransition.active && this.cameraState !== 'planet') return;
        
        // If we're in planet mode, continuously follow the planet
        if (this.cameraState === 'planet' && this.selectedPlanet) {
            this.updateCameraFollowPlanet();
        }
        
        // Handle active transitions
        if (this.cameraTransition.active) {
            // Update transition progress
            this.cameraTransition.progress += deltaTime / this.cameraTransition.duration;
            this.cameraTransition.progress = Math.min(1, this.cameraTransition.progress);
            
            // Smooth easing function
            const t = this.cameraTransition.progress;
            const easeInOut = t * t * (3 - 2 * t);
            
            // Interpolate camera position
            this.camera.position.lerpVectors(
                this.cameraTransition.startPosition,
                this.cameraTransition.targetPosition,
                easeInOut
            );
            
            // Interpolate look-at target
            const currentLookAt = new THREE.Vector3().lerpVectors(
                this.cameraTransition.startLookAt,
                this.cameraTransition.targetLookAt,
                easeInOut
            );
            this.camera.lookAt(currentLookAt);
            
            // End transition
            if (this.cameraTransition.progress >= 1) {
                this.cameraTransition.active = false;
                console.log('Camera transition completed');
            }
        }
    }
    
    updateCameraFollowPlanet() {
        if (!this.selectedPlanet) return;
        
        // Get the current world position of the selected planet
        const currentPlanetPosition = new THREE.Vector3();
        
        if (this.selectedPlanet.key === 'sun') {
            currentPlanetPosition.copy(this.sun.position);
        } else {
            const planet = this.planets.find(p => p.name === this.selectedPlanet.key);
            if (planet && planet.mesh) {
                if (planet.group) {
                    planet.mesh.getWorldPosition(currentPlanetPosition);
                } else {
                    currentPlanetPosition.copy(planet.mesh.position);
                }
            }
        }
        
        // Update camera to follow the planet smoothly
        const offset = new THREE.Vector3(5, 3, 5);
        const targetCameraPosition = currentPlanetPosition.clone().add(offset);
        
        // Smooth camera following
        this.camera.position.lerp(targetCameraPosition, 0.05);
        this.camera.lookAt(currentPlanetPosition);
        
        // Update selected planet position for reference
        this.selectedPlanet.position = currentPlanetPosition.clone();
    }

    zoomToPlanet(projectKey) {
        if (this.cameraState === 'planet') {
            console.log('Already in planet mode, cancelling zoom to:', projectKey);
            return; // Already zoomed
        }
        
        console.log('Starting zoom to planet:', projectKey);
        
        // Find the target object
        let targetObject = null;
        let targetPosition = new THREE.Vector3();
        
        if (projectKey === 'sun') {
            targetObject = this.sun;
            targetPosition.copy(this.sun.position);
        } else {
            const planet = this.planets.find(p => p.name === projectKey);
            if (!planet) return;
            targetObject = planet.mesh;
            
            // Get world position for orbiting planets
            if (planet.group) {
                planet.mesh.getWorldPosition(targetPosition);
            } else {
                targetPosition.copy(planet.mesh.position);
            }
        }
        
        // Set up camera transition
        this.cameraTransition.startPosition.copy(this.camera.position);
        this.cameraTransition.startLookAt.copy(new THREE.Vector3(0, 0, 0)); // Current center
        
        // Calculate target camera position (offset from object)
        const offset = new THREE.Vector3(5, 3, 5);
        this.cameraTransition.targetPosition.copy(targetPosition).add(offset);
        this.cameraTransition.targetLookAt.copy(targetPosition);
        
        // Start transition
        this.cameraTransition.active = true;
        this.cameraTransition.progress = 0;
        this.cameraState = 'planet';
        this.selectedPlanet = { key: projectKey, object: targetObject, position: targetPosition };
        
        // Show project modal
        this.showProjectModal(projectKey);
    }
    
    zoomToOverview() {
        if (this.cameraState === 'overview') return; // Already in overview
        
        console.log('Returning to overview');
        
        // Set up transition back to overview
        this.cameraTransition.startPosition.copy(this.camera.position);
        this.cameraTransition.startLookAt.copy(this.selectedPlanet ? this.selectedPlanet.position : new THREE.Vector3(0, 0, 0));
        
        // Target is the original overview position
        this.cameraTransition.targetPosition.set(0, 25, 60);
        this.cameraTransition.targetLookAt.set(0, 0, 0);
        
        // Start transition
        this.cameraTransition.active = true;
        this.cameraTransition.progress = 0;
        this.cameraState = 'overview';
        this.selectedPlanet = null;
        
        // Hide modal
        document.getElementById('project-modal').style.display = 'none';
    }

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
                // Allow dragging in overview mode and when not transitioning
                if (self.cameraState === 'overview' && !self.cameraTransition.active) {
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
            // Allow zooming in overview mode and when not transitioning
            if (self.cameraState === 'overview' && !self.cameraTransition.active) {
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