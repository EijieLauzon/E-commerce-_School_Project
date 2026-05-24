'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = React.useState('featured')

   useEffect(() => {
      if (isVariableValid(initialData)) setValue(initialData)
   }, [initialData])

   return (
      <Select
         onValueChange={(currentValue) => {
            const current = new URLSearchParams(
               Array.from(searchParams.entries())
            )

            if (currentValue === value) {
               current.delete('sort')
               setValue('')
            } else {
               current.set('sort', currentValue)
               setValue(currentValue)
            }

            // cast to string
            const search = current.toString()
            // or const query = `${'?'.repeat(search.length && 1)}${search}`;
            const query = search ? `?${search}` : ''

            router.replace(`${pathname}${query}`, {
               scroll: false,
            })
         }}
      >
         <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="most_expensive">Most Expensive</SelectItem>
            <SelectItem value="least_expensive">Least Expensive</SelectItem>
         </SelectContent>
      </Select>
   )
}

export function CategoriesCombobox({ categories, initialCategory }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')
   const [query, setQuery] = React.useState('')
   const filteredCategories = categories.filter((category) =>
      category.title.toLowerCase().includes(query.toLowerCase())
   )

   function getCategoryTitle() {
      for (const category of categories) {
         if (category.title === value) return category.title
      }
   }

   useEffect(() => {
      setValue(initialCategory)
   }, [initialCategory])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getCategoryTitle() : 'Select category...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[260px] p-2">
            <Input
               placeholder="Search category..."
               value={query}
               onChange={(event) => setQuery(event.target.value)}
               className="mb-2"
            />
            <div className="max-h-[280px] overflow-y-auto">
               {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                     <button
                        key={category.id}
                        type="button"
                        className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                           const current = new URLSearchParams(
                              Array.from(searchParams.entries())
                           )

                           if (category.title === value) {
                              current.delete('category')
                              setValue('')
                           } else {
                              current.set('category', category.title)
                              setValue(category.title)
                           }

                           // cast to string
                           const search = current.toString()
                           // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                           const query = search ? `?${search}` : ''

                           router.replace(`${pathname}${query}`, {
                              scroll: false,
                           })

                           setOpen(false)
                        }}
                     >
                        <Check
                           className={cn(
                              'mr-2 h-4 w-4',
                              value === category.title
                                 ? 'opacity-100'
                                 : 'opacity-0'
                           )}
                        />
                        {category.title}
                     </button>
                  ))
               ) : (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                     No category found.
                  </p>
               )}
            </div>
         </PopoverContent>
      </Popover>
   )
}

export function BrandCombobox({ brands, initialBrand }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')
   const [query, setQuery] = React.useState('')
   const filteredBrands = brands.filter((brand) =>
      brand.title.toLowerCase().includes(query.toLowerCase())
   )

   function getBrandTitle() {
      for (const brand of brands) {
         if (brand.title === value) return brand.title
      }
   }

   useEffect(() => {
      setValue(initialBrand)
   }, [initialBrand])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getBrandTitle() : 'Select brand...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[260px] p-2">
            <Input
               placeholder="Search brand..."
               value={query}
               onChange={(event) => setQuery(event.target.value)}
               className="mb-2"
            />
            <div className="max-h-[280px] overflow-y-auto">
               {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                     <button
                        key={brand.id}
                        type="button"
                        className="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                           const current = new URLSearchParams(
                              Array.from(searchParams.entries())
                           )

                           if (brand.title === value) {
                              current.delete('brand')
                              setValue('')
                           } else {
                              current.set('brand', brand.title)
                              setValue(brand.title)
                           }

                           // cast to string
                           const search = current.toString()
                           // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                           const query = search ? `?${search}` : ''

                           router.replace(`${pathname}${query}`, {
                              scroll: false,
                           })

                           setOpen(false)
                        }}
                     >
                        <Check
                           className={cn(
                              'mr-2 h-4',
                              value === brand.title
                                 ? 'opacity-100'
                                 : 'opacity-0'
                           )}
                        />
                        {brand.title}
                     </button>
                  ))
               ) : (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                     No brand found.
                  </p>
               )}
            </div>
         </PopoverContent>
      </Popover>
   )
}

export function AvailableToggle({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [value, setValue] = React.useState(false)

   useEffect(() => {
      setValue(initialData === 'true' ? true : false)
   }, [initialData])

   return (
      <div className="flex w-full border rounded-md items-center space-x-2">
         <div className="mx-auto flex gap-2 items-center">
            <Switch
               checked={value}
               onCheckedChange={(currentValue: boolean) => {
                  const current = new URLSearchParams(
                     Array.from(searchParams.entries())
                  )

                  current.set(
                     'isAvailable',
                     currentValue == true ? 'true' : 'false'
                  )
                  setValue(currentValue)

                  // cast to string
                  const search = current.toString()
                  // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                  const query = search ? `?${search}` : ''

                  router.replace(`${pathname}${query}`, {
                     scroll: false,
                  })
               }}
               id="available"
            />
            <Label htmlFor="available">Only Available</Label>
         </div>
      </div>
   )
}
