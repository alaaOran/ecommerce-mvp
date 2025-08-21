'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Image from 'next/image'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to our streetwear updates! 👕')
      setEmail('')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Streetwear Redefined
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Join our community of trendsetters. Get exclusive access to limited drops, style guides, and members-only content.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto lg:mx-0">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-12 px-6 rounded-full font-medium bg-white text-black hover:bg-gray-200 transition-all"
                  isLoading={isLoading}
                >
                  Join Now
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Join 50,000+ streetwear enthusiasts. Unsubscribe anytime.
              </p>
            </form>
          </motion.div>

          {/* Right Column - Image Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80"
                alt="Streetwear model in oversized hoodie and baggy jeans"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl -mt-8 bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                alt="Urban street style with oversized jacket and cargo pants"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl -mt-8 bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1520367745676-56196632073f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                alt="Streetwear model in oversized t-shirt and baggy pants"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                alt="Urban street style with oversized denim jacket and baggy pants"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>
    </section>
  )
}

export default Newsletter