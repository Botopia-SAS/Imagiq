"use client";

import { useState } from "react";

interface Offer {
  id: number;
  title: string;
  image: string;
  badge?: string;
  description?: string;
}

const tabs = [
  "Ofertas",
  "Móviles",
  "Audio y Video",
  "Electrodomésticos",
  "Monitores",
];

const sampleOffers: Offer[] = [
  {
    id: 1,
    title: "Galaxy S25+ con Galaxy Buds3",
    image: "/offers/Fold6.png",
    badge: "Nuevo",
    description: "10% Dto. primera compra Shop App + $1.200.000 con Estreno y Entrega",
  },
  { id: 2, title: "Galaxy S24 FE de 512 GB", image: "/offers/Fold6.png" },
  { id: 3, title: "Lavadora Secadora Bespoke 26 kg", image: "/offers/Fold6.png" },
  { id: 4, title: "Smart TV Neo QLED 55” + Barra de sonido", image: "/offers/Fold6.png" },
  { id: 5, title: "Monitor Odyssey G9 49”", image: "/offers/Fold6.png" },
];

export default function Offers() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const offers = sampleOffers;

  return (
    <section
      className="
        bg-gradient-to-b 
        from-black 
        to-gray-100 
        text-black
      "
    >
      <div className="px-6 md:px-12 lg:px-24 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Últimas ofertas
        </h2>

        <div className="flex justify-center space-x-8 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-white text-white font-medium"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carta grande */}
          {offers[0] && (
            <div className="relative lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden">
              {offers[0].badge && (
                <span className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
                  {offers[0].badge}
                </span>
              )}
              <img
                src={offers[0].image}
                alt={offers[0].title}
                className="w-full h-96 object-contain bg-gray-100/50"
              />
              <div className="p-6 border-t border-gray-200/50">
                <h3 className="text-xl font-semibold mb-2">{offers[0].title}</h3>
                {offers[0].description && (
                  <p className="text-sm text-gray-800/80">{offers[0].description}</p>
                )}
              </div>
            </div>
          )}

          {/* Cartas pequeñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-1">
            {offers.slice(1).map((o) => (
              <div
                key={o.id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center text-center"
              >
                <img
                  src={o.image}
                  alt={o.title}
                  className="w-full h-48 object-contain bg-gray-100/50 mb-4"
                />
                <h3 className="font-medium">{o.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
