'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext' // Import useAuth
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface Product {
  slug?: string
  _id: string
  title: string
  price: number
  comparePrice?: number
  images: { url: string; alt: string }[]
  category: string
  sizes: { size: string; stock: number }[]
  colors: string[]
}

interface ProductCardProps {
  product: Product
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void // Optional callback for parent
  isWishlistedInitially?: boolean // Prop to set initial wishlist state
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onWishlistToggle, isWishlistedInitially = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitially)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [adding, setAdding] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth() // Get user from AuthContext

  useEffect(() => {
    setIsWishlisted(isWishlistedInitially);
  }, [isWishlistedInitially]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size.')
      return
    }

    const size = product.sizes.find(s => s.size === selectedSize)
    if (!size || size.stock === 0) {
      toast.error('Selected size is out of stock.')
      return
    }

    setAdding(true)
    addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0]?.url || '/placeholder-product.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      stock: size.stock
    })
    toast.success(`${product.title} added to cart!`)
    // keep spinner very short for perceived instant feedback
    setTimeout(() => setAdding(false), 300)
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigating to product page
    e.stopPropagation() // Stop event bubbling

    if (!user) {
      toast.error('Please log in to add items to your wishlist.')
      return
    }

    try {
      const next = !isWishlisted
      // optimistic update
      setIsWishlisted(next)
      setWishLoading(true)
      const method = !next ? 'DELETE' : 'POST'
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
      toast.success(next ? 'Added to wishlist!' : 'Removed from wishlist!')
      setWishLoading(false)
      onWishlistToggle?.(product._id, !isWishlisted) // Notify parent if callback exists
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      // revert optimistic update
      setIsWishlisted(prev => !prev)
      setWishLoading(false)
      toast.error(`Failed to ${isWishlisted ? 'remove from' : 'add to'} wishlist.`)
    }
  }

  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        <Link prefetch href={product.slug ? `/product/slug/${encodeURIComponent(product.slug)}` : `/product/${product._id}`}>
          <Image
            src={product.images[0]?.url || '/placeholder-product.jpg'}
            alt={product.images[0]?.alt || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishLoading}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-70"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-busy={wishLoading || undefined}
        >
          {wishLoading ? (
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
              aria-hidden
            />
          ) : (
            <Heart 
              size={18} 
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
            />
          )}
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center space-y-3">
            {/* Size selection */}
            <div className="flex justify-center gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  disabled={size.stock === 0}
                  className={`w-8 h-8 text-sm rounded border ${
                    selectedSize === size.size
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                  } ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
                >
                  {size.size}
                </button>
              ))}
            </div>

            <Button
              onClick={handleAddToCart}
              className="bg-white text-black hover:bg-gray-100"
              size="sm"
              isLoading={adding}
            >
              <ShoppingBag size={16} className="mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Link prefetch href={product.slug ? `/product/slug/${encodeURIComponent(product.slug)}` : `/product/${product._id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 4).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        )}

        {/* Sizes */}
        <div className="text-sm text-gray-600">
          Sizes: {product.sizes.map(s => s.size).join(', ')}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard