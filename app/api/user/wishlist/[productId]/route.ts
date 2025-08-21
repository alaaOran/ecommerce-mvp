import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, AuthenticatedRequest } from '@/lib/authMiddleware'
import User from '@/models/User'
import mongoose from 'mongoose'
import Product from '@/models/Product'
import { clientPromise } from '@/lib/mongodb'

// POST: Add product to wishlist
export const POST = authMiddleware(async (request: AuthenticatedRequest, { params }: { params: { productId: string } }) => {
  try {
    const userId = request.user?.id
    const { productId } = params

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    await clientPromise

    const productExists = await Product.findById(productId)
    if (!productExists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
      { new: true, runValidators: true }
    ).populate('wishlist')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Product added to wishlist',
      wishlist: user.wishlist,
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add product to wishlist' },
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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    await clientPromise

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true, runValidators: true }
    ).populate('wishlist')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Product removed from wishlist',
      wishlist: user.wishlist,
    })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove product from wishlist' },
      { status: 500 }
    )
  }
})