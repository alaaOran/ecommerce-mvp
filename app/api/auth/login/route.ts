import { NextRequest, NextResponse } from 'next/server'
import { comparePasswords, generateToken } from '@/lib/auth'
import User from '@/models/User'
import { clientPromise } from '@/lib/mongodb'

export const dynamic = 'force-dynamic' // Prevent static generation

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Wait for MongoDB connection
    const client = await clientPromise
    const db = client.db()
    
    // Find user
    const user = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Check password
    const isValidPassword = await comparePasswords(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString())

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}