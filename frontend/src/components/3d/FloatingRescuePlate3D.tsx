import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingRescuePlate3DProps {
  className?: string;
}

export const FloatingRescuePlate3D: React.FC<FloatingRescuePlate3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect dark mode from html class
    const isDark = document.documentElement.classList.contains('dark');

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.6, 5.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Ground Contact Shadow (Canvas texture)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 120);
      grad.addColorStop(0, 'rgba(10, 25, 18, 0.45)');
      grad.addColorStop(0.5, 'rgba(16, 40, 28, 0.18)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(4.8, 4.8);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.92;
    scene.add(shadowPlane);

    // 2. Sculpted Ceramic Coupe Bowl (Artisan Lathe Geometry)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(1.1, 0.02));
    points.push(new THREE.Vector2(1.6, 0.12));
    points.push(new THREE.Vector2(1.95, 0.32));
    points.push(new THREE.Vector2(2.15, 0.55));
    points.push(new THREE.Vector2(2.22, 0.62));
    points.push(new THREE.Vector2(2.2, 0.58));
    points.push(new THREE.Vector2(2.0, 0.22));
    points.push(new THREE.Vector2(1.4, 0.05));
    points.push(new THREE.Vector2(0.9, -0.15));
    points.push(new THREE.Vector2(0.85, -0.22));
    points.push(new THREE.Vector2(0.4, -0.22));
    points.push(new THREE.Vector2(0, -0.22));

    const bowlGeo = new THREE.LatheGeometry(points, 64);
    bowlGeo.computeVertexNormals();

    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x14281e : 0xfbfaf5,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.6
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.y = -0.15;
    bowl.castShadow = true;
    bowl.receiveShadow = true;
    rootGroup.add(bowl);

    // Golden Rim Ring (Fine metallic inlay on lip)
    const goldRimGeo = new THREE.TorusGeometry(2.21, 0.04, 16, 64);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xdca647,
      roughness: 0.22,
      metalness: 0.88
    });
    const goldRim = new THREE.Mesh(goldRimGeo, goldRimMat);
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.46;
    rootGroup.add(goldRim);

    // Subtle Eco-Energy Ring beneath bowl
    const haloGeo = new THREE.TorusGeometry(2.38, 0.025, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.75
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.y = -0.32;
    rootGroup.add(haloRing);

    // 3. ARTISANAL GOURMET SURPLUS FOOD

    // --- ITEM A: RUSTIC SOURDOUGH ARTISAN LOAF SLICE ---
    const breadGroup = new THREE.Group();
    const breadShape = new THREE.Shape();
    breadShape.moveTo(-0.65, -0.2);
    breadShape.bezierCurveTo(-0.7, 0.4, -0.3, 0.65, 0.1, 0.6);
    breadShape.bezierCurveTo(0.55, 0.55, 0.8, 0.3, 0.75, -0.2);
    breadShape.bezierCurveTo(0.4, -0.28, -0.4, -0.28, -0.65, -0.2);

    const extrudeSettings = {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };
    const breadGeo = new THREE.ExtrudeGeometry(breadShape, extrudeSettings);
    breadGeo.center();

    // Golden baked crust material
    const breadMat = new THREE.MeshStandardMaterial({
      color: 0xc88b39, // Rich warm baked golden caramel crust
      roughness: 0.65,
      metalness: 0.02
    });
    const bread = new THREE.Mesh(breadGeo, breadMat);
    bread.castShadow = true;
    breadGroup.add(bread);

    // Sourdough Scoring Cuts (Artisan flour dusted slashes)
    const slashGeo = new THREE.TorusGeometry(0.3, 0.025, 8, 24, Math.PI * 0.7);
    const slashMat = new THREE.MeshStandardMaterial({
      color: 0xfff6dd, // Flour dusted scoring
      roughness: 0.8
    });
    const slash1 = new THREE.Mesh(slashGeo, slashMat);
    slash1.rotation.set(0.2, 0.4, 0.6);
    slash1.position.set(-0.15, 0.15, 0.22);
    breadGroup.add(slash1);

    const slash2 = slash1.clone();
    slash2.position.set(0.2, 0.18, 0.22);
    slash2.rotation.set(0.2, 0.4, 0.85);
    breadGroup.add(slash2);

    breadGroup.position.set(-0.55, 0.35, -0.25);
    breadGroup.rotation.set(0.35, -0.45, 0.25);
    breadGroup.scale.set(0.9, 0.9, 0.9);
    rootGroup.add(breadGroup);

    // --- ITEM B: CREAMY AVOCADO FAN (4 CURVED SLICES) ---
    const avoGroup = new THREE.Group();
    const sliceAngles = [-0.25, -0.08, 0.1, 0.28];

    sliceAngles.forEach((angle, i) => {
      const sliceSubGroup = new THREE.Group();

      // Curved crescent slice body
      const sliceGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.11, 24, 1, false, 0, Math.PI * 0.85);
      const sliceMat = new THREE.MeshStandardMaterial({
        color: 0x9dc646, // Creamy vibrant avocado green
        roughness: 0.38,
        metalness: 0.04
      });
      const slice = new THREE.Mesh(sliceGeo, sliceMat);
      slice.rotation.x = Math.PI / 2;
      slice.castShadow = true;
      sliceSubGroup.add(slice);

      // Dark pebbled skin rim
      const skinGeo = new THREE.TorusGeometry(0.48, 0.035, 12, 24, Math.PI * 0.85);
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0x1d331f, // Deep Haas avocado skin
        roughness: 0.85
      });
      const skin = new THREE.Mesh(skinGeo, skinMat);
      sliceSubGroup.add(skin);

      sliceSubGroup.position.set(i * 0.14 - 0.2, i * 0.05, i * 0.08);
      sliceSubGroup.rotation.z = angle;
      sliceSubGroup.rotation.y = angle * 0.5;
      avoGroup.add(sliceSubGroup);
    });

    avoGroup.position.set(0.55, 0.22, 0.35);
    avoGroup.rotation.set(-0.45, 0.6, -0.15);
    rootGroup.add(avoGroup);

    // --- ITEM C: GLOSSY HEIRLOOM CHERRY TOMATOES ---
    const tomatoGroup = new THREE.Group();
    const tomatoGeo = new THREE.SphereGeometry(0.24, 32, 24);
    const tomatoMat = new THREE.MeshPhysicalMaterial({
      color: 0xd63027, // Glossy ripe heirloom ruby red
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1
    });

    // Tomato 1
    const tom1 = new THREE.Mesh(tomatoGeo, tomatoMat);
    tom1.scale.set(1.05, 0.92, 1.0);
    tom1.castShadow = true;
    tomatoGroup.add(tom1);

    // Star Sepals / Calyx for Tomato 1
    const calyxGroup1 = new THREE.Group();
    for (let j = 0; j < 5; j++) {
      const sepalGeo = new THREE.ConeGeometry(0.04, 0.14, 6);
      const sepalMat = new THREE.MeshStandardMaterial({ color: 0x225e36, roughness: 0.4 });
      const sepal = new THREE.Mesh(sepalGeo, sepalMat);
      const a = (j / 5) * Math.PI * 2;
      sepal.position.set(Math.cos(a) * 0.09, 0.01, Math.sin(a) * 0.09);
      sepal.rotation.set(0.6 * Math.sin(a), 0, -0.6 * Math.cos(a));
      calyxGroup1.add(sepal);
    }
    // Tiny curved stem
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.018, 0.12, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.5 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.07;
    stem.rotation.z = 0.3;
    calyxGroup1.add(stem);

    calyxGroup1.position.y = 0.22;
    tomatoGroup.add(calyxGroup1);

    // Tomato 2 (smaller companion)
    const tom2 = new THREE.Mesh(tomatoGeo, tomatoMat);
    tom2.scale.set(0.82, 0.74, 0.8);
    tom2.position.set(0.32, -0.06, 0.12);
    tom2.castShadow = true;
    tomatoGroup.add(tom2);

    const calyxGroup2 = calyxGroup1.clone();
    calyxGroup2.scale.set(0.8, 0.8, 0.8);
    calyxGroup2.position.set(0.32, 0.12, 0.12);
    calyxGroup2.rotation.z = -0.4;
    tomatoGroup.add(calyxGroup2);

    tomatoGroup.position.set(-0.28, 0.24, 0.65);
    tomatoGroup.rotation.set(0.2, 0.3, 0.1);
    rootGroup.add(tomatoGroup);

    // --- ITEM D: FRESH BABY GREENS & BASIL LEAVES ---
    const greensGroup = new THREE.Group();
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.18, 0.18, 0.25, 0.45, 0, 0.65);
    leafShape.bezierCurveTo(-0.25, 0.45, -0.18, 0.18, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape, 12);
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f5e39,
      roughness: 0.25,
      side: THREE.DoubleSide,
      clearcoat: 0.4
    });

    const leafPositions = [
      { pos: [0.1, 0.12, -0.55], rot: [-0.6, 0.4, -0.3], scale: 1.1 },
      { pos: [-0.4, 0.14, -0.5], rot: [-0.5, -0.6, 0.4], scale: 0.95 },
      { pos: [0.35, 0.15, -0.2], rot: [-0.2, 0.8, -0.4], scale: 1.05 },
      { pos: [-0.15, 0.16, 0.1], rot: [0.2, -0.2, 0.5], scale: 0.85 }
    ];

    leafPositions.forEach((lp) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(lp.pos[0], lp.pos[1], lp.pos[2]);
      leaf.rotation.set(lp.rot[0], lp.rot[1], lp.rot[2]);
      leaf.scale.set(lp.scale, lp.scale, lp.scale);
      greensGroup.add(leaf);
    });
    rootGroup.add(greensGroup);

    // --- ITEM E: TOASTED SESAME & HERB PARTICLES (Garnish) ---
    const seedCount = 45;
    const seedGeo = new THREE.BufferGeometry();
    const seedPositions = new Float32Array(seedCount * 3);
    for (let k = 0; k < seedCount; k++) {
      const r = Math.random() * 1.1;
      const th = Math.random() * Math.PI * 2;
      seedPositions[k * 3] = Math.cos(th) * r;
      seedPositions[k * 3 + 1] = 0.22 + Math.random() * 0.15;
      seedPositions[k * 3 + 2] = Math.sin(th) * r;
    }
    seedGeo.setAttribute('position', new THREE.BufferAttribute(seedPositions, 3));
    const seedMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xfff0c8,
      transparent: true,
      opacity: 0.9
    });
    const seeds = new THREE.Points(seedGeo, seedMat);
    rootGroup.add(seeds);

    // --- ITEM F: AROMATIC STEAM PARTICLES (Fresh warm rescue food) ---
    const steamCount = 35;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    const steamInitY = new Float32Array(steamCount);
    const steamDrift = new Float32Array(steamCount);

    for (let s = 0; s < steamCount; s++) {
      const rad = Math.random() * 0.9;
      const ang = Math.random() * Math.PI * 2;
      steamPos[s * 3] = Math.cos(ang) * rad;
      const sy = 0.4 + Math.random() * 1.8;
      steamPos[s * 3 + 1] = sy;
      steamInitY[s] = sy;
      steamPos[s * 3 + 2] = Math.sin(ang) * rad;
      steamDrift[s] = (Math.random() - 0.5) * 0.004;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    rootGroup.add(steam);

    // 4. STUDIO LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(isDark ? 0x234433 : 0xffffff, isDark ? 1.4 : 1.8);
    scene.add(ambientLight);

    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfff6e6, 2.8);
    keyLight.position.set(4.5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Lush Emerald Rim Light
    const emeraldRim = new THREE.PointLight(0xd9f36a, 3.2, 10);
    emeraldRim.position.set(-4, 3.5, -3);
    scene.add(emeraldRim);

    // Soft Fill Light
    const fillLight = new THREE.PointLight(0xffeedd, 1.2, 8);
    fillLight.position.set(2, 2, 4);
    scene.add(fillLight);

    // 5. INTERACTIVE 360° ORBIT & PARALLAX CONTROLS
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelocityX = 0;
    let rotVelocityY = 0;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let curParallaxX = 0;
    let curParallaxY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        rotVelocityY = deltaX * 0.006;
        rotVelocityX = deltaY * 0.005;
        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetParallaxX = ny * 0.25;
        targetParallaxY = nx * 0.35;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // 6. ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Damping on interactive drag
      if (!isDragging) {
        rotVelocityY += (0.0035 - rotVelocityY) * 0.05; // Gentle auto-spin
        rotVelocityX *= 0.92;
      }

      rootGroup.rotation.y += rotVelocityY;
      rootGroup.rotation.x = THREE.MathUtils.clamp(
        rootGroup.rotation.x + rotVelocityX,
        -0.1,
        0.75
      );

      // Subtle parallax interpolation
      curParallaxX += (targetParallaxX - curParallaxX) * 0.05;
      curParallaxY += (targetParallaxY - curParallaxY) * 0.05;

      // Gentle breathing levitation
      rootGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.09;
      rootGroup.position.x = curParallaxY * 0.3;
      rootGroup.position.z = curParallaxX * 0.2;

      // Pulse Halo Ring
      haloMat.opacity = 0.55 + Math.sin(elapsedTime * 2.5) * 0.25;
      haloRing.rotation.z = elapsedTime * 0.25;

      // Animate Steam upward
      const pos = steamGeo.attributes.position.array as Float32Array;
      for (let s = 0; s < steamCount; s++) {
        pos[s * 3 + 1] += 0.0065;
        pos[s * 3] += Math.sin(elapsedTime * 3 + s) * 0.001 + steamDrift[s];
        if (pos[s * 3 + 1] > 2.4) {
          pos[s * 3 + 1] = 0.35;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Synchronize shadow scale with levitation
      const shadowScale = 1.0 - rootGroup.position.y * 0.3;
      shadowPlane.scale.set(shadowScale, shadowScale, shadowScale);

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
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bowlGeo.dispose();
      bowlMat.dispose();
      goldRimGeo.dispose();
      goldRimMat.dispose();
      breadGeo.dispose();
      breadMat.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTexture.dispose();
      steamGeo.dispose();
      steamMat.dispose();
      seedGeo.dispose();
      seedMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
      title="3D Artisan Harvest Bowl: Click and drag to spin 360°"
    />
  );
};
