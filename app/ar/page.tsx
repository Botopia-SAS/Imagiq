'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!navigator.xr || !container) {
      alert("Tu navegador no soporta WebXR.");
      return;
    }

    let model: THREE.Object3D;
    let isDragging = false;
    const dragOffset = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    let initialPinchDist = 0;
    let initialScale = 1;

    let initialTwistAngle = 0;
    let startYRotation = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
    scene.add(camera);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));

    // Cargar modelo y ajustar posición/rotación/escala
    new GLTFLoader().load('/models/tv.glb', (gltf) => {
      model = gltf.scene;
      model.scale.set(0.009, 0.009, 0.009);
      model.position.set(0, 0, -0.9);
      // giro inicial de 180° para que mire hacia la cámara
      model.rotation.y = Math.PI;
      camera.add(model);
    });

    // Render y botón AR
    container.appendChild(renderer.domElement);
    const btn = document.createElement('button');
    btn.textContent = 'Ver en mi espacio';
    Object.assign(btn.style, {
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: '10',
      padding: '10px 16px',
      background: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '4px'
    });
    btn.onclick = () => {
      if (navigator.xr) {
        navigator.xr
          .requestSession('immersive-ar', { requiredFeatures: ['local', 'hit-test'] })
          .then((session) => renderer.xr.setSession(session));
      } else {
        alert("WebXR no está disponible en este navegador.");
      }
    };
    container.appendChild(btn);

    const updatePointer = (x: number, y: number) => {
      pointer.x = (x / window.innerWidth) * 2 - 1;
      pointer.y = -(y / window.innerHeight) * 2 + 1;
    };

    // Gestos
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!model) return;
      // dos dedos → inicio de pinch/twist
      if (e instanceof TouchEvent && e.touches.length === 2) {
        const [t0, t1] = [e.touches[0], e.touches[1]];
        initialPinchDist = Math.hypot(
          t0.clientX - t1.clientX,
          t0.clientY - t1.clientY
        );
        initialScale = model.scale.x;
        initialTwistAngle = Math.atan2(
          t1.clientY - t0.clientY,
          t1.clientX - t0.clientX
        );
        startYRotation = model.rotation.y;
        return;
      }

      // un dedo o ratón → inicio drag
      isDragging = true;
      const x = e instanceof TouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = e instanceof TouchEvent ? e.touches[0].clientY : (e as MouseEvent).clientY;
      updatePointer(x, y);
      raycaster.setFromCamera(pointer, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      dragOffset.copy(intersect).sub(model.getWorldPosition(new THREE.Vector3()));
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!model) return;
      // pinch → escala
      if (e instanceof TouchEvent && e.touches.length === 2) {
        const [t0, t1] = [e.touches[0], e.touches[1]];
        // escala
        const dist = Math.hypot(
          t0.clientX - t1.clientX,
          t0.clientY - t1.clientY
        );
        model.scale.setScalar(initialScale * (dist / initialPinchDist));
        // twist → rotación Y
        const currentAngle = Math.atan2(
          t1.clientY - t0.clientY,
          t1.clientX - t0.clientX
        );
        model.rotation.y = startYRotation + (currentAngle - initialTwistAngle);
        return;
      }

      // drag → mover
      if (!isDragging) return;
      const x = e instanceof TouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = e instanceof TouchEvent ? e.touches[0].clientY : (e as MouseEvent).clientY;
      updatePointer(x, y);
      raycaster.setFromCamera(pointer, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      model.position.copy(intersect.sub(dragOffset));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Listeners
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('touchstart', onPointerDown);
    renderer.domElement.addEventListener('touchmove', onPointerMove);
    renderer.domElement.addEventListener('touchend', onPointerUp);

    renderer.setAnimationLoop(() => renderer.render(scene, camera));

    return () => {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('touchstart', onPointerDown);
      renderer.domElement.removeEventListener('touchmove', onPointerMove);
      renderer.domElement.removeEventListener('touchend', onPointerUp);
      container.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen bg-black" />;
}

