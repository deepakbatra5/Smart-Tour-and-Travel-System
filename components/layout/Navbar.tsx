'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Travel Sphere
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/packages" className="hover:text-orange-500 transition">All Packages</Link>
          <Link href="/packages?category=HONEYMOON" className="hover:text-orange-500 transition">Honeymoon</Link>
          <Link href="/packages?category=FAMILY" className="hover:text-orange-500 transition">Family</Link>
          <Link href="/packages?category=PILGRIMAGE" className="hover:text-orange-500 transition">Pilgrimage</Link>
          <Link href="/packages?category=GROUP" className="hover:text-orange-500 transition">Group Tours</Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-700 hover:text-orange-500">Login</Link>
          <Link
            href="/register"
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'X' : '='}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4 text-sm text-gray-700">
          <Link href="/packages" onClick={() => setMenuOpen(false)}>All Packages</Link>
          <Link href="/packages?category=HONEYMOON" onClick={() => setMenuOpen(false)}>Honeymoon</Link>
          <Link href="/packages?category=FAMILY" onClick={() => setMenuOpen(false)}>Family</Link>
          <Link href="/packages?category=PILGRIMAGE" onClick={() => setMenuOpen(false)}>Pilgrimage</Link>
          <Link href="/packages?category=GROUP" onClick={() => setMenuOpen(false)}>Group Tours</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
        </div>
      )}
    </nav>
  )
}
