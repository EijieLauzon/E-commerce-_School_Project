'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Config from '@/config/site'
import { cn } from '@/lib/utils'
import { ViewIcon } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavEntry = {
   id: string
   title: string
}

export function MobileNav() {
   const [open, setOpen] = useState(false)
   const [categories, setCategories] = useState<NavEntry[]>([])
   const [brands, setBrands] = useState<NavEntry[]>([])

   useEffect(() => {
      async function loadNavigation() {
         const response = await fetch('/api/navigation', {
            cache: 'no-store',
         })

         if (!response.ok) return

         const data = await response.json()
         setCategories(data.categories ?? [])
         setBrands(data.brands ?? [])
      }

      loadNavigation()
   }, [])

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button
               variant="ghost"
               className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
               <ViewIcon className="h-5" />
               <span className="sr-only">Toggle Menu</span>
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="pr-0">
            <MobileLink
               href="/"
               className="flex items-center"
               onOpenChange={setOpen}
            >
               <div className="relative z-20 flex items-center text-lg font-medium">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="mr-2 h-6 w-6"
                  >
                     <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                  {Config.name}
               </div>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
               <div className="flex flex-col space-y-3">
                  <MobileLink href="/products" onOpenChange={setOpen}>
                     Products
                  </MobileLink>
               </div>
               <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-3 pt-6">
                     <h4 className="font-medium">Categories</h4>
                     {categories.map((category) => (
                        <MobileLink
                           key={category.id}
                           href={`/products?category=${encodeURIComponent(
                              category.title
                           )}`}
                           onOpenChange={setOpen}
                        >
                           {category.title}
                        </MobileLink>
                     ))}
                  </div>
                  <div className="flex flex-col space-y-3 pt-6">
                     <h4 className="font-medium">Brands</h4>
                     {brands.map((brand) => (
                        <MobileLink
                           key={brand.id}
                           href={`/products?brand=${encodeURIComponent(
                              brand.title
                           )}`}
                           onOpenChange={setOpen}
                        >
                           {brand.title}
                        </MobileLink>
                     ))}
                  </div>
               </div>
            </ScrollArea>
         </SheetContent>
      </Sheet>
   )
}

interface MobileLinkProps extends LinkProps {
   onOpenChange?: (open: boolean) => void
   children: React.ReactNode
   className?: string
}

function MobileLink({
   href,
   onOpenChange,
   className,
   children,
   ...props
}: MobileLinkProps) {
   const router = useRouter()
   return (
      <Link
         href={href}
         onClick={() => {
            router.push(href.toString())
            onOpenChange?.(false)
         }}
         className={cn(className)}
         {...props}
      >
         {children}
      </Link>
   )
}
