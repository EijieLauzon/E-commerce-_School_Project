import { NextResponse } from 'next/server'

export function isSmtpConfigured(): boolean {
   const user = process.env.MAIL_SMTP_USER?.trim()
   const pass = process.env.MAIL_SMTP_PASS?.trim()

   if (!user || !pass) return false
   if (user.includes('your-email') || pass.includes('app-password')) return false

   return true
}

export function allowDebugOtpWithoutSmtp(): boolean {
   if (isSmtpConfigured()) return false
   return process.env.ALLOW_DEBUG_OTP !== 'false'
}

export function debugOtpResponse(payload: { email: string; OTP: string }) {
   return new NextResponse(
      JSON.stringify({
         status: 'success',
         email: payload.email,
         debugOTP: payload.OTP,
         warning:
            'Email is not configured. Use the login code shown below.',
      }),
      {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      }
   )
}
