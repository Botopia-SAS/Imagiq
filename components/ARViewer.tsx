
'use client';
import Script from 'next/script';

export default function ARViewer() {
  return (
    <>
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        strategy="afterInteractive"
      />

      {/* Reduce el tamaño del televisor al 20% */}
      {/* @ts-ignore */}
      <model-viewer
        src="/models/tv.glb"
        ios-src="/models/tv.usdz"
        alt="TV"
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
