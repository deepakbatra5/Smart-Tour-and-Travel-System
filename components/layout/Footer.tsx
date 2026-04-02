import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">Travel Sphere</h2>
          <p className="text-sm leading-relaxed font-medium text-gray-200">
            India&apos;s trusted travel company. Curated tours for families,
            couples, groups and solo travelers since 2013.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm font-medium text-gray-200">
            <li><Link href="/packages" className="hover:text-orange-400 transition">All Packages</Link></li>
            <li><Link href="/packages?category=HONEYMOON" className="hover:text-orange-400 transition">Honeymoon Tours</Link></li>
            <li><Link href="/packages?category=FAMILY" className="hover:text-orange-400 transition">Family Tours</Link></li>
            <li><Link href="/packages?category=PILGRIMAGE" className="hover:text-orange-400 transition">Pilgrimage Tours</Link></li>
            <li><Link href="/packages?category=ADVENTURE" className="hover:text-orange-400 transition">Adventure Tours</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm font-medium text-gray-200">
            <li>Phone: +91 8603606089</li>
            <li>Email: deepankumar81c401a1e8@gmail.com</li>
            <li>Address: Amritsar, Punjab, India</li>
            <li>Hours: Mon-Sat 9AM to 7PM</li>
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <div>
          <h3 className="text-white font-semibold mb-3">Chat With Us</h3>
          <p className="text-sm mb-4 font-medium text-gray-200">Get instant help from our travel experts</p>
          <a
            href="https://wa.me/918603606089"
            target="_blank"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-300 font-medium">
        {new Date().getFullYear()} Travel Sphere. All rights reserved.
      </div>
    </footer>
  )
}
