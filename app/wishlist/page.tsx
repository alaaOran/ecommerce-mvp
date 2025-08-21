'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { HeartCrack, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  title: string
  price: number
  comparePrice?: number
  images: { url: string; alt: string }[]
  category: string
  sizes: { size: string; stock: number }[]
  colors: string[]
}

const WishlistPage = () => {
  const { user, loading: authLoading } = useAuth()
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWishlist = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/user/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to fetch wishlist')
      }
      const data = await res.json()
      setWishlistProducts(data.wishlist || [])
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to load wishlist.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchWishlist()
    }
  }, [user, authLoading])

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please log in to manage your wishlist.')
      return
    }
    try {
      const res = await fetch(`/api/user/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to remove from wishlist')
      }
      
      // Update the wishlist with the response data
      setWishlistProducts(data.wishlist || [])
      toast.success('Product removed from wishlist!')
      fetchWishlist() // Re-fetch wishlist to update UI
    } catch (err: any) {
      toast.error('Failed to remove product from wishlist.')
      console.error('Remove from wishlist error:', err)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Wishlist...</h1>
            <p className="text-gray-600">Gathering your favorite items.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center text-red-500">
            <h1 className="text-2xl font-bold mb-4">Error: {error}</h1>
            <p>Could not load your wishlist. Please try again later.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-black hover:underline">
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center text-gray-600">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">Please log in to view your wishlist.</p>
            <Link href="/login" className="text-black hover:underline font-medium">
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Wishlist
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A collection of your most desired items.
            </p>
          </motion.div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-10">
              <HeartCrack size={64} className="mx-auto text-gray-400 mb-6" />
              <p className="text-xl text-gray-600">Your wishlist is empty.</p>
              <p className="text-gray-500 mt-2">Start adding products you love!</p>
              <Link href="/" className="mt-6 inline-flex items-center text-black hover:underline">
                <ArrowLeft size={16} className="mr-2" /> Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                >
                  <ProductCard product={product} onWishlistToggle={handleRemoveFromWishlist} isWishlistedInitially={true} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default WishlistPage