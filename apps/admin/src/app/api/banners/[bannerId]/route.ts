import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { bannerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.bannerId) {
         return new NextResponse('Banner id is required', { status: 400 })
      }

      const banner = await prisma.banner.findUnique({
         where: {
            id: params.bannerId,
         },
      })

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNER_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { bannerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.bannerId) {
         return new NextResponse('Banner id is required', { status: 400 })
      }

      const banner = await prisma.banner.delete({
         where: {
            id: params.bannerId,
         },
      })

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNER_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { bannerId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.bannerId) {
         return new NextResponse('Banner id is required', { status: 400 })
      }

      const { label, image } = await req.json()

      if (!label) {
         return new NextResponse('Label is required', { status: 400 })
      }

      if (!image) {
         return new NextResponse('Image is required', { status: 400 })
      }

      const banner = await prisma.banner.update({
         where: {
            id: params.bannerId,
         },
         data: {
            label,
            image,
         },
      })

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNER_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
