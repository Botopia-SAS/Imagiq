import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";

export default function Page() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero videos={["/TV.webm", "/Galaxy.webm"]} holdTimeMs={4000} topCropPercent={10} />
      {/* Sección de ofertas con fondo blanco */}
      <Offers />
      {/* … otras secciones */}
    </div>
  );
}
