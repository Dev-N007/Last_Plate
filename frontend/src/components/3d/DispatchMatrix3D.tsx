import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DispatchMatrix3DProps {
  className?: string;
}

export const DispatchMatrix3D: React.FC<DispatchMatrix3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const matrixGroup = new THREE.Group();
    scene.add(matrixGroup);

    // Central Autonomous AI Core Node
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd9f36a,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    matrixGroup.add(core);

    // Surrounding Node Points (Providers & Recipients)
    const nodeCount = 14;
    const nodes: THREE.Mesh[] = [];
    const nodeCoords: THREE.Vector3[] = [];

    const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const providerMat = new THREE.MeshBasicMaterial({ color: 0xd9f36a });
    const recipientMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.3 + Math.random() * 0.9;
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

      const node = new THREE.Mesh(nodeGeo, i % 2 === 0 ? providerMat : recipientMat);
      node.position.copy(pos);
      matrixGroup.add(node);
      nodes.push(node);
      nodeCoords.push(pos);
    }

    // Dynamic Connection Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.4
    });

    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    // Connect nodes to core and to each other
    nodeCoords.forEach((coord, idx) => {
      // Connect to core
      linePositions.push(0, 0, 0);
      linePositions.push(coord.x, coord.y, coord.z);

      // Connect to nearest neighbor
      const next = nodeCoords[(idx + 1) % nodeCoords.length];
      linePositions.push(coord.x, coord.y, coord.z);
      linePositions.push(next.x, next.y, next.z);
    });

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    matrixGroup.add(lines);

    // Ambient & Point Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xd9f36a, 2.0, 10);
    scene.add(pointLight);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.7;
      targetY = y * 0.7;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      matrixGroup.rotation.y = elapsed * 0.3 + mouseX;
      matrixGroup.rotation.x = elapsed * 0.15 + mouseY;

      core.rotation.x = elapsed * 0.6;
      core.rotation.y = elapsed * 0.8;
      const s = 1 + Math.sin(elapsed * 3) * 0.08;
      core.scale.set(s, s, s);

      lineMaterial.opacity = 0.35 + Math.sin(elapsed * 2.5) * 0.2;

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
      coreGeo.dispose();
      coreMat.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
      title="3D Autonomous Dispatch Matrix: Move cursor to inspect pairing topology"
    />
  );
};
