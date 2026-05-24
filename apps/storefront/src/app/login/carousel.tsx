'use client'

import * as React from 'react'

const slides = [
  {
    title: 'Street-ready performance',
    description: 'Modern sneakers designed for everyday comfort and style.',
    image: '/images/air-jordan.jpg',
  },
  {
    title: 'Bold color options',
    description: 'Stand out with bright, modern colorways for any outfit.',
    image: '/images/IG8292_HM3_hover.avif',
  },
  {
    title: 'Premium comfort cushioning',
    description: 'Luxury materials and responsive soles for all-day wear.',
    image: '/images/BestNikeSneakerModelMain2.webp',
  },
]

export function LoginCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="relative z-20 flex h-full flex-col overflow-hidden">
      <img
        key={activeIndex}
        src={slides[activeIndex].image}
        alt={slides[activeIndex].title}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 opacity-100"
      />
      <div className="relative flex h-full flex-col justify-between bg-gradient-to-t from-black/40 via-black/10 to-transparent p-8 text-white">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
            Featured sneakers
          </span>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            {slides[activeIndex].title}
          </h2>
          <p className="max-w-xl text-sm text-white/75">
            {slides[activeIndex].description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  idx === activeIndex ? 'bg-white' : 'bg-white/30'
                }`}
                aria-label={`Show slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {slides.map((slide, idx) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`rounded-3xl border border-white/15 bg-white/10 p-3 text-left text-sm text-white transition hover:bg-white/15 ${
                  idx === activeIndex ? 'ring-2 ring-white/40' : 'opacity-80'
                }`}
              >
                <p className="font-semibold">{slide.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
