import nodemailer from 'nodemailer'
import type { TransportOptions, Transport } from 'nodemailer'

const host = process.env.MAIL_SMTP_HOST
const port = process.env.MAIL_SMTP_PORT
const user = process.env.MAIL_SMTP_USER
const pass = process.env.MAIL_SMTP_PASS
const secure = process.env.MAIL_SMTP_SECURE
const tls = process.env.MAIL_SMTP_TLS_REJECT_UNAUTHORIZED
const cipher = process.env.MAIL_SMTP_TLS_CIPHER
const service = process.env.MAIL_SMTP_SERVICE
const verbose = process.env.MAIL_SMTP_VERBOSE

export default async function getTransporter() {
   const options: TransportOptions | Transport<unknown> = {}

   if (host) {
      options.host = host
   }

   if (port) {
      options.port = Number(port)
   }

   if (secure !== undefined) {
      options.secure = secure === 'true'
   }

   if (user || pass) {
      options.auth = {
         user: user || undefined,
         pass: pass || undefined,
      }
   }

   if (tls || cipher) {
      options.tls = {}
      if (tls) {
         options.tls.rejectUnauthorized = tls === 'true'
      }
      if (cipher) {
         options.tls.ciphers = cipher
      }
   }

   if (service) {
      options.service = service
   }

   const isGmail =
      (service && service.toLowerCase().includes('gmail')) ||
      (host && host.toLowerCase().includes('gmail.com'))

   if (isGmail) {
      options.authMethod = 'LOGIN'
      options.requireTLS = true
      options.tls = {
         ...(options.tls || {}),
         rejectUnauthorized:
            options.tls?.rejectUnauthorized !== undefined
               ? options.tls.rejectUnauthorized
               : true,
      }
      if (!options.port) {
         options.port = 465
      }
      if (options.port === 465) {
         options.secure = true
      } else if (options.port === 587) {
         options.secure = false
      }
   }

   if (!options.host && !options.service) {
      throw new Error('Missing MAIL_SMTP_HOST or MAIL_SMTP_SERVICE in environment.')
   }

   if (!options.auth?.user || !options.auth?.pass) {
      throw new Error('Missing MAIL_SMTP_USER or MAIL_SMTP_PASS in environment.')
   }

   if (verbose === 'true') {
      console.log({ options })
   }

   return nodemailer.createTransport(options)
}
