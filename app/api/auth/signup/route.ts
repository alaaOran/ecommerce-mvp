import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic' // Prevent static generation

// In-memory store for mock users (for development only)
const mockUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists in mock data
    const existingUser = mockUsers.find(user => user.email === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = {
      _id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add new user to mock data
    mockUsers.push(newUser)

    // Generate token
    const token = generateToken(newUser._id.toString())

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}