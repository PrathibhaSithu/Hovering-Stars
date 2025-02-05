import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MotionPettles() {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        camera.position.z = 10;

        // Function to create a smooth flower shape
        function createFlowerShape() {
            const shape = new THREE.Shape();
            const petalCount = 6;
            const petalLength = 1.2;
            const petalWidth = 0.6;

            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2;
                const x = Math.cos(angle) * petalWidth;
                const y = Math.sin(angle) * petalLength;

                if (i === 0) {
                    shape.moveTo(x, y);
                } else {
                    shape.bezierCurveTo(
                        x * 1.2, y * 1.2, // Control point 1
                        x * 0.8, y * 0.8, // Control point 2
                        x, y              // End point
                    );
                }
            }

            shape.closePath();
            return shape;
        }

        const flowerGeometry = new THREE.ExtrudeGeometry(createFlowerShape(), { depth: 0.1, bevelEnabled: true, bevelSize: 0.05 });
        
        // Function to generate random flower colors
        function getRandomColor() {
            const colors = [0xff69b4, 0xffc0cb, 0xff4500, 0xff1493, 0xff6347];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        const flowerCount = 500; // Adjusted for better performance
        const flowerField = new THREE.Group();

        for (let i = 0; i < flowerCount; i++) {
            const flowerMaterial = new THREE.MeshBasicMaterial({ color: getRandomColor(), side: THREE.DoubleSide });
            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);

            flower.position.x = (Math.random() - 0.5) * 100;
            flower.position.y = (Math.random() - 0.5) * 100;
            flower.position.z = (Math.random() - 0.5) * 100;

            flower.rotation.z = Math.random() * Math.PI * 2; // Random rotation
            flower.scale.setScalar(Math.random() * 0.5 + 0.5); // Random size variation

            flowerField.add(flower);
        }

        scene.add(flowerField);

        const handleMouseMove = (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            flowerField.rotation.x += mouseY * 0.01;
            flowerField.rotation.y += mouseX * 0.01;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        const animate = () => {
            requestAnimationFrame(animate);
            flowerField.rotation.y += 0.001;
            flowerField.rotation.x += 0.001;
            renderer.render(scene, camera);
        };

        animate();

    }, []);

    return (
        <div
            ref={mountRef}
            className='fixed inset-0 -z-1 w-full h-full'
        />
    );
}
