'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

const DashboardPage = () => {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Dashboard...</h1>
            <p className="text-gray-600">Please wait while we fetch your data.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const dashboardLinks = [
    { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'My Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User },
    { name: 'Address Book', href: '/dashboard/addresses', icon: Settings },
  ]

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
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your account, view your orders, and keep track of your favorite items.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <Link href={link.href} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                  <link.icon size={48} className="mx-auto text-black mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">{link.name}</h2>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: dashboardLinks.length * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <Button
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                variant="outline"
                className="w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center justify-center"
              >
                <LogOut size={48} className="mx-auto text-red-500 mb-4" />
                <span className="text-xl font-semibold text-red-500">Logout</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage