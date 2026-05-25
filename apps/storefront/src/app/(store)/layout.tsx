import Footer from '@/components/native/Footer'
import Header from '@/components/native/nav/parent'

// Store pages load product/blog/banner data from Prisma at request time.
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <>
         <Header />
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            {children}
         </div>
         <Footer />
      </>
   )
}
