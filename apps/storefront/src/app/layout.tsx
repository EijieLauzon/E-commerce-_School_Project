import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = process.env.NEXT_PUBLIC_URL

export const metadata = {
   metadataBase: siteUrl ? new URL(siteUrl) : undefined,
   title: "Grayant's Kicks",
   description: 'Premium sneaker store',
   keywords: ['Sneakers', 'Kicks', 'Streetwear', 'Shoes'],
   authors: [{ name: "Grayant's Kicks" }],
   creator: "Grayant's Kicks",
   publisher: "Grayant's Kicks",
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
               <ToastProvider />
               <ModalProvider />
               {children}
            </ThemeProvider>
         </body>
      </html>
   )
}
