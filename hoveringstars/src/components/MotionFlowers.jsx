import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import flower1 from '../assets/flower.png';
import flower2 from '../assets/flower2.png';
import flower3 from '../assets/flower3.png';
import daisy from '../assets/daisy.png';
import rose from '../assets/rose.png';

export default function MotionFlowers() {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        camera.position.z = 20;

        // Array of flower textures
        const flowerTextures = [
            new THREE.TextureLoader().load(flower1),
            new THREE.TextureLoader().load(flower2),
            new THREE.TextureLoader().load(flower3),
            new THREE.TextureLoader().load(daisy),
            new THREE.TextureLoader().load(rose),
        ];

        const flowerCount = 100; // Number of flowers
        const flowers = [];
        for (let i = 0; i < flowerCount; i++) {
            const material = new THREE.SpriteMaterial({
                map: flowerTextures[Math.floor(Math.random() * flowerTextures.length)],
                transparent: true,
            });
            const flower = new THREE.Sprite(material);
            flower.scale.setScalar(Math.random() * 0.3 + 0.1); // Random size between 0.1 and 0.4
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

        // Cleanup on component unmount
        return () => {
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