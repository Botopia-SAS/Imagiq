"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-lg px-6 py-4 flex items-center justify-between text-white">
      <Link href="/">
        {/* Logo ampliado */}
        <div className="w-40 h-auto">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={160}
            height={48}
            className="object-contain"
          />
        </div>
      </Link>

      <ul className="hidden md:flex space-x-6">
        {[
          "Tienda Online",
          "Mobile",
          "TV y AV",
          "Electrodomésticos",
          "IT",
          "Accessories",
          "SmartThings",
          "AI",
        ].map((item) => (
          <li key={item}>
            <Link href="#">{item}</Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-4">
        <button aria-label="Buscar" className="p-2 rounded-full hover:bg-white/20">
          <Search size={20} />
        </button>
        <button aria-label="Carrito" className="p-2 rounded-full hover:bg-white/20">
          <ShoppingCart size={20} />
        </button>
        <button aria-label="Perfil" className="p-2 rounded-full hover:bg-white/20">
          <User size={20} />
        </button>
      </div>
    </nav>
  )
}
