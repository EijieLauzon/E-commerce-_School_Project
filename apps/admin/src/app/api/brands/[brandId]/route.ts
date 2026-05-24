import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { brandId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.brandId) {
         return new NextResponse('Brand id is required', { status: 400 })
      }

      const brand = await prisma.brand.findUnique({
         where: {
            id: params.brandId,
         },
      })

      return NextResponse.json(brand)
   } catch (error) {
      console.error('[BRAND_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { brandId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.brandId) {
         return new NextResponse('Brand id is required', { status: 400 })
      }

      const brand = await prisma.brand.delete({
         where: {
            id: params.brandId,
         },
      })

      return NextResponse.json(brand)
   } catch (error) {
      console.error('[BRAND_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { brandId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { title, description, logo } = body

      if (!title && !description && !logo) {
         return new NextResponse(
            'At least one field is required',
            { status: 400 }
         )
      }

      if (!params.brandId) {
         return new NextResponse('Brand id is required', { status: 400 })
      }

      const updatedBrand = await prisma.brand.update({
         where: {
            id: params.brandId,
         },
         data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(logo && { logo }),
         },
      })

      return NextResponse.json(updatedBrand)
   } catch (error) {
      console.error('[BRAND_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
