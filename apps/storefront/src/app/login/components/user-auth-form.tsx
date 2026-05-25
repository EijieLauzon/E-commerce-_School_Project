'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, isVariableValid } from '@/lib/utils'
import { isEmailValid, isPhoneNumberValid } from '@persepolis/regex'
import { Loader, MailIcon, SmartphoneIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const [fetchedOTP, setFetchedOTP] = React.useState<boolean>(false)
   const [debugOTP, setDebugOTP] = React.useState<string | null>(null)
   const [error, setError] = React.useState<string | null>(null)

   return (
      <div className={cn('grid gap-6', className)} {...props}>
         {fetchedOTP ? (
            <VerifyComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
            />
         ) : (
            <TryComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               setFetchedOTP={setFetchedOTP}
               setDebugOTP={setDebugOTP}
               setError={setError}
            />
         )}
         {debugOTP && (
            <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
               Your login code: <strong className="text-lg">{debugOTP}</strong>
               <span className="mt-1 block text-xs text-amber-200/80">
                  Email is not configured yet — enter this code below.
               </span>
            </p>
         )}
         {error && <p className="text-sm text-red-700">{error}</p>}
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
               </span>
            </div>
         </div>
         <ChangeMethodButton isLoading={isLoading} />
      </div>
   )
}

function ChangeMethodButton({ isLoading }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const method = searchParams.get('method')

   function changeMethod() {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('method', method == 'phone' ? 'email' : 'phone')
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   if (method === 'phone')
      return (
         <Button onClick={changeMethod} disabled={isLoading} type="button">
            {isLoading ? (
               <Loader className="mr-2 h-4 animate-spin" />
            ) : (
               <MailIcon className="mr-2 h-4" />
            )}
            Email
         </Button>
      )

   return (
      <Button onClick={changeMethod} disabled={isLoading} type="button">
         {isLoading ? (
            <Loader className="mr-2 h-4 animate-spin" />
         ) : (
            <SmartphoneIcon className="mr-2 h-4" />
         )}
         Phone Number
      </Button>
   )
}

function TryComponents({ isLoading, setIsLoading, setFetchedOTP, setDebugOTP, setError }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const method = searchParams.get('method')
   const email = searchParams.get('email')
   const phone = searchParams.get('phone')

   const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('email', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('phone', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   async function onSubmitEmail() {
      try {
         setIsLoading(true)
         setError(null)
         setDebugOTP(null)

         const response = await fetch('/api/auth/otp/email/try', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            cache: 'no-store',
         })

         const data = await response.json().catch(() => null)

         if (response.ok) {
            if (data?.debugOTP) {
               setDebugOTP(data.debugOTP)
            }
            setFetchedOTP(true)
         } else {
            setError(data?.message ?? 'Could not send the login code.')
         }
      } catch (error) {
         console.error({ error })
         setError('Could not send the login code.')
      } finally {
         setIsLoading(false)
      }
   }

   async function onSubmitPhone() {
      try {
         setIsLoading(true)
         setError(null)
         setDebugOTP(null)

         const response = await fetch('/api/auth/otp/phone/try', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
            cache: 'no-store',
         })

         const data = await response.json().catch(() => null)

         if (response.ok) {
            if (data?.debugOTP) {
               setDebugOTP(data.debugOTP)
            }
            setFetchedOTP(true)
         } else {
            setError(data?.message ?? 'Could not send the login code.')
         }
      } catch (error) {
         console.error({ error })
         setError('Could not send the login code.')
      } finally {
         setIsLoading(false)
      }
   }

   if (method === 'phone')
      return (
         <>
            <div className="grid gap-1">
               <Label
                  className="text-sm font-light text-foreground/60"
                  htmlFor="email"
               >
                  Phone
               </Label>
               <Input
                  id="phone"
                  placeholder="+639695580415"
                  type="phone"
                  autoCapitalize="none"
                  autoComplete="phone"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={handlePhoneChange}
                  required
               />
               {isVariableValid(phone) && !isPhoneNumberValid(phone) && (
                  <p className="mt-2 text-sm text-red-700">
                     Phone Number is not valid.
                  </p>
               )}
            </div>
            <Button
               onClick={onSubmitPhone}
               disabled={isLoading || !isPhoneNumberValid(phone)}
            >
               {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
               Login with Phone
            </Button>
         </>
      )

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="email"
            >
               Email
            </Label>
            <Input
               id="email"
               placeholder="name@example.com"
               type="email"
               autoCapitalize="none"
               autoComplete="email"
               autoCorrect="off"
               disabled={isLoading}
               onChange={handleEmailChange}
               required
            />
         </div>
         <Button
            onClick={onSubmitEmail}
            disabled={isLoading || !isEmailValid(email)}
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Login with Email
         </Button>
      </>
   )
}

function VerifyComponents({ isLoading, setIsLoading }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const method = searchParams.get('method')
   const email = searchParams.get('email')
   const phone = searchParams.get('phone')
   const OTP = searchParams.get('OTP')

   const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('OTP', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   async function onVerifyOTP() {
      try {
         setIsLoading(true)

         const response = await fetch(
            method === 'phone'
               ? '/api/auth/otp/phone/verify'
               : '/api/auth/otp/email/verify',
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  email,
                  phone,
                  OTP,
               }),
               cache: 'no-store',
            }
         )

         if (response.ok) {
            window.location.assign(`/`)
         }
      } catch (error) {
         console.error({ error })
      }
   }

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="email"
            >
               One-Time Password
            </Label>
            <Input
               placeholder="12345"
               disabled={isLoading}
               onChange={handleOTPChange}
               required
            />
         </div>
         <Button onClick={onVerifyOTP} disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Submit
         </Button>
      </>
   )
}
