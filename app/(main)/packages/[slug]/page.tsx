import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string } | Promise<{ slug: string }>
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await Promise.resolve(params)
  const session = await getServerSession(authOptions)

  if (!slug) return notFound()

  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: { user: { select: { name: true } } }
      }
    }
  })

  if (!pkg || !pkg.isActive) return notFound()

  const itinerary = pkg.itinerary as Array<{
    day: number
    title: string
    description: string
  }>

  const avgRating = pkg.reviews.length
    ? (pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length).toFixed(1)
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-700 font-medium mb-4">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        {' / '}
        <Link href="/packages" className="hover:text-orange-500">Packages</Link>
        {' / '}
        <span className="text-gray-600">{pkg.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT - Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
            {pkg.images.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`}>
                <Image
                  src={img}
                  alt={`${pkg.title} photo ${i + 1}`}
                  fill
                  sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 25vw"}
                  className="object-cover"
                />
              </div>
            ))}
            {pkg.images.length === 0 && (
              <div className="col-span-2 h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Title and Meta */}
          <div>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full">
                  {pkg.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-800 mt-2">{pkg.title}</h1>
                <p className="text-gray-900 font-semibold mt-1">{pkg.destination}</p>
              </div>
              {avgRating && (
                <div className="text-center bg-yellow-50 px-4 py-2 rounded-xl">
                  <div className="text-yellow-500 font-bold text-xl">Star {avgRating}</div>
                  <div className="text-xs text-gray-400">{pkg.reviews.length} reviews</div>
                </div>
              )}
            </div>
            <p className="text-gray-900 font-medium mt-4 leading-relaxed">{pkg.description}</p>
          </div>

          {/* Inclusions and Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">What is Included</h3>
              <ul className="space-y-2">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="text-sm text-gray-900 font-medium flex gap-2">
                    <span className="text-green-500 mt-0.5">Yes</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">What is Not Included</h3>
              <ul className="space-y-2">
                {pkg.exclusions.map((item, i) => (
                  <li key={i} className="text-sm text-gray-900 font-medium flex gap-2">
                    <span className="text-red-400 mt-0.5">No</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Day-wise Itinerary */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Day-wise Itinerary</h2>
            <div className="space-y-4">
              {itinerary.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-orange-500 text-white px-5 py-3 font-semibold text-sm">
                    Day {day.day} — {day.title}
                  </div>
                  <div className="px-5 py-4 text-sm text-gray-900 font-medium leading-relaxed">
                    {day.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {pkg.reviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Traveler Reviews</h2>
              <div className="space-y-4">
                {pkg.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{review.user.name}</span>
                      <span className="text-yellow-500">{review.rating} out of 5</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div className="text-center mb-6">
              <span className="text-sm text-gray-900 font-semibold">Starting from</span>
              <div className="text-3xl font-bold text-orange-500 mt-1">
                Rs {pkg.price.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-900 font-semibold">per person</div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-900 font-semibold">Duration</span>
                <span className="text-gray-900 font-semibold">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-900 font-semibold">Category</span>
                <span className="text-gray-900 font-semibold">{pkg.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-900 font-semibold">Destination</span>
                <span className="text-gray-900 font-semibold">{pkg.destination}</span>
              </div>
            </div>

            <Link
              href={session?.user ? `/booking/${pkg.id}` : `/login?callbackUrl=/booking/${pkg.id}`}
              className="block w-full bg-orange-500 text-white text-center py-3 rounded-full font-semibold hover:bg-orange-600 transition mb-3"
            >
              {session?.user ? 'Book Now' : 'Login to Book'}
            </Link>

            <a
              href={`https://wa.me/918603606089?text=Hi, I am interested in the ${pkg.title} package`}
              target="_blank"
              className="block w-full bg-green-500 text-white text-center py-3 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Enquire on WhatsApp
            </a>

            <p className="text-center text-xs text-gray-900 font-semibold mt-4">
              Secure booking. No hidden charges.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
