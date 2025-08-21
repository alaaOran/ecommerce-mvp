'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="py-16 px-4 bg-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Ahead of the Trends
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Be the first to know about new arrivals, exclusive offers, and style inspiration
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-white text-black hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            Join 50,000+ fashion enthusiasts. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter