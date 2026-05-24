'use client'

import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { forwardRef, useEffect, useState } from 'react'

type NavEntry = {
   id: string
   title: string
   description: string | null
}

export function MainNav() {
   return (
      <div className="hidden md:flex gap-4">
         <Link href="/" className="flex items-center">
            <span className="hidden font-medium sm:inline-block">
               {config.name}
            </span>
         </Link>
         <NavMenu />
      </div>
   )
}

export function NavMenu() {
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
      <NavigationMenu>
         <NavigationMenuList>
            <NavigationMenuItem>
               <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <div className="font-normal text-foreground/70">
                        Products
                     </div>
                  </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">
                     Categories
                  </div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[520px] lg:w-[640px] lg:grid-cols-[.85fr_1fr]">
                     <li className="row-span-4">
                        <NavigationMenuLink asChild>
                           <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-primary p-6 text-primary-foreground no-underline outline-none focus:shadow-md"
                              href="/products"
                           >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                 Shop by Category
                              </div>
                              <p className="text-sm leading-tight text-primary-foreground/85">
                                 Find the right pair by sport, lifestyle, or
                                 limited sneaker drops.
                              </p>
                           </Link>
                        </NavigationMenuLink>
                     </li>
                     {categories.length > 0 ? (
                        categories.map((category) => (
                           <ListItem
                              key={category.id}
                              href={`/products?category=${encodeURIComponent(
                                 category.title
                              )}`}
                              title={category.title}
                           >
                              {category.description ??
                                 `Shop ${category.title.toLowerCase()}.`}
                           </ListItem>
                        ))
                     ) : (
                        <ListItem href="/products" title="All Categories">
                           Browse the full Grayant's Kicks catalog.
                        </ListItem>
                     )}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">Brands</div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                     {brands.length > 0 ? (
                        brands.map((brand) => (
                           <ListItem
                              key={brand.id}
                              title={brand.title}
                              href={`/products?brand=${encodeURIComponent(
                                 brand.title
                              )}`}
                           >
                              {brand.description ??
                                 `Shop ${brand.title} sneakers.`}
                           </ListItem>
                        ))
                     ) : (
                        <ListItem href="/products" title="All Brands">
                           Browse every brand in the catalog.
                        </ListItem>
                     )}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
         </NavigationMenuList>
      </NavigationMenu>
   )
}

const ListItem = forwardRef<
   React.ElementRef<'a'>,
   React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <Link
               href={href}
               ref={ref}
               className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  className
               )}
               {...props}
            >
               <div className="text-sm font-medium leading-none">{title}</div>
               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
})

ListItem.displayName = 'ListItem'
