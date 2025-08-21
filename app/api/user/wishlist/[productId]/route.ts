import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, AuthenticatedRequest } from '@/lib/authMiddleware'

// Mock product data
const mockProducts = [
  {
    _id: '1',
    title: 'Classic White T-Shirt',
    description: 'A comfortable and stylish white t-shirt for everyday wear.',
    price: 24.99,
    comparePrice: 29.99,
    category: 't-shirts',
    featured: true,
    active: true,
    images: [{ url: '/products/tshirts.jpg', alt: 'Classic White T-Shirt' }],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 20 }, { size: 'XL', stock: 8 }],
    colors: ['white'],
    stock: 100
  },
  {
    _id: '2',
    title: 'Slim Fit Jeans',
    description: 'Classic blue jeans with a modern slim fit.',
    price: 59.99,
    comparePrice: 79.99,
    category: 'pants',
    featured: true,
    active: true,
    images: [{ url: '/products/hoodie.jpg', alt: 'Slim Fit Jeans' }],
    sizes: [
      { size: '28', stock: 5 }, 
      { size: '30', stock: 8 }, 
      { size: '32', stock: 10 },
      { size: '34', stock: 6 },
      { size: '36', stock: 4 }
    ],
    colors: ['blue'],
    stock: 50
  }
]

// In-memory store for wishlist (for development only)
const wishlistStore: Record<string, string[]> = {}

// Helper function to get product by ID
const getProductById = (productId: string) => {
  return mockProducts.find(p => p._id === productId) || null
}

// POST: Add product to wishlist
export const POST = authMiddleware(async (request: AuthenticatedRequest, { params }: { params: { productId: string } }) => {
  try {
    const userId = request.user?.id
    const { productId } = params

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Initialize user's wishlist if it doesn't exist
    if (!wishlistStore[userId]) {
      wishlistStore[userId] = []
    }

    // Verify product exists
    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Add product to wishlist if not already present
    if (!wishlistStore[userId].includes(productId)) {
      wishlistStore[userId].push(productId)
    }

    return NextResponse.json({ 
      message: 'Product added to wishlist',
      product,
      wishlist: wishlistStore[userId].map(id => getProductById(id)).filter(Boolean)
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// DELETE: Remove product from wishlist
export const DELETE = authMiddleware(async (request: AuthenticatedRequest, { params }: { params: { productId: string } }) => {
  try {
    const userId = request.user?.id
    const { productId } = params

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Remove product from wishlist if it exists
    if (wishlistStore[userId]) {
      wishlistStore[userId] = wishlistStore[userId].filter(id => id !== productId)
    }

    return NextResponse.json({ 
      message: 'Product removed from wishlist',
      wishlist: (wishlistStore[userId] || []).map(id => getProductById(id)).filter(Boolean)
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove product from wishlist' },
      { status: 500 }
    )
  }
})