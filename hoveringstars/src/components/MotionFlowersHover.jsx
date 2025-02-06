import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import flower1 from '../assets/flower.png';
import flower2 from '../assets/flower2.png';
import flower3 from '../assets/flower3.png';
import daisy from '../assets/daisy.png';
import rose from '../assets/rose.png';

export default function MotionFlowersHover() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Append renderer only if mountRef is available
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        camera.position.z = 15;

        // Load flower textures
        const flowerTextures = [
            new THREE.TextureLoader().load(flower1),
            new THREE.TextureLoader().load(flower2),
            new THREE.TextureLoader().load(flower3),
            new THREE.TextureLoader().load(daisy),
            new THREE.TextureLoader().load(rose),
        ];

        const flowerCount = 100; // Reduce count for performance
        const flowers = [];

        for (let i = 0; i < flowerCount; i++) {
            const material = new THREE.SpriteMaterial({
                map: flowerTextures[Math.floor(Math.random() * flowerTextures.length)],
                transparent: true,
            });

            const flower = new THREE.Sprite(material);
            flower.scale.setScalar(Math.random() * 1 + 0.3); // Random size (0.3 to 1.3)

            // Random positions in 3D space
            flower.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );

            // Custom animation properties
            flower.userData = {
                velocity: Math.random() * 0.02 + 0.005, // Random floating speed
                rotationSpeed: (Math.random() - 0.5) * 0.005, // Random rotation
            };

            scene.add(flower);
            flowers.push(flower);
        }

        // Mouse movement effect
        const handleMouseMove = (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            flowers.forEach(flower => {
                flower.position.x += mouseX * 0.05;
                flower.position.y += mouseY * 0.05;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Handle resizing
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            flowers.forEach(flower => {
                flower.position.y -= flower.userData.velocity; // Move down
                flower.rotation.z += flower.userData.rotationSpeed; // Rotate

                // Reset when falling below screen
                if (flower.position.y < -30) {
                    flower.position.y = 30;
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.innerHTML = ''; // Proper cleanup
            }
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 -z-1 w-full h-full bg-[#ff5600]" />;
}
