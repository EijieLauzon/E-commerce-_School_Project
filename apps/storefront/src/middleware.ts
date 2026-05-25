import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

function isPublicPath(pathname: string) {
   return (
      pathname.startsWith('/login') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next') ||
      pathname === '/favicon.ico'
   )
}

function isApiPath(pathname: string) {
   return pathname.startsWith('/api')
}

function redirectToLogin(req: NextRequest, clearAuthCookies = false) {
   const res = NextResponse.redirect(new URL('/login', req.url))
   if (clearAuthCookies) {
      res.cookies.delete('token')
      res.cookies.delete('logged-in')
   }
   return res
}

export async function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl

   if (isPublicPath(pathname)) return NextResponse.next()

   const isAPI = isApiPath(pathname)

   if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET_KEY is not set in environment variables')
      if (isAPI) return getErrorResponse(500, 'Internal Server Error')
      return redirectToLogin(req, true)
   }

   let token: string | undefined

   if (req.cookies.has('token')) {
      token = req.cookies.get('token')?.value
   } else if (req.headers.get('Authorization')?.startsWith('Bearer ')) {
      token = req.headers.get('Authorization')?.substring(7)
   }

   if (!token) {
      if (isAPI) return getErrorResponse(401, 'INVALID TOKEN')
      return redirectToLogin(req)
   }

   try {
      const { sub } = await verifyJWT<{ sub: string }>(token)
      const response = NextResponse.next()
      response.headers.set('X-USER-ID', sub)
      return response
   } catch {
      if (isAPI) return getErrorResponse(401, 'UNAUTHORIZED')
      return redirectToLogin(req, true)
   }
}

export const config = {
   matcher: ['/profile/:path*', '/api/:path*'],
}
