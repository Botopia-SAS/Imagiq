
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface HeroProps {
    videos: string[]
    holdTimeMs?: number
    topCropPercent?: number
}

export default function Hero({
    videos,
    holdTimeMs = 3000,
    topCropPercent = 10,
}: HeroProps) {
    const [idx, setIdx] = useState(0)
    const timeoutRef = useRef<number | null>(null)
    const videoRefs = useRef<HTMLVideoElement[]>([])

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
        }
    }, [idx])

    const onEnded = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIdx((i) => (i + 1) % videos.length)
        }, holdTimeMs)
    }

    useEffect(() => {
        const vid = videoRefs.current[idx]
        if (vid) {
            vid.currentTime = 0
            vid.play().catch(() => { })
        }
    }, [idx])

    const clipValue = `inset(${topCropPercent}% 0 0 0)`

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
            {videos.map((src, i) => (
                <video
                    key={i}
                    ref={(el) => {
                        if (el) {
                            videoRefs.current[i] = el;
                        }
                    }}
                    src={src}
                    muted
                    onEnded={i === idx ? onEnded : undefined}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ clipPath: clipValue }}
                />
            ))}

            {/* Botones alineados a la izquierda, centrados verticalmente */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-start pl-8 md:pl-20 lg:pl-32">
                <div className="space-x-4">
                    <Link href="#" className="underline text-white">
                        Más información
                    </Link>          <Link
                        href="#"
                        className="bg-white text-black px-6 py-3 rounded-full font-semibold"
                    >
                        Comprar ahora
                    </Link>
                </div>
            </div>

            {/* Prev / Next */}
            <button
                onClick={() => {
                    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
                    setIdx((idx - 1 + videos.length) % videos.length)
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 text-white rounded-full"
            >
                ‹
            </button>
            <button
                onClick={() => {
                    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
                    setIdx((idx + 1) % videos.length)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 text-white rounded-full"
            >
                ›
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {videos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
                            setIdx(i)
                        }}
                        className={`w-8 h-1 rounded-full transition-all ${i === idx ? "bg-white" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    )
}
