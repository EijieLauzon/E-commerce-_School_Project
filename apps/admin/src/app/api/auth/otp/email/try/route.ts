import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import {
   allowDebugOtpWithoutSmtp,
   debugOtpResponse,
   isSmtpConfigured,
} from '@/lib/otp-delivery'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})
      const { email } = await req.json()

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }

      const normalizedEmail = email.toString().toLowerCase()

      await prisma.owner.upsert({
         where: { email: normalizedEmail },
         create: { email: normalizedEmail, OTP },
         update: { OTP },
      })

      if (!isSmtpConfigured()) {
         if (allowDebugOtpWithoutSmtp()) {
            console.warn(
               `[OTP] SMTP not configured; returning on-screen code for ${normalizedEmail}`
            )
            return debugOtpResponse({ email: normalizedEmail, OTP })
         }

         return getErrorResponse(
            500,
            'Email is not configured. Set MAIL_SMTP_USER and MAIL_SMTP_PASS in Vercel.'
         )
      }

      await sendMail({
         name: config.name,
         to: normalizedEmail,
         subject: 'Verify your email.',
         html: await render(Mail({ code: OTP, name: config.name })),
      })

      return new NextResponse(
         JSON.stringify({ status: 'success', email: normalizedEmail }),
         { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(
         500,
         error instanceof Error ? error.message : 'Unknown error'
      )
   }
}
