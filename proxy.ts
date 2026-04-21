import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`

    if (path === '/admin/login') {
      if (token?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      return NextResponse.next()
    }

    // Only admins can access /admin routes.
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', callbackUrl)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/admin/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        if (path === '/admin/login') return true
        if (path.startsWith('/admin')) return !!token

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
