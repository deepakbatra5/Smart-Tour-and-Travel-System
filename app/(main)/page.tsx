import Link from 'next/link'
import { prisma } from '@/lib/db'
import PackageCard from '@/components/packages/PackageCard'

export const dynamic = 'force-dynamic'

async function getFeaturedPackages() {
  return await prisma.package.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })
}

const categories = [
  { label: 'Honeymoon', value: 'HONEYMOON', bg: 'bg-pink-100' },
  { label: 'Family', value: 'FAMILY', bg: 'bg-blue-100' },
  { label: 'Group Tours', value: 'GROUP', bg: 'bg-yellow-100' },
  { label: 'Pilgrimage', value: 'PILGRIMAGE', bg: 'bg-orange-100' },
  { label: 'Adventure', value: 'ADVENTURE', bg: 'bg-green-100' },
  { label: 'Solo', value: 'SOLO', bg: 'bg-purple-100' },
]

export default async function HomePage() {
  const packages = await getFeaturedPackages()

  return (
    <div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Explore India and Beyond
        </h1>
        <p className="text-lg md:text-xl mb-8 text-orange-100">
          Handcrafted tour packages for every kind of traveler
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Search destination e.g. Goa, Kashmir, Kerala..."
            className="flex-1 px-4 py-3 rounded-l-full text-gray-800 text-sm focus:outline-none"
          />
          <Link
            href="/packages"
            className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-r-full hover:bg-orange-50 transition text-sm"
          >
            Search
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-10 text-center">
          {[
            { label: 'Happy Travelers', value: '50,000+' },
            { label: 'Tour Packages', value: '200+' },
            { label: 'Destinations', value: '100+' },
            { label: 'Years Experience', value: '10+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-orange-200 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Browse by Category</h2>
        <p className="text-gray-500 text-center mb-8">Find the perfect trip for every occasion</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/packages?category=${cat.value}`}
              className={`${cat.bg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition text-center`}
            >
              <span className="text-sm font-medium text-gray-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Featured Packages</h2>
            <p className="text-gray-500 text-sm mt-1">Our most popular trips this season</p>
          </div>
          <Link href="/packages" className="text-orange-500 font-medium text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
        {packages.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No packages yet. Add some from the admin panel.
          </p>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Travel Sphere?</h2>
          <p className="text-gray-500 mb-10">Trusted by thousands of happy travelers across India</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Verified Tours', desc: 'All packages verified and quality checked' },
              { title: 'Best Price', desc: 'Guaranteed lowest prices with no hidden fees' },
              { title: '24/7 Support', desc: 'Round-the-clock customer support' },
              { title: 'Expert Guides', desc: 'Professional and experienced tour managers' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-green-500 text-white py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Need Help Planning Your Trip?</h2>
        <p className="mb-6 text-green-100">Chat with our travel experts on WhatsApp</p>
        <a
          href="https://wa.me/918603606089"
          target="_blank"
          className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition"
        >
          Chat on WhatsApp
        </a>
      </section>

    </div>
  )
}
