"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface HeroProps {
  videos: string[];
  holdTimeMs?: number;
  topCropPercent?: number;
}

export default function Hero({
  videos,
  holdTimeMs = 3000,
  topCropPercent = 5,
}: HeroProps) {
  const [idx, setIdx] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [idx]);

  const onEnded = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIdx((i) => (i + 1) % videos.length);
    }, holdTimeMs);
  };

  useEffect(() => {
    const vid = videoRefs.current[idx];
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }, [idx]);

  const clipValue = `inset(${topCropPercent}% 0 0 0)`;

  return (
    <section className="relative left-1/2 w-screen max-w-[100%] h-screen overflow-hidden bg-black mt-8 transform -translate-x-1/2">
      {/* Contenedor para centrar el video en móvil */}
      <div className="relative w-full h-full flex items-center justify-center">
        {videos.map((src, i) => (
          <div 
            key={i}
            className={`absolute w-full h-full md:w-full md:h-full transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
          >
            <video
              ref={(el) => { if (el) videoRefs.current[i] = el }}
              src={src}
              muted
              onEnded={i === idx ? onEnded : undefined}
              playsInline
              preload="auto"
              className="w-full h-full object-cover md:object-cover video-responsive"
              style={{ 
                clipPath: clipValue,
                transform: 'scale(1)',
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-x-0 top-[500px] z-10 flex items-center justify-start pl-6 sm:pl-8 md:pl-20 lg:pl-32 space-x-4">
        <Link href="#" className="inline-block px-5 py-3 rounded-full border-2 border-white text-white font-medium transition-colors transition-shadow shadow-sm hover:bg-white/10 hover:shadow-md">
          Más información
        </Link>
        <Link href="#" className="inline-block px-6 py-3 rounded-full bg-white text-black font-semibold border border-transparent transition-all shadow-md hover:shadow-lg hover:border-gray-200">
          Comprar ahora
        </Link>
      </div>

      <button
        onClick={() => { if (timeoutRef.current !== null) clearTimeout(timeoutRef.current); setIdx((idx - 1 + videos.length) % videos.length) }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 text-white rounded-full"
      >
        ‹
      </button>
      <button
        onClick={() => { if (timeoutRef.current !== null) clearTimeout(timeoutRef.current); setIdx((idx + 1) % videos.length) }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 text-white rounded-full"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (timeoutRef.current !== null) clearTimeout(timeoutRef.current); setIdx(i) }}
            className={`w-8 h-1 rounded-full transition-all ${i === idx ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}