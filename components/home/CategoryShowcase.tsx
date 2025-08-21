'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

const CategoryShowcase = () => {
  const categories = [
    {
      name: 'T-Shirts',
      href: '/category/t-shirts',
      image: '/category/tshirts.jpg',
      description: 'Comfort & Style'
    },
    {
      name: 'Joggers',
      href: '/category/joggers',
      image: '/category/joggers.jpg',
      description: 'Relaxed Fit'
    },
    {
      name: 'Hoodies',
      href: '/category/hoodies',
      image: '/category/hoodies.jpg',
      description: 'Warm & Trendy'
    },
    {
      name: 'Shoes',
      href: '/category/shoes',
      image: '/category/shoes.jpg',
      description: 'Step Up Your Game'
    }
  ]

  // No manual router prefetch needed; Link prefetch handles it automatically
  useEffect(() => {}, [])

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our carefully curated collections
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.05 + 0.05, duration: 0.25, ease: "easeOut" }}
            >
              <Link prefetch href={category.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    priority
                    loading="eager"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase