import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EcoBadge3DProps {
  className?: string;
}

export const EcoBadge3D: React.FC<EcoBadge3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Faceted Eco Crystal Gem
    const gemGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x163d2b,
      emissive: 0x091c13,
      roughness: 0.1,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.7,
      ior: 1.5,
      transparent: true,
      opacity: 0.95
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    group.add(gem);

    // Inner Glowing Core
    const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd9f36a,
      wireframe: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Shimmering Golden Orbital Rings
    const ringGeo = new THREE.TorusGeometry(1.75, 0.03, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xdca647,
      roughness: 0.2,
      metalness: 0.85
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);
    const light = new THREE.PointLight(0xd9f36a, 3.5, 8);
    light.position.set(2, 3, 2);
    scene.add(light);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.6;
      targetY = ny * 0.4;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      gem.rotation.y = t * 0.6 + mouseX;
      gem.rotation.x = t * 0.3 + mouseY;
      core.rotation.y = -t * 0.9;
      core.rotation.z = t * 0.5;

      ring1.rotation.z = t * 0.4;
      ring2.rotation.z = -t * 0.35;

      group.position.y = Math.sin(t * 1.8) * 0.12;

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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gemGeo.dispose();
      gemMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-44 h-44 sm:w-56 sm:h-56 cursor-pointer select-none ${className}`}
      title="3D Zero-Waste Eco Crystal"
    />
  );
};
