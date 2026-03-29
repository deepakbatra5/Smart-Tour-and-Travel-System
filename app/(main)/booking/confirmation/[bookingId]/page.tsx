import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: { bookingId: string } | Promise<{ bookingId: string }>
}

export default async function ConfirmationPage({ params }: Props) {
  const { bookingId } = await Promise.resolve(params)

  if (!bookingId) return notFound()

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      package: true,
      payment: true,
      user: true,
    }
  })

  if (!booking) return notFound()

  const travellersInfo = booking.travellersInfo as Array<{
    name: string
    age: string
    gender: string
  }>

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">

      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-500 text-4xl">Done</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
        <p className="text-gray-500 mt-2">
          Your trip has been booked successfully. A confirmation email has been sent to {booking.user.email}
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800">Booking Details</h2>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            {booking.status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-mono font-medium text-gray-700">{booking.id.slice(0, 12).toUpperCase()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Package</span>
            <span className="font-medium text-gray-700">{booking.package.title}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Destination</span>
            <span className="font-medium text-gray-700">{booking.package.destination}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Travel Date</span>
            <span className="font-medium text-gray-700">
              {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Duration</span>
            <span className="font-medium text-gray-700">{booking.package.duration} Days</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Travellers</span>
            <span className="font-medium text-gray-700">{booking.travellers} Person(s)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-green-600">
              Rs {booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          {booking.payment && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-mono text-xs text-gray-500">{booking.payment.razorpayPaymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Travellers Card */}
      {travellersInfo && travellersInfo.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Traveller Details</h2>
          <div className="space-y-2">
            {travellersInfo.map((t, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span className="font-medium text-gray-700">{i + 1}. {t.name}</span>
                <span className="text-gray-400">{t.age} years — {t.gender}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 bg-orange-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Back to Home
        </Link>
        <Link
          href="/packages"
          className="flex-1 border border-gray-300 text-gray-600 text-center py-3 rounded-xl font-medium hover:bg-gray-50 transition"
        >
          Explore More Packages
        </Link>
      </div>

      {/* Help */}
      <div className="text-center mt-8 text-sm text-gray-400">
        Need help? WhatsApp us at{' '}
        <a href="https://wa.me/919798919579" className="text-green-500 font-medium">
          +91 9798919579
        </a>
      </div>

    </div>
  )
}
