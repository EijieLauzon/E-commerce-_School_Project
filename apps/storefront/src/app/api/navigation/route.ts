import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
   try {
      const [categories, brands] = await Promise.all([
         prisma.category.findMany({
            orderBy: {
               title: 'asc',
            },
            select: {
               id: true,
               title: true,
               description: true,
            },
         }),
         prisma.brand.findMany({
            orderBy: {
               title: 'asc',
            },
            select: {
               id: true,
               title: true,
               description: true,
            },
         }),
      ])

      return NextResponse.json({ categories, brands })
   } catch (error) {
      console.error('[NAVIGATION_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
