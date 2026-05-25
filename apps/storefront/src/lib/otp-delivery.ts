import { NextResponse } from 'next/server'

export function isSmtpConfigured(): boolean {
   const user = process.env.MAIL_SMTP_USER?.trim()
   const pass = process.env.MAIL_SMTP_PASS?.trim()

   if (!user || !pass) return false
   if (user.includes('your-email') || pass.includes('app-password')) return false

   return true
}

/** Show login code on screen when email is not set up (unless explicitly disabled). */
export function allowDebugOtpWithoutSmtp(): boolean {
   if (isSmtpConfigured()) return false
   return process.env.ALLOW_DEBUG_OTP !== 'false'
}

export function isSmsConfigured(): boolean {
   return Boolean(process.env.SMS_API_KEY?.trim() && process.env.SMS_NUMBER?.trim())
}

export function allowDebugOtpWithoutSms(): boolean {
   if (isSmsConfigured()) return false
   return process.env.ALLOW_DEBUG_OTP !== 'false'
}

export function debugOtpResponse(payload: {
   email?: string
   phone?: string
   OTP: string
}) {
   return new NextResponse(
      JSON.stringify({
         status: 'success',
         ...(payload.email ? { email: payload.email } : {}),
         ...(payload.phone ? { phone: payload.phone } : {}),
         debugOTP: payload.OTP,
         warning:
            'Email/SMS is not configured. Use the login code shown below.',
      }),
      {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      }
   )
}
