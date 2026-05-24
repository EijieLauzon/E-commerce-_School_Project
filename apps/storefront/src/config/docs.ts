import { NavItem } from '@/types/nav'

interface DocsConfig {
   mainNav: NavItem[]
   sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
   mainNav: [
      {
         title: 'Products',
         href: '/products',
      },
   ],
   sidebarNav: [
      {
         title: 'Home',
         href: '/',
      },
      {
         title: 'Products',
         href: '/products',
      },
      {
         title: 'Blog',
         href: '/blog',
      },
      {
         title: 'Orders',
         href: '/profile/orders',
      },
      {
         title: 'Wishlist',
         href: '/wishlist',
      },
      {
         title: 'Cart',
         href: '/cart',
      },
      {
         title: 'Profile',
         href: '/profile/edit',
      },
      {
         title: 'Privacy Policy',
         href: '/privacy',
      },
   ],
}
