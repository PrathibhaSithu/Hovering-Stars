import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MotionFlowers() {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        camera.position.z = 10;

        // Array of flower image paths
        const flowerTextures = [
            new THREE.TextureLoader().load('../assets/flower.png'),
            new THREE.TextureLoader().load('../assets/flower2.png'),
            new THREE.TextureLoader().load('../assets/flower3.png'),
            new THREE.TextureLoader().load('../assets/daisy.png'),
            new THREE.TextureLoader().load('../assets/rose.png'),
        ];

        const flowerCount = 100; // Number of flowers
        const flowers = [];

        for (let i = 0; i < flowerCount; i++) {
            const material = new THREE.SpriteMaterial({
                map: flowerTextures[Math.floor(Math.random() * flowerTextures.length)],
                transparent: true,
            });

            const flower = new THREE.Sprite(material);
            flower.scale.setScalar(Math.random() * 1.5 + 0.5); // Random size

            // Random starting position above the screen
            flower.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 15 + 5, // Start above the screen
                (Math.random() - 0.5) * 20
            );

            flower.userData = {
                velocity: Math.random() * 0.05 + 0.02, // Fall speed
                rotationSpeed: (Math.random() - 0.5) * 0.02, // Random rotation speed
            };

            scene.add(flower);
            flowers.push(flower);
        }

        // Handle window resizing
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // Animate falling flowers
        const animate = () => {
            requestAnimationFrame(animate);

            flowers.forEach(flower => {
                flower.position.y -= flower.userData.velocity; // Falling motion
                flower.rotation.z += flower.userData.rotationSpeed; // Rotation effect

                // Reset position when flower falls off screen
                if (flower.position.y < -10) {
                    flower.position.y = Math.random() * 10 + 5;
                    flower.position.x = (Math.random() - 0.5) * 20;
                    flower.position.z = (Math.random() - 0.5) * 20;
                }
            });

            renderer.render(scene, camera);
        };

        animate();
    }, []);

    return <div ref={mountRef} className="fixed inset-0 -z-1 w-full h-full" />;
}
