// components/ARViewer.tsx
// @ts-nocheck
'use client';
import React from 'react';
import Script from 'next/script';

export default function ARViewer() {
  return (
    <>
      {/* Carga ESM como módulo para que no falle el ‘export’ */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        strategy="afterInteractive"
      />

      {/* Ahora TS deja de quejarse */}
      <model-viewer
        src="/models/tv.glb"
        alt="Modelo de TV"
        ar
        ar-modes="scene-viewer webxr quick-look"
        environment-image="neutral"
        auto-rotate
        camera-controls
        scale="0.2 0.2 0.2"
        style={{ width: '100%', height: '100vh' }}
      >
        <button
          slot="ar-button"
          style={{
            background: '#000',
            color: '#fff',
            padding: '12px 20px',
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
          }}
        >
          Ver en mi espacio
        </button>
      </model-viewer>
    </>
  );
}