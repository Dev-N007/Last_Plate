import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AmbientHeroCanvas3DProps {
  className?: string;
}

export const AmbientHeroCanvas3D: React.FC<AmbientHeroCanvas3DProps> = ({ className = '' }) => {
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
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Particle Constellation of Eco Spores & Light Orbs
    const count = 75;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 12;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      speeds[i] = 0.4 + Math.random() * 0.8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Floating Geometric Rings in the background
    const ringGeo = new THREE.TorusGeometry(3.5, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x163d2b,
      transparent: true,
      opacity: 0.15
    });
    const backgroundRing1 = new THREE.Mesh(ringGeo, ringMat);
    backgroundRing1.position.set(-6, 2, -4);
    backgroundRing1.rotation.x = Math.PI / 3;
    scene.add(backgroundRing1);

    const backgroundRing2 = new THREE.Mesh(ringGeo, ringMat);
    backgroundRing2.position.set(7, -3, -6);
    backgroundRing2.rotation.y = Math.PI / 4;
    scene.add(backgroundRing2);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = nx * 1.5;
      targetY = ny * 1.0;
    };

    window.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.03;
      mouseY += (targetY - mouseY) * 0.03;

      points.rotation.y = t * 0.04 + mouseX * 0.1;
      points.rotation.x = t * 0.02 + mouseY * 0.1;

      backgroundRing1.rotation.z = t * 0.1;
      backgroundRing2.rotation.z = -t * 0.08;

      const posArray = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const idx = i * 3 + 1;
        posArray[idx] = basePositions[idx] + Math.sin(t * speeds[i] + i) * 0.6;
      }
      geo.attributes.position.needsUpdate = true;

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
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
