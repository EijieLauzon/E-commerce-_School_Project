import { signJWT } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

function normalizeIranianPhoneNumber(phone: string) {
   const cleaned = phone.toString().trim().replace(/[^0-9+]/g, '')

   if (cleaned.startsWith('0098')) {
      return `+98${cleaned.slice(4)}`
   }

   if (cleaned.startsWith('+98')) {
      return cleaned
   }

   if (cleaned.startsWith('0')) {
      return `+98${cleaned.slice(1)}`
   }

   return cleaned
}

export { dynamic } from '@/lib/api-route-config'

export async function POST(req: NextRequest) {
   try {
      const expiryMinutes = 30 * 24 * 60
      const tokenMaxAge = expiryMinutes * 60

      const { phone, OTP, cart } = await req.json()

      if (!phone || !OTP) {
         return getErrorResponse(400, 'Phone and OTP are required.')
      }

      const normalizedPhone = normalizeIranianPhoneNumber(phone)

      const user = await prisma.user.update({
         where: { phone: normalizedPhone, OTP },
         data: { isPhoneVerified: true },
      })

      if (cart?.items?.length > 0) {
         for (const item of cart.items) {
            const { count, productId } = item

            await prisma.cart.upsert({
               where: {
                  userId: user.id,
               },
               create: {
                  user: {
                     connect: {
                        id: user.id,
                     },
                  },
               },
               update: {
                  items: {
                     upsert: {
                        where: {
                           UniqueCartItem: {
                              cartId: user.id,
                              productId,
                           },
                        },
                        update: {
                           count,
                        },
                        create: {
                           productId,
                           count,
                        },
                     },
                  },
               },
            })
         }
      }

      const token = await signJWT(
         { sub: user.id },
         { exp: `${expiryMinutes}m` }
      )

      const cookieOptions = {
         name: 'token',
         value: token,
         httpOnly: true,
         path: '/',
         secure: process.env.NODE_ENV !== 'development',
         maxAge: tokenMaxAge,
      }

      const response = new NextResponse(
         JSON.stringify({
            status: 'success',
            token,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )

      await Promise.all([
         response.cookies.set(cookieOptions),
         response.cookies.set({
            name: 'logged-in',
            value: 'true',
            maxAge: tokenMaxAge,
         }),
      ])

      return response
   } catch (error: any) {
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
