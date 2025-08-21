'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const CartPage = () => {
  const { state, updateQuantity, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    setIsUpdating(id)
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call
    updateQuantity(id, newQuantity)
    setIsUpdating(null)
  }

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(id)
    await new Promise(resolve => setTimeout(resolve, 300))
    removeItem(id)
    setIsUpdating(null)
  }

  const shipping = state.total > 100 ? 0 : 9.99
  const tax = state.total * 0.08
  const finalTotal = state.total + shipping + tax

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link href="/">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-black">
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
          <div className="flex-1" />
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart ({state.itemCount})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-lg p-6 shadow-sm border"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Size: <strong>{item.size}</strong></span>
                          <span>Color: <strong className="capitalize">{item.color}</strong></span>
                        </div>
                        <div className="text-lg font-bold">{formatPrice(item.price)}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating === item.id}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">
                              {isUpdating === item.id ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock || isUpdating === item.id}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({item.stock} available)
                          </span>
                        </div>

                        <div className="text-lg font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <hr className="border-gray-300" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-800">
                    Add {formatPrice(100 - state.total)} more for free shipping!
                  </p>
                </div>
              )}

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CartPage