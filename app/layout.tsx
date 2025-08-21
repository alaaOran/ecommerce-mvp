import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StyleHub - Premium Clothing Store',
  description: 'Discover the latest fashion trends with StyleHub. Shop premium clothing, shoes, and accessories with fast shipping and easy returns.',
  keywords: 'fashion, clothing, style, apparel, online shopping',
  openGraph: {
    title: 'StyleHub - Premium Clothing Store',
    description: 'Discover the latest fashion trends with StyleHub',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}