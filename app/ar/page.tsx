'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navigator.xr) {
      alert("Tu navegador no soporta WebXR.");
      return;
    }

    let model: THREE.Object3D;
    let isDragging = false;
    let dragOffset = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    let initialPinchDist = 0;
    let initialScale = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    scene.add(camera);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Carga el modelo
    new GLTFLoader().load('/models/tv.glb', (gltf) => {
      model = gltf.scene;
      model.scale.set(0.009, 0.009, 0.009);
      // Inicialmente 0.5m delante
      model.position.set(0, -0.2, -0.5);
      camera.add(model); 
    });

    // Append renderer y botón
    containerRef.current?.appendChild(renderer.domElement);
    const btnAR = document.createElement('button');
    btnAR.textContent = 'Ver en mi espacio';
    Object.assign(btnAR.style, {
      position: 'absolute', top: '20px', left: '20px', zIndex: 10,
      padding: '10px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px'
    });
    btnAR.onclick = () => {
      navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local', 'hit-test'] })
        .then((s) => renderer.xr.setSession(s));
    };
    containerRef.current?.appendChild(btnAR);

    // Función común para convertir touch/mouse a NDC
    const updatePointer = (x: number, y: number) => {
      pointer.x = ( x / window.innerWidth ) * 2 - 1;
      pointer.y = - ( y / window.innerHeight ) * 2 + 1;
    };

    // DRAGGING
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!model) return;
      let x = 0, y = 0;
      if (e instanceof TouchEvent) {
        if (e.touches.length === 1) {
          x = e.touches[0].clientX; y = e.touches[0].clientY;
          isDragging = true;
        } else if (e.touches.length === 2) {
          // PINCH start
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          initialPinchDist = Math.hypot(dx, dy);
          initialScale = model.scale.x;
        }
      } else {
        isDragging = true;
        x = e.clientX; y = e.clientY;
      }
      updatePointer(x, y);
      // Raycast al plano Y=0
      raycaster.setFromCamera(pointer, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      dragOffset.copy(intersect).sub(model.getWorldPosition(new THREE.Vector3()));
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!model) return;
      if (e instanceof TouchEvent && e.touches.length === 2) {
        // PINCH move → escala
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scale = initialScale * (dist / initialPinchDist);
        model.scale.setScalar(scale);
        return;
      }
      if (!isDragging) return;

      let x = 0, y = 0;
      if (e instanceof TouchEvent) {
        x = e.touches[0]?.clientX; y = e.touches[0]?.clientY;
      } else {
        x = e.clientX; y = e.clientY;
      }
      updatePointer(x, y);
      raycaster.setFromCamera(pointer, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      // Coloca el modelo manteniendo el offset
      const newPos = intersect.sub(dragOffset);
      model.position.copy(newPos);
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

    // Loop de render
    renderer.setAnimationLoop(() => renderer.render(scene, camera));

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('touchstart', onPointerDown);
      renderer.domElement.removeEventListener('touchmove', onPointerMove);
      renderer.domElement.removeEventListener('touchend', onPointerUp);
      containerRef.current?.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen bg-black" />;
}
