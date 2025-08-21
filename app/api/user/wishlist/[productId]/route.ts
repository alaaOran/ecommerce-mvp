import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, AuthenticatedRequest } from '@/lib/authMiddleware'

// In-memory store for wishlist (for development only)
const wishlistStore: Record<string, string[]> = {}

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

    // Add product to wishlist if not already present
    if (!wishlistStore[userId].includes(productId)) {
      wishlistStore[userId].push(productId)
    }

    return NextResponse.json({ 
      message: 'Product added to wishlist', 
      wishlist: wishlistStore[userId] 
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
      wishlist: wishlistStore[userId] || [] 
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove product from wishlist' },
      { status: 500 }
    )
  }
})