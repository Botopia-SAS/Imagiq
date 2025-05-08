"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    "Tienda Online",
    "Mobile",
    "TV y AV",
    "Electrodomésticos",
    "IT",
    "Accessories",
    "SmartThings",
    "AI",
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-lg px-6 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <Link href="/">
        <div className="relative w-52 h-14">  {/* ajusta a tu gusto */}
          <Image
            src="/logo.svg"
            alt="Logo"
            width={208}
            height={96}
            className="object-contain"
          />
        </div>
      </Link>

      {/* Menú de escritorio */}
      <ul className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <li key={item}>
            <Link href="#">{item}</Link>
          </li>
        ))}
      </ul>

      {/* Iconos + botón hamburguesa */}
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

        {/* botón hamburguesa en móvil */}
        <button
          className="md:hidden p-2 rounded hover:bg-white/20"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/80 backdrop-blur-lg flex flex-col items-start p-4 space-y-4 z-40">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              className="w-full py-2 text-lg font-medium hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
