import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RescueGlobe3DProps {
  className?: string;
}

export const RescueGlobe3D: React.FC<RescueGlobe3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x163d2b,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(innerSphere);

    // 2. Outer particle cloud globe
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 1.7;

      posArray[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      posArray[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      posArray[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // 3. Planetary Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.025, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    globeGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.018, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x2d6a4f,
      transparent: true,
      opacity: 0.5
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 4;
    globeGroup.add(ring2);

    // 4. Floating Hub Nodes (representing rescued meal hubs)
    const hubGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const hubMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hubs: THREE.Mesh[] = [];

    const hubAngles = [
      [0.4, 0.8],
      [-0.6, 1.2],
      [1.1, -0.5],
      [-1.2, -0.8],
      [0.2, -1.4]
    ];

    hubAngles.forEach(([phi, theta]) => {
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.set(
        1.72 * Math.cos(theta) * Math.sin(phi),
        1.72 * Math.sin(theta) * Math.sin(phi),
        1.72 * Math.cos(phi)
      );
      globeGroup.add(hub);
      hubs.push(hub);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      globeGroup.rotation.y = elapsed * 0.2 + mouseX;
      globeGroup.rotation.x = 0.2 + mouseY;

      ring1.rotation.z = elapsed * 0.3;
      ring2.rotation.z = -elapsed * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Interactive 3D Eco Globe: Move cursor to inspect rescue points"
    />
  );
};
