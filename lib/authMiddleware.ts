import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

// Mock user for development
const MOCK_USER = {
  id: 'mock-user-id',
  _id: 'mock-user-id',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
}

export const getAuthenticatedUser = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded || !decoded.userId) {
    return null
  }

  // Return mock user for development
  return MOCK_USER
}

export const authMiddleware = (handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>) => {
  return async (req: AuthenticatedRequest, ...args: any[]) => {
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    req.user = user
    return handler(req, ...args)
  }
}