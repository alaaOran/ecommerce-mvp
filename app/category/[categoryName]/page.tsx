'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formattedCategoryName = Array.isArray(categoryName)
    ? categoryName[0].replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : categoryName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  useEffect(() => {
    if (categoryName) {
      const fetchProducts = async () => {
        try {
          setLoading(true)
          setError(null)
          const res = await fetch(`/api/products?category=${categoryName}`)
          if (!res.ok) {
            throw new Error('Failed to fetch products for this category')
          }
          const data = await res.json()
          setProducts(data.products)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    }
  }, [categoryName])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading {formattedCategoryName}...</h1>
            <p className="text-gray-600">Fetching the latest styles for you.</p>
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
            <p>Could not load products for this category. Please try again later.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-black hover:underline">
              <ArrowLeft size={16} className="mr-2" /> Back to Home
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
              {formattedCategoryName}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of {formattedCategoryName.toLowerCase()} and find your perfect style.
            </p>
          </motion.div>

          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No products found in this category yet.</p>
              <Link href="/" className="mt-6 inline-flex items-center text-black hover:underline">
                <ArrowLeft size={16} className="mr-2" /> Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
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

export default CategoryPage