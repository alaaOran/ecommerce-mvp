'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Heart, Minus, Plus, ArrowLeft } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext' // Import useAuth
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  comparePrice?: number
  images: { url: string; alt: string }[]
  category: string
  subcategory: string
  brand: string
  sizes: { size: string; stock: number }[]
  colors: string[]
  ratings: {
    average: number
    count: number
  }
}

const ProductDetailsPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addItem } = useCart()
  const { user } = useAuth() // Get user from AuthContext

  useEffect(() => {
    if (id) {
      const fetchProductAndWishlist = async () => {
        try {
          setLoading(true)
          // Fetch product details
          const res = await fetch(`/api/products/${id}`)
          if (!res.ok) {
            throw new Error('Failed to fetch product')
          }
          const data: Product = await res.json()
          setProduct(data)
          setSelectedColor(data.colors[0] || '')
          setSelectedSize(data.sizes.find(s => s.stock > 0)?.size || '')

          // Check if product is in wishlist if user is logged in
          if (user) {
            const wishlistRes = await fetch('/api/user/wishlist', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
            if (wishlistRes.ok) {
              const wishlistData = await wishlistRes.json()
              setIsWishlisted(wishlistData.wishlist.some((item: Product) => item._id === data._id))
            }
          }
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchProductAndWishlist()
    }
  }, [id, user]) // Re-fetch if user changes (login/logout)

  const handleAddToCart = () => {
    if (!product) return

    if (!selectedSize) {
      toast.error('Please select a size.')
      return
    }
    if (!selectedColor) {
      toast.error('Please select a color.')
      return
    }

    const sizeInfo = product.sizes.find(s => s.size === selectedSize)
    if (!sizeInfo || sizeInfo.stock < quantity) {
      toast.error(`Not enough stock for selected size. Available: ${sizeInfo?.stock || 0}`)
      return
    }

    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0]?.url || '/placeholder-product.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      stock: sizeInfo.stock,
    })
    toast.success(`${quantity} x ${product.title} added to cart!`)
  }

  const handleWishlistToggle = async () => {
    if (!product) return

    if (!user) {
      toast.error('Please log in to add items to your wishlist.')
      return
    }

    try {
      const method = isWishlisted ? 'DELETE' : 'POST'
      const res = await fetch(`/api/user/wishlist/${product._id}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!res.ok) {
        throw new Error(`Failed to ${isWishlisted ? 'remove from' : 'add to'} wishlist`)
      }

      setIsWishlisted(prev => !prev)
      toast.success(isWishlisted ? 'Removed from wishlist!' : 'Added to wishlist!')
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      toast.error(`Failed to ${isWishlisted ? 'remove from' : 'add to'} wishlist.`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 w-full">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
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
            <p>Could not load product details. Please try again later.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-black hover:underline">
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center text-gray-600">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p>The product you are looking for does not exist.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-black hover:underline">
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const currentStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href={`/category/${product.category}`} className="flex items-center text-gray-600 hover:text-black mb-6">
            <ArrowLeft size={20} className="mr-2" /> Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                <Image
                  src={product.images[0]?.url || '/placeholder-product.jpg'}
                  alt={product.images[0]?.alt || product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 4).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-gray-600 text-lg">{product.brand} - {product.subcategory}</p>

              {/* Price & Ratings */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-black">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(product.ratings.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span>({product.ratings.count} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((sizeOption) => (
                    <Button
                      key={sizeOption.size}
                      variant={selectedSize === sizeOption.size ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(sizeOption.size)}
                      disabled={sizeOption.stock === 0}
                      className={sizeOption.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {sizeOption.size} {sizeOption.stock === 0 && '(Out of Stock)'}
                    </Button>
                  ))}
                </div>
                {selectedSize && currentStock > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {currentStock} items in stock for {selectedSize}
                  </p>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Color:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => setSelectedColor(colorOption)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === colorOption ? 'border-gray-800 ring-2 ring-gray-800' : 'border-gray-300'
                      } transition-all duration-200`}
                      style={{ backgroundColor: colorOption.toLowerCase() }}
                      title={colorOption}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
                <div className="flex items-center border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium min-w-[4rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(prev + 1, currentStock))}
                    disabled={quantity >= currentStock}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                  disabled={currentStock === 0 || !selectedSize || !selectedColor}
                >
                  <ShoppingBag size={20} className="mr-2" />
                  {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    size={20}
                    className={`mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                  />
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetailsPage