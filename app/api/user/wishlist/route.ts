import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, AuthenticatedRequest } from '@/lib/authMiddleware'
import User from '@/models/User'
import Product from '@/models/Product'
import clientPromise from '@/lib/mongodb'

// GET user's wishlist
export const GET = authMiddleware(async (request: AuthenticatedRequest) => {
  try {
    const userId = request.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    await clientPromise

    const user = await User.findById(userId).populate('wishlist')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ wishlist: user.wishlist })
  } catch (error) {
    console.error('Fetch wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
})