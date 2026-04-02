import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: {
          package: {
            select: {
              title: true,
              destination: true,
            },
          },
          payment: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const totalBookings = user.bookings.length
  const confirmedBookings = user.bookings.filter((booking) => booking.status === 'CONFIRMED').length
  const totalSpent = user.bookings
    .filter((booking) => booking.status === 'CONFIRMED')
    .reduce((sum, booking) => sum + booking.totalAmount, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back, {user.name}. Here is your booking history and account summary.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{totalBookings}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Confirmed Trips</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{confirmedBookings}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">Rs {totalSpent.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold text-gray-800">{user.name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800 break-all">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Booking History</h2>
          <Link href="/packages" className="text-orange-500 text-sm font-medium hover:underline">
            Book a New Package
          </Link>
        </div>

        {user.bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You have not booked any package yet.</p>
            <Link href="/packages" className="inline-block mt-4 bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition">
              Explore Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.bookings.map((booking) => (
              <div key={booking.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{booking.package.title}</h3>
                    <p className="text-sm text-gray-500">{booking.package.destination}</p>
                  </div>
                  <div className="text-sm text-right">
                    <p className="text-gray-500">Travel Date</p>
                    <p className="font-medium text-gray-700">
                      {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 text-sm">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-500">Booking Status</p>
                    <p className="font-semibold text-gray-800">{booking.status}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-500">Travellers</p>
                    <p className="font-semibold text-gray-800">{booking.travellers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-800">Rs {booking.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-500">Payment</p>
                    <p className="font-semibold text-gray-800">{booking.payment?.status || 'PENDING'}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/booking/confirmation/${booking.id}`} className="text-sm text-orange-500 font-medium hover:underline">
                    View Booking Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
