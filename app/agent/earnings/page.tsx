import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentEarningsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login?callbackUrl=/agent/earnings')
  const userEmail = session.user.email

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail },
        include: { agent: true },
      })
    } catch {
      return null
    }
  })()

  if (!user) redirect('/agent-register')

  if (!user?.agent) redirect('/agent-register')
  if (user.agent.status === 'PENDING') redirect('/agent/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  const assignments = await prisma.bookingAgent.findMany({
    where: { agentId: user.agent.id },
    include: { booking: { include: { package: true } } },
    orderBy: { assignedAt: 'desc' },
  }).catch(() => [])

  const completed = assignments.filter((item) => item.status === 'COMPLETED')
  const total = completed.reduce((sum, item) => sum + item.commission, 0)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-emerald-600 p-6 text-white">
        <p className="text-sm text-emerald-100">Total Completed Earnings</p>
        <h1 className="mt-1 text-3xl font-extrabold">Rs {total.toLocaleString('en-IN')}</h1>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Earnings History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 text-left text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Package</th>
                <th className="pb-3 font-medium">Travel Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="py-3 font-medium text-slate-800">{assignment.booking.package.title}</td>
                  <td className="py-3 text-slate-500">{new Date(assignment.booking.travelDate).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 text-slate-500">{assignment.status}</td>
                  <td className="py-3 font-bold text-emerald-600">Rs {assignment.commission.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {assignments.length === 0 && <p className="py-8 text-center text-slate-400">No earnings history yet.</p>}
        </div>
      </div>
    </div>
  )
}
