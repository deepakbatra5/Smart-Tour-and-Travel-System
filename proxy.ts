import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Only admins can access /admin routes
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // These paths require login
        if (path.startsWith('/booking')) return !!token
        if (path.startsWith('/admin')) return !!token

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/booking/:path*', '/admin/:path*']
}
