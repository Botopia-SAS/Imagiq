'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      if (!navigator.xr) {
        alert("Tu navegador no soporta WebXR.");
        return;
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.xr.setReferenceSpaceType('local');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Cargar modelo GLB
      const loader = new GLTFLoader();
      loader.load('/models/tv.glb', (gltf) => {

        const model = gltf.scene;
        model.position.set(0, 0, -2); // Frente a la cámara
        model.scale.set(0.001, 0.001, 0.001); // Escala ajustable
        scene.add(model);
      });

      containerRef.current?.appendChild(renderer.domElement);

      renderer.setAnimationLoop(() => renderer.render(scene, camera));

      // Botón para iniciar sesión AR
      const button = document.createElement('button');
      button.textContent = 'Ver en mi espacio';
      button.style.cssText = 'position: absolute; top: 20px; left: 20px; z-index: 10;';
      button.onclick = () => {
        if (navigator.xr) {
          navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local'] })
            .then((session) => renderer.xr.setSession(session));
        } else {
          alert("WebXR no está disponible en este navegador.");
        }
      };
      containerRef.current?.appendChild(button);
    };

    init();

    return () => {
      containerRef.current?.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen bg-black" />;
}
