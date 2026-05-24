'use client'

import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export default function Carousel({ images }: { images: string[] }) {
   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
      Autoplay({ delay: 4500, stopOnInteraction: false }),
   ])

   const [selectedIndex, setSelectedIndex] = useState(0)

   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
   const scrollTo = useCallback(
      (index: number) => emblaApi?.scrollTo(index),
      [emblaApi]
   )

   useEffect(() => {
      function selectHandler() {
         const index = emblaApi?.selectedScrollSnap()
         setSelectedIndex(index || 0)
      }

      selectHandler()
      emblaApi?.on('select', selectHandler)

      return () => {
         emblaApi?.off('select', selectHandler)
      }
   }, [emblaApi])

   if (!images?.length) return null

   return (
      <section className="relative">
         <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex">
               {images.map((src, i) => (
                  <div className="relative h-96 flex-[0_0_100%]" key={i}>
                     <Image
                        src={src}
                        fill
                        sizes="(min-width: 1024px) 80vw, 100vw"
                        priority={i === 0}
                        className="object-cover"
                        alt="Featured sneaker banner"
                     />
                  </div>
               ))}
            </div>
         </div>
         {images.length > 1 && (
            <>
               <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
               >
                  <ChevronLeftIcon className="h-5" />
               </button>
               <button
                  type="button"
                  aria-label="Next slide"
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
               >
                  <ChevronRightIcon className="h-5" />
               </button>
               <Dots
                  itemsLength={images.length}
                  selectedIndex={selectedIndex}
                  onSelect={scrollTo}
               />
            </>
         )}
      </section>
   )
}

type Props = {
   itemsLength: number
   selectedIndex: number
   onSelect: (index: number) => void
}
const Dots = ({ itemsLength, selectedIndex, onSelect }: Props) => {
   const arr = new Array(itemsLength).fill(0)
   return (
      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2">
         {arr.map((_, index) => {
            const selected = index === selectedIndex
            return (
               <button
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => onSelect(index)}
                  className={cn({
                     'h-2.5 w-2.5 rounded-full bg-white transition-all duration-300':
                        true,
                     'w-8': selected,
                     'opacity-50': !selected,
                  })}
                  key={index}
               />
            )
         })}
      </div>
   )
}
