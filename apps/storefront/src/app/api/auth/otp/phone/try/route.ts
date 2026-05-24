import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { isPhoneNumberValid } from '@persepolis/regex'
import { sendTransactionalSMS } from '@persepolis/sms'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

function normalizePhoneNumber(phone: string) {
   let cleaned = phone.toString().trim().replace(/[^0-9+]/g, '')

   if (cleaned.startsWith('00')) {
      cleaned = `+${cleaned.slice(2)}`
   }

   if (cleaned.startsWith('+')) {
      return cleaned
   }

   if (/^0[0-9]{9,10}$/.test(cleaned)) {
      return `+63${cleaned.slice(1)}`
   }

   return cleaned
}

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const bodyText = await req.text()

      if (!bodyText) {
         return getErrorResponse(400, 'Request body is empty.')
      }

      const { phone } = JSON.parse(bodyText)

      if (!phone || typeof phone !== 'string') {
         return getErrorResponse(400, 'Phone number is required.')
      }

      if (!isPhoneNumberValid(phone)) {
         return getErrorResponse(400, 'Phone number is not valid.')
      }

      const normalizedPhone = normalizePhoneNumber(phone)

      await prisma.user.upsert({
         where: { phone: normalizedPhone },
         update: {
            OTP,
         },
         create: {
            phone: normalizedPhone,
            OTP,
         },
      })

      if (!process.env.SMS_API_KEY || !process.env.SMS_NUMBER) {
         if (process.env.NODE_ENV === 'development') {
            console.warn(
               'SMS provider is not configured. Returning debug OTP in development only.'
            )
            return new NextResponse(
               JSON.stringify({
                  status: 'success',
                  phone: normalizedPhone,
                  debugOTP: OTP,
                  warning:
                     'SMS provider is not configured. Using debug OTP in development.',
               }),
               {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
               }
            )
         }

         return getErrorResponse(
            500,
            'SMS provider is not configured. Set SMS_API_KEY and SMS_NUMBER in your .env.'
         )
      }

      await sendTransactionalSMS({
         Mobile: normalizedPhone,
         TemplateId: 100000,
         Parameters: [
            {
               name: 'Code',
               value: OTP,
            },
         ],
      })

      return new NextResponse(
         JSON.stringify({
            status: 'success',
            phone: normalizedPhone,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
