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

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const bodyText = await req.text()

      if (!bodyText) {
         return getErrorResponse(400, 'Request body is empty.')
      }

      const { email } = JSON.parse(bodyText)

      const smtpUser = process.env.MAIL_SMTP_USER
      const smtpPass = process.env.MAIL_SMTP_PASS
      const smtpPlaceholder =
         smtpUser?.includes('your-email') || smtpPass?.includes('app-password')

      if (!smtpUser || !smtpPass || smtpPlaceholder) {
         if (process.env.NODE_ENV === 'development') {
            console.warn(
               'SMTP credentials are missing or placeholder values. Returning debug OTP in development only.'
            )

            await prisma.user.upsert({
               where: { email: email.toString().toLowerCase() },
               update: { OTP },
               create: {
                  email: email.toString().toLowerCase(),
                  OTP,
               },
            })

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

         return getErrorResponse(
            500,
            'Missing or placeholder SMTP credentials. Set MAIL_SMTP_USER and MAIL_SMTP_PASS in your .env.'
         )
      }

      if (isEmailValid(email)) {
         await prisma.user.upsert({
            where: { email: email.toString().toLowerCase() },
            update: {
               OTP,
            },
            create: {
               email: email.toString().toLowerCase(),
               OTP,
            },
         })

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

      if (error instanceof Error && error.message.includes('Username and Password not accepted')) {
         return getErrorResponse(
            500,
            'SMTP authentication failed. Verify your Gmail account is using an app password and that MAIL_SMTP_USER / MAIL_SMTP_PASS are correct.'
         )
      }

      return getErrorResponse(500, error instanceof Error ? error.message : 'Unknown error')
   }
}
