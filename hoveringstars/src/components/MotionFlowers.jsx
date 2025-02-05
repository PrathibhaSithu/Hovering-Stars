import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MotionFlowers() {
    const mountRef = useRef(null);

    useEffect(() => {
        // Scene, Camera, Renderer Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Camera Position
        camera.position.z = 5;

        // Create Flower Rain (Particles)
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Random X, Y, Z positions
            positions[i * 3] = (Math.random() - 0.5) * 100; // X
            positions[i * 3 + 1] = Math.random() * 100 - 100; // Y (start above the screen)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // Z
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
        });

        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        // Mouse Interaction
        const mouse = new THREE.Vector2(-10, -10); // Mouse position
        const isMouseMoving = { value: false }; // Track if the mouse is moving

        const handleMouseMove = (event) => {
            // Normalize mouse coordinates to [-1, 1]
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            isMouseMoving.value = true;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Handle Window Resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update Particle Positions (Flower Rain Effect)
            const positionsArray = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positionsArray[i * 3 + 1] -= 0.1; // Move particles downward

                // Reset particle position when it goes below the screen
                if (positionsArray[i * 3 + 1] < -100) {
                    positionsArray[i * 3 + 1] = 100; // Reset to top
                }

                // Circular Rotation Around Mouse
                if (isMouseMoving.value) {
                    const dx = positionsArray[i * 3] - mouse.x * 50; // Distance from mouse X
                    const dy = positionsArray[i * 3 + 1] - mouse.y * 50; // Distance from mouse Y
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 10) { // Only affect particles near the mouse
                        const angle = Math.atan2(dy, dx) + 0.05; // Add rotation
                        positionsArray[i * 3] = mouse.x * 50 + Math.cos(angle) * distance;
                        positionsArray[i * 3 + 1] = mouse.y * 50 + Math.sin(angle) * distance;
                    }
                }
            }

            // Mark positions as needing update
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // Render the Scene
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup on Component Unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className='fixed inset-0 -z-1 w-full h-full'
        />
    );
}