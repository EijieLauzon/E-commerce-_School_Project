import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { email } = await req.json()

      const smtpUser = process.env.MAIL_SMTP_USER
      const smtpPass = process.env.MAIL_SMTP_PASS
      const smtpPlaceholder =
         smtpUser?.includes('your-email') || smtpPass?.includes('app-password')

      if (isEmailValid(email)) {
         await prisma.owner.upsert({
            where: { email: email.toString().toLowerCase() },
            create: {
               email: email.toString().toLowerCase(),
               OTP,
            },
            update: {
               OTP,
            },
         })

         if (
            process.env.NODE_ENV === 'development' ||
            !smtpUser ||
            !smtpPass ||
            smtpPlaceholder
         ) {
            console.warn(
               'Admin SMTP is not configured properly. Returning debug OTP in development only.'
            )
            if (process.env.NODE_ENV !== 'development') {
               return getErrorResponse(
                  500,
                  'Missing or placeholder SMTP credentials. Set MAIL_SMTP_USER and MAIL_SMTP_PASS in your .env.'
               )
            }

            if (process.env.NODE_ENV === 'development') {
               console.log(`Admin login OTP for ${email}: ${OTP}`)
            }

            return new NextResponse(
               JSON.stringify({
                  status: 'success',
                  email,
                  debugOTP: OTP,
                  warning:
                     'SMTP provider is not configured properly. Using debug OTP in development.',
               }),
               {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
               }
            )
         }

         await sendMail({
            name: config.name,
            to: email,
            subject: 'Verify your email.',
            html: await render(Mail({ code: OTP, name: config.name })),
         })

         return new NextResponse(
            JSON.stringify({
               status: 'success',
               email,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
