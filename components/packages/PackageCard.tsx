import Link from 'next/link'
import Image from 'next/image'

const categoryColors: Record<string, string> = {
  HONEYMOON: 'bg-pink-100 text-pink-700',
  FAMILY: 'bg-blue-100 text-blue-700',
  GROUP: 'bg-yellow-100 text-yellow-700',
  PILGRIMAGE: 'bg-orange-100 text-orange-700',
  ADVENTURE: 'bg-green-100 text-green-700',
  SOLO: 'bg-purple-100 text-purple-700',
  CORPORATE: 'bg-gray-100 text-gray-700',
}

interface Props {
  package: {
    id: string
    slug: string
    title: string
    destination: string
    price: number
    duration: number
    category: string
    images: string[]
  }
}

export default function PackageCard({ package: pkg }: Props) {
  const image = pkg.images?.[0] || '/placeholder-travel.jpg'

  return (
    <Link href={`/packages/${pkg.slug}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer">

        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={image}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
          <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[pkg.category] || 'bg-gray-100 text-gray-700'}`}>
            {pkg.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{pkg.title}</h3>
          <p className="text-gray-900 font-semibold text-sm mb-3">{pkg.destination}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-900 font-semibold">Starting from</span>
              <div className="text-orange-500 font-bold text-lg">
                Rs {pkg.price.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-900 font-semibold">Duration</span>
              <div className="text-gray-900 font-semibold text-sm">{pkg.duration} Days</div>
            </div>
          </div>

          <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
