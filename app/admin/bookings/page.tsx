import { prisma } from '@/lib/db'
import UpdateBookingStatus from './UpdateBookingStatus'

interface SearchParams {
  status?: string
}

interface Props {
  searchParams: SearchParams | Promise<SearchParams>
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const resolved = await Promise.resolve(searchParams)
  const where = resolved.status && resolved.status !== 'ALL' ? { status: resolved.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' } : {}

  const bookings = await prisma.booking.findMany({
    where,
    include: { user: true, package: true, payment: true },
    orderBy: { createdAt: 'desc' },
  })

  const statusFilters = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.length} bookings found</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((status) => (
          <a
            key={status}
            href={status === 'ALL' ? '/admin/bookings' : `/admin/bookings?status=${status}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition
              ${resolved.status === status || (!resolved.status && status === 'ALL')
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {status}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Booking ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Package</th>
                <th className="px-5 py-4 font-medium">Travel Date</th>
                <th className="px-5 py-4 font-medium">Travellers</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{booking.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-700">{booking.user.name}</div>
                    <div className="text-gray-400 text-xs">{booking.user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 max-w-37.5 truncate">{booking.package.title}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{booking.travellers}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">Rs {booking.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${booking.payment?.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}
                    >
                      {booking.payment?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-700'}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <UpdateBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="text-center text-gray-400 py-10">No bookings found</p>}
        </div>
      </div>
    </div>
  )
}
