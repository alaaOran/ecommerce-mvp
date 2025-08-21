import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, AuthenticatedRequest } from '@/lib/authMiddleware'

// In-memory store for wishlist (for development only)
const wishlistStore: Record<string, string[]> = {}

// GET user's wishlist
export const GET = authMiddleware(async (request: AuthenticatedRequest) => {
  try {
    const userId = request.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Return user's wishlist or empty array if not exists
    const wishlist = wishlistStore[userId] || []
    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error('Fetch wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
})