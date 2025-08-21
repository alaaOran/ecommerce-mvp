import { NextRequest, NextResponse } from 'next/server'
import { comparePasswords, generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic' // Prevent static generation

// Mock user for development
const MOCK_USER = {
  _id: 'mock-user-id',
  name: 'Test User',
  email: 'test@example.com',
  password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH.1VO4XeB7HdJwHtHtqJpGpQ0X1qQe', // password: 'password'
  role: 'user'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Use mock user for development
    const user = MOCK_USER
    
    // Check if user exists
    if (!user || user.email !== email.toLowerCase()) {
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