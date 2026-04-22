import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (path === '/admin/login') {
    if (token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  }

  if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (path.startsWith('/agent') && path !== '/agent/pending' && !token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*'],
}
