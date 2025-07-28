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
        
        // Camera state management for planet zoom and welcome screen
        this.cameraState = 'welcome'; // 'welcome', 'overview' or 'planet'
        this.selectedPlanet = null;
        this.pendingProjectKey = null; // Stores project key until zoom completes
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
                title: "Contact Me - Let's Connect!",
                description: "Thank you for exploring my solar system portfolio! I'm always excited to discuss new opportunities, collaborate on innovative projects, or simply connect with fellow developers and tech enthusiasts. Whether you're interested in full-stack development, AI integration, mobile applications, or cutting-edge web technologies, I'd love to hear from you. Feel free to reach out through any of the channels below - I typically respond within 24 hours and am always open to interesting conversations about technology, software engineering, and creative problem-solving.",
                features: [
                    "📧 Email: benny.yang@gauntletai.com",
                    "💼 LinkedIn: Connect with me professionally",
                    "💻 GitHub: Explore my code and contributions",
                    "🚀 Open to new opportunities and collaborations",
                    "☕ Always happy to chat about technology and innovation"
                ],
                tech: ["Full-Stack Development", "AI Integration", "Mobile Apps", "Web Technologies", "Open Source"],
                link: "https://github.com/bennyyang11",
                demo: "https://www.linkedin.com/in/byangln/"
            },
            mercury: {
                title: "Sorting Visualizer",
                description: "This project is an interactive sorting visualizer that demonstrates how various sorting algorithms work in real-time. Users can choose from algorithms like Bubble Sort, Merge Sort, Quick Sort, Insertion Sort, and Selection Sort to observe how data is sorted step-by-step. It also allows users to customize the number of items being sorted and the speed of the animation, providing a hands-on, visual learning experience for understanding algorithm efficiency and behavior. The visualizer was built using JavaScript and React, utilizing state and animation hooks to control bar height, algorithm logic, and playback controls. This project helped strengthen my understanding of sorting algorithms, algorithmic complexity, and front-end UI interaction using component-based design.",
                image: "images/projects/Sorting_Visualizer.png",
                features: [
                    "Interactive visualization of 5+ sorting algorithms",
                    "Real-time step-by-step algorithm demonstration",
                    "Customizable array size and animation speed",
                    "Visual comparison of algorithm efficiency",
                    "Educational tool for understanding algorithmic complexity"
                ],
                tech: ["JavaScript", "React", "CSS3", "Algorithms", "Data Structures"],
                link: "https://github.com/bennyyang11/Sorting-Visualizer.git"
            },
            venus: {
                title: "Product Management API",
                description: "This API serves as a backend system for managing product data in applications such as e-commerce platforms or inventory tracking systems. It allows clients to create, read, update, and delete (CRUD) product entries efficiently, making it an essential tool for any service that needs to handle dynamic product information. Built with Node.js and Express, the API uses MongoDB as the database to store and query product data. It includes endpoints for managing product attributes such as name, category, price, stock quantity, and more. The backend features optimized query performance, robust error handling, and a clean RESTful architecture to ensure scalability and seamless integration with frontend or third-party systems.",
                image: "images/projects/CRUD.png",
                features: [
                    "Complete CRUD operations for product management",
                    "RESTful API architecture with Express.js",
                    "MongoDB database with optimized queries",
                    "Robust error handling and validation",
                    "Scalable backend for e-commerce platforms"
                ],
                tech: ["Node.js", "Express", "MongoDB", "REST API", "JavaScript"],
                link: "https://github.com/bennyyang11/CRUD-App.git"
            },
            earth: {
                title: "Hamster Hunters - Multiplayer 3D FPS",
                description: "An ambitious and hilariously creative multiplayer 3D first-person shooter that combines the intensity of Call of Duty with adorable hamsters! This browser-based game features real-time multiplayer combat with Socket.io, complete character class systems, and multiple game modes. Players can choose from unique hamster characters like 'Hammy Ali' and 'Ham Solo', each with distinct abilities and playstyles. The game includes sophisticated weapon mechanics, multiple combat scenarios, and supports 8-12 concurrent players with optimized performance targeting 60 FPS and sub-50ms latency. Built entirely with Three.js and JavaScript, this project showcases advanced 3D web development, real-time networking, and game design principles while maintaining a fun and engaging theme that makes competitive gaming accessible and enjoyable.",
                image: "images/projects/Hamster_Hunters.png",
                features: [
                    "Real-time multiplayer 3D FPS with Socket.io networking",
                    "Unique hamster character classes and specialized abilities",
                    "Multiple game modes: Team Deathmatch, Battle Royale, Gun Game",
                    "Advanced weapon systems and combat mechanics",
                    "Optimized performance: 60 FPS with 8-12 player support"
                ],
                tech: ["Three.js", "JavaScript", "Socket.io", "WebGL", "Node.js"],
                link: "https://github.com/bennyyang11/Hamster-Hunters.git",
                demo: "https://hamster-hunter-production.up.railway.app"
            },
            mars: {
                title: "WordWiseAI - AI-Powered Writing Assistant",
                description: "An intelligent writing companion that leverages OpenAI's advanced language models to transform how people write and communicate. This comprehensive platform provides real-time AI-powered writing suggestions, goal-based feedback systems, and interactive vocabulary enhancement tools. Built with modern TypeScript and React, WordWiseAI offers personalized writing improvement through sophisticated AI analysis that adapts to individual writing styles and objectives. The application features dynamic content analysis, contextual suggestions, and progressive learning modules that help users develop stronger writing skills over time. Whether for academic writing, professional communication, or creative expression, WordWiseAI serves as an intelligent writing mentor that provides actionable insights and improvements.",
                image: "images/projects/WordWiseAI.png",
                features: [
                    "Real-time AI writing suggestions and grammar corrections",
                    "Goal-based feedback system for targeted improvement",
                    "Interactive vocabulary testing and enhancement tools",
                    "Personalized writing analytics and progress tracking",
                    "OpenAI integration for advanced language processing"
                ],
                tech: ["TypeScript", "React", "OpenAI API", "Vite", "Tailwind CSS"],
                link: "https://github.com/bennyyang11/WordWiseAi",
                demo: "https://word-wise-ai-uv39.vercel.app"
            },
            jupiter: {
                title: "FlowGenius - AI-Enhanced File Manager",
                description: "A revolutionary desktop application that transforms file management through artificial intelligence. Built with Electron, LangGraph, and N8N, FlowGenius automatically analyzes, classifies, and organizes files using advanced AI workflows. The application combines real-time file monitoring with sophisticated content understanding, generating intelligent tags and suggesting optimal folder structures. With its modern React interface featuring multi-tab navigation, users can browse files, view detailed AI analysis, monitor background processing, and configure automation settings. FlowGenius represents the future of intelligent file management, where files organize themselves based on content understanding rather than manual sorting. The system processes documents, code files, media, and archives with confidence scoring, ensuring reliable automation while maintaining user control over all organizational decisions.",
                image: "images/projects/FlowGenius.png",
                features: [
                    "AI-powered file classification and content analysis",
                    "Real-time directory monitoring and automated organization",
                    "LangGraph integration for sophisticated AI workflows",
                    "Modern Electron desktop app with React interface",
                    "N8N compatibility for visual workflow automation"
                ],
                tech: ["Electron", "LangGraph", "N8N", "OpenAI API", "React", "JavaScript"],
                link: "https://github.com/bennyyang11/FlowGenius"
            },
            saturn: {
                title: "Polisee - AI-Powered Political Engagement Platform",
                description: "A groundbreaking open-source platform that democratizes political engagement through AI-powered bill analysis and personalized impact assessment. Originally developed as a collaborative group project, Polisee has evolved into a comprehensive civic technology solution that bridges the gap between complex legislation and citizen understanding. The platform leverages advanced AI workflows to analyze congressional bills, generate personalized impact reports based on user demographics, and provide verifiable source citations. Built with modern full-stack architecture featuring Next.js 15, TypeScript, and Supabase, Polisee integrates multiple APIs including Congress.gov for legislative data and OpenAI for intelligent analysis. The system includes sophisticated features like multi-step persona creation, advanced PDF viewing with text highlighting, sentiment feedback mechanisms, and real-time analytics, all designed to empower citizens with accessible, accurate political information.",
                image: "images/projects/Polisee.png",
                features: [
                    "AI-powered personalized bill analysis with OpenAI integration",
                    "Multi-step persona creation for demographic profiling",
                    "Advanced PDF viewer with text highlighting and citations",
                    "Congress.gov API integration for real-time legislative data",
                    "Sentiment feedback system and real-time analytics dashboard"
                ],
                tech: ["Next.js 15", "TypeScript", "Supabase", "OpenAI API", "PostgreSQL", "Python"],
                link: "https://github.com/PoliseeAI/polisee",
                demo: "https://poliseeai.com"
            },
            uranus: {
                title: "SnapConnect - AI-Powered Fitness Content Creator",
                description: "A revolutionary mobile fitness application that transforms content creation through advanced AI integration and personalized engagement. Built with React Native and Expo, SnapConnect leverages multiple AI models including DALL-E 3, DALL-E 2, and Stable Diffusion XL to generate intelligent fitness content. The app features sophisticated RAG (Retrieval-Augmented Generation) implementation that creates personalized workout captions, motivational content, and AI-generated stickers tailored to individual fitness journeys. With Firebase backend integration, Zustand state management, and professional mobile architecture, SnapConnect targets fitness influencers and content creators seeking to enhance their social media presence. The application includes advanced prompt engineering, automatic background removal for AI stickers, context-aware content generation, and smart workout planning features, representing the cutting edge of mobile AI development in the fitness industry.",
                image: "images/projects/SnapConnect.png",
                features: [
                    "Multiple AI model integration (DALL-E 3, DALL-E 2, Stable Diffusion XL)",
                    "RAG implementation for personalized fitness content generation",
                    "Advanced AI sticker creation with automatic background removal",
                    "React Native/Expo mobile app with TypeScript architecture",
                    "Firebase backend and intelligent workout planning features"
                ],
                tech: ["React Native", "Expo", "TypeScript", "OpenAI API", "Firebase", "Zustand"],
                link: "https://github.com/bennyyang11/SnapConnect"
            },
            neptune: {
                title: "RISC-V Processor - 5-Stage Pipelined CPU",
                description: "A comprehensive implementation of a 5-stage pipelined RISC-V processor built from scratch using Verilog, demonstrating deep understanding of computer architecture and hardware design principles. This project simulates how modern CPUs efficiently handle multiple instructions concurrently through instruction fetch, decode, execute, memory access, and write-back stages. The processor includes sophisticated features such as hazard detection mechanisms, data forwarding pathways, and advanced control logic to manage pipeline stalls while maintaining correct execution order. Built with a custom instruction set and rigorously tested through comprehensive verification, this hands-on implementation showcases mastery of CPU design fundamentals, timing constraints, and hardware debugging methodologies. The project represents the intersection of theoretical computer architecture knowledge and practical hardware implementation skills.",
                image: "images/projects/RiscV.png",
                features: [
                    "5-stage pipelined architecture (Fetch, Decode, Execute, Memory, Writeback)",
                    "Hazard detection and data forwarding for pipeline optimization",
                    "Custom instruction set implementation and verification",
                    "Advanced control logic for pipeline stall management",
                    "Built from scratch using Verilog with comprehensive testing"
                ],
                tech: ["Verilog", "RISC-V ISA", "Digital Logic Design", "Hardware Simulation", "CPU Architecture"],
                link: "https://github.com/bennyyang11/risc-v-processor"
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
        // Start camera very far away for welcome screen
        this.camera.position.set(0, 80, 200); // Much further out for welcome view
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        
        // Get accurate viewport size
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Setup renderer
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Make canvas responsive using viewport units
        canvas.style.cssText = `
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1 !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            outline: none !important;
        `;
        
        // Set canvas buffer size
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        
        console.log('Renderer created - Viewport:', width, 'x', height, 'DPR:', window.devicePixelRatio);
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
        this.createPlanet('mercury', 25, 0xff6b47, 8, 'models/Mercury.glb', 0);
        this.createPlanet('venus', 0.02, 0xffc649, 12, 'models/Venus.glb', Math.PI * 0.3);
        this.createPlanet('earth', 0.06, 0x6b93d6, 16, 'models/Earth-2.glb', Math.PI * 0.6);
        this.createPlanet('mars', 1.33, 0xff4500, 20, null, Math.PI * 0.9); // Red sphere - Mars models have compatibility issues
        this.createPlanet('jupiter', 0.25, 0xd8ca9d, 26, 'models/Jupiter.glb', Math.PI * 1.2);
        this.createPlanet('saturn', 2.5, 0xfad5a5, 32, 'models/Saturn.glb', Math.PI * 1.5);
        this.createPlanet('uranus', 2.5, 0x4fd0e7, 38, 'models/Uranus.glb', Math.PI * 1.8);
        this.createPlanet('neptune', 2.5, 0x4169E1, 44, 'models/Neptune.glb', Math.PI * 0.1);
        
        // Moon removed for now
    }

    createSun() {
        console.log('Loading Sun model...');
        // Load 3D Sun model
        this.loader.load('models/Sun.glb', (gltf) => {
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
                planet.position.y = -0.8; // Move down to align with orbital plane (GLB models often have offset geometry)
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
                fallbackPlanet.position.y = -0.4; // Slight adjustment for fallback spheres
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
            planet.position.y = 0; // Regular spheres are usually centered correctly
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
            
            // Create invisible larger hitbox for easier clicking (sphere version)
            let hitboxSize = 1.0; // Default hitbox for most planets
            
            // Special handling for Mercury's massive scale (25x)
            if (name.toLowerCase() === 'mercury') {
                hitboxSize = 0.15; // Extra small hitbox for Mercury
            }
            
            const hitboxGeometry = new THREE.SphereGeometry(hitboxSize, 16, 16);
            const hitboxMaterial = new THREE.MeshBasicMaterial({ 
                transparent: true, 
                opacity: 0,
                visible: false
            });
            const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
            hitbox.userData = { type: 'hitbox', planetName: name };
            planet.add(hitbox);
            
            planetGroup.add(planet);
            
            // Store planet data with better speed calculation
            this.planets.push({
                group: planetGroup,
                mesh: planet,
                hitbox: hitbox,
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
        
        // Window and screen resize handling
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Handle orientation change (mobile devices)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.onWindowResize();
            }, 100);
        });
        
        // Handle screen/display changes (moving between monitors)
        if (screen && screen.addEventListener) {
            screen.addEventListener('change', this.onWindowResize.bind(this));
        }
        
        // Handle visibility changes (tab switching, window focus)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    this.onWindowResize();
                }, 50);
            }
        });
        
        // Force initial resize and periodic checks
        setTimeout(() => {
            console.log('Triggering initial resize check...');
            this.onWindowResize();
        }, 100);
        
        // Periodic resize check for display changes
        setInterval(() => {
            const canvas = document.getElementById('three-canvas');
            if (canvas && (canvas.offsetWidth !== window.innerWidth || canvas.offsetHeight !== window.innerHeight)) {
                console.log('Display size mismatch detected, triggering resize...');
                this.onWindowResize();
            }
        }, 1000);
        
        // Keyboard controls
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        
        console.log('Event listeners set up successfully');
    }

    setupUI() {
        // Set up welcome screen functionality
        this.setupWelcomeScreen();
        
        // Set up overlay close button
        const closeBtn = document.getElementById('close-overlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideProjectOverlay();
            });
        }
        
        // Add escape key listener for returning to overview
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cameraState === 'planet') {
                this.hideProjectOverlay();
            }
        });
        
        console.log('Overlay UI setup complete');
    }

    setupWelcomeScreen() {
        // Hide camera controls and instructions initially
        this.toggleUIElements(false);
        
        // Continue button to go from Welcome to About
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.showAboutScreen();
            });
        }

        // Enter Portfolio button to go from About to Solar System
        const enterPortfolioBtn = document.getElementById('enter-portfolio-btn');
        if (enterPortfolioBtn) {
            enterPortfolioBtn.addEventListener('click', () => {
                this.enterPortfolio();
            });
        }

        // Back button to go from About back to Welcome
        const backBtn = document.getElementById('back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBackToWelcome();
            });
        }

        // Solar system back button to go from Solar System back to About
        const solarBackBtn = document.getElementById('solar-back-button');
        if (solarBackBtn) {
            solarBackBtn.addEventListener('click', () => {
                this.goBackToAbout();
            });
        }
    }

    showAboutScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const aboutScreen = document.getElementById('about-screen');
        
        // Hide welcome screen
        welcomeScreen.classList.add('hidden');
        
        // Show about screen after a short delay
        setTimeout(() => {
            aboutScreen.classList.add('show');
        }, 300);
    }

    goBackToWelcome() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const aboutScreen = document.getElementById('about-screen');
        
        // Hide about screen
        aboutScreen.classList.remove('show');
        aboutScreen.classList.add('hidden');
        
        // Show welcome screen after a short delay
        setTimeout(() => {
            welcomeScreen.classList.remove('hidden');
        }, 300);
    }

    goBackToAbout() {
        console.log('Going back to About page...');
        
        // Hide UI elements
        this.toggleUIElements(false);
        
        // Hide back button when returning to about page
        this.hideBackButton();
        
        // Show about screen
        const aboutScreen = document.getElementById('about-screen');
        if (aboutScreen) {
            aboutScreen.classList.remove('hidden');
            aboutScreen.classList.add('show');
        }
        
        // Change camera state back to welcome (which will hide solar system interactions)
        this.cameraState = 'welcome';
        
        // Zoom camera back out to welcome view
        this.cameraTransition.active = true;
        this.cameraTransition.progress = 0;
        this.cameraTransition.duration = 2.0;
        
        this.cameraTransition.startPosition.copy(this.camera.position);
        this.cameraTransition.targetPosition.set(0, 80, 200);
        
        this.cameraTransition.startLookAt.copy(this.controls.target);
        this.cameraTransition.targetLookAt.set(0, 0, 0);
    }

    toggleUIElements(show) {
        const elementsToToggle = [
            '.camera-instructions',
            '.instructions',
            '.header'
        ];
        
        elementsToToggle.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = show ? 'block' : 'none';
            }
        });
    }

    enterPortfolio() {
        console.log('Entering portfolio...');
        
        // Hide welcome and about screens
        const welcomeScreen = document.getElementById('welcome-screen');
        const aboutScreen = document.getElementById('about-screen');
        
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
        if (aboutScreen) {
            aboutScreen.classList.remove('show');
            aboutScreen.classList.add('hidden');
        }
        
        // Show UI elements
        this.toggleUIElements(true);
        
        // Show back button in solar system view
        this.showBackButton();
        
        // Change camera state and zoom to solar system
        this.cameraState = 'overview';
        this.zoomToSolarSystem();
    }

    zoomToSolarSystem() {
        // Animate camera to solar system view
        this.cameraTransition.active = true;
        this.cameraTransition.progress = 0;
        this.cameraTransition.duration = 3.0;
        
        // Current position (welcome view)
        this.cameraTransition.startPosition.copy(this.camera.position);
        this.cameraTransition.startLookAt.copy(this.camera.position).add(
            new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion)
        );
        
        // Target position (solar system view)
        this.cameraTransition.targetPosition.set(0, 25, 60);
        this.cameraTransition.targetLookAt.set(0, 0, 0);
        
        console.log('Zooming to solar system view...');
    }

    onMouseClick(event) {
        const self = this; // Store reference for nested functions
        console.log('Mouse click detected!', event.clientX, event.clientY);
        
        // Don't handle planet clicks during welcome screen
        if (this.cameraState === 'welcome') {
            return;
        }
        
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
        // Get accurate viewport dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        console.log('Resizing to:', width, 'x', height);
        
        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
        
        // Force canvas to match viewport exactly
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            // Remove any existing styles first
            canvas.style.cssText = '';
            
            // Apply new responsive styles
            canvas.style.cssText = `
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                z-index: 1 !important;
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
            `;
            
            // Set canvas buffer size to match display size
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            
            // Force immediate redraw
            this.renderer.setViewport(0, 0, width, height);
        }
        
        console.log('Resize complete - Canvas:', width, 'x', height, 'DPR:', window.devicePixelRatio);
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

    showProjectOverlay(projectKey) {
        const project = this.projectData[projectKey];
        if (!project) return;

        console.log('Showing overlay for:', projectKey);
        
        // Update planet badge
        const planetBadgeElement = document.getElementById('overlay-planet-badge');
        if (planetBadgeElement) {
            planetBadgeElement.textContent = projectKey.toUpperCase();
        }
        
        // Update project title
        document.getElementById('overlay-title').textContent = project.title;
        
        // Update project image
        const imageElement = document.getElementById('overlay-image');
        const imageSection = document.querySelector('.project-image-section');
        
        if (imageElement && project.image) {
            console.log('Setting image src to:', project.image);
            imageElement.src = project.image;
            imageElement.alt = `${project.title} Screenshot`;
            imageElement.style.cursor = 'pointer'; // Show it's clickable
            
            // Show image section
            if (imageSection) {
                imageSection.style.display = 'block';
            }
            
            // Add click handler to open larger version
            imageElement.onclick = () => {
                const lightbox = document.createElement('div');
                lightbox.className = 'image-lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <span class="lightbox-close">&times;</span>
                        <img src="${project.image}" alt="${project.title} - Full Size" class="lightbox-image">
                        <div class="lightbox-caption">${project.title}</div>
                    </div>
                `;
                
                // Add to page
                document.body.appendChild(lightbox);
                
                // Close on click outside or close button
                lightbox.onclick = (e) => {
                    if (e.target === lightbox || e.target.className === 'lightbox-close') {
                        document.body.removeChild(lightbox);
                    }
                };
                
                // Close on escape key
                const escHandler = (e) => {
                    if (e.key === 'Escape') {
                        document.body.removeChild(lightbox);
                        document.removeEventListener('keydown', escHandler);
                    }
                };
                document.addEventListener('keydown', escHandler);
            };
            
            // Add load success handler
            imageElement.onload = () => {
                console.log('Image loaded successfully:', project.image);
            };
            
            // Fallback to placeholder if image fails to load
            imageElement.onerror = () => {
                console.error('Failed to load image:', project.image);
                imageElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzg3Q0VFQiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
            };
        } else {
            // Hide the entire image section when no image is provided (e.g., for contact page)
            if (imageSection) {
                imageSection.style.display = 'none';
            }
        }
        
        // Update description
        document.getElementById('overlay-description').textContent = project.description;
        
        // Update features list
        const featuresElement = document.getElementById('overlay-features');
        if (project.features && featuresElement) {
            if (projectKey === 'sun') {
                // Special handling for contact page - make email clickable
                featuresElement.innerHTML = project.features.map(feature => {
                    if (feature.includes('benny.yang@gauntletai.com')) {
                        return `<li>📧 Email: <a href="mailto:benny.yang@gauntletai.com" style="color: #87CEEB; text-decoration: underline;">benny.yang@gauntletai.com</a></li>`;
                    }
                    return `<li>${feature}</li>`;
                }).join('');
            } else {
                featuresElement.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
            }
        }
        
        // Update tech stack
        const techElement = document.getElementById('overlay-tech');
        if (project.tech && techElement) {
            techElement.innerHTML = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
        }
        
        // Update GitHub link
        const linkElement = document.getElementById('overlay-link');
        if (project.link && linkElement) {
            linkElement.href = project.link;
            linkElement.style.display = 'flex';
            
            // Update button text based on project type
            const linkText = linkElement.querySelector('span');
            if (linkText) {
                if (projectKey === 'sun') {
                    linkText.textContent = '💻 GitHub Profile';
                } else {
                    linkText.textContent = '🔗 View Code';
                }
            }
        } else if (linkElement) {
            linkElement.style.display = 'none';
        }
        
        // Update demo link
        const demoElement = document.getElementById('overlay-demo');
        if (project.demo && demoElement) {
            demoElement.href = project.demo;
            demoElement.style.display = 'flex';
            
            // Update button text based on project type
            const demoText = demoElement.querySelector('span');
            if (demoText) {
                if (projectKey === 'sun') {
                    demoText.textContent = '💼 LinkedIn Profile';
                } else {
                    demoText.textContent = '🚀 Live Demo';
                }
            }
        } else if (demoElement) {
            demoElement.style.display = 'none';
        }
        
        // Show overlay with slide animation
        const overlay = document.getElementById('project-overlay');
        overlay.classList.add('show');
        
        // Set up close button
        const closeBtn = document.getElementById('close-overlay');
        if (closeBtn) {
            closeBtn.onclick = () => this.hideProjectOverlay();
        }
    }

    hideProjectOverlay() {
        const overlay = document.getElementById('project-overlay');
        overlay.classList.remove('show');
        
        // Return to overview
        this.zoomToOverview();
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
                
                // Show project overlay if we just zoomed to a planet (with small delay for smoothness)
                if (this.pendingProjectKey && this.cameraState === 'planet') {
                    console.log('Showing overlay after zoom completion:', this.pendingProjectKey);
                    const projectKey = this.pendingProjectKey;
                    this.pendingProjectKey = null; // Clear the pending key
                    
                    // Small delay for smoother experience
                    setTimeout(() => {
                        this.showProjectOverlay(projectKey);
                    }, 300);
                }
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
        if (this.cameraState === 'planet' && !this.cameraTransition.active) {
            console.log('Already in planet mode, cancelling zoom to:', projectKey);
            return; // Already zoomed and not transitioning
        }
        
        console.log('Starting zoom to planet:', projectKey, '- Overlay will appear when zoom completes!');
        
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
        
        // Store project key for when transition completes
        this.pendingProjectKey = projectKey;
        
        // Hide back button during project view
        this.hideBackButton();
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
        this.pendingProjectKey = null; // Clear any pending project
        
        // Hide overlay
        const overlay = document.getElementById('project-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        // Show back button when returning to overview
        this.showBackButton();
    }

    hideBackButton() {
        const backButton = document.getElementById('solar-back-button');
        if (backButton) {
            backButton.style.display = 'none';
        }
    }

    showBackButton() {
        const backButton = document.getElementById('solar-back-button');
        if (backButton) {
            backButton.style.display = 'block';
        }
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