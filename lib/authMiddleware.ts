import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import User from '@/models/User'
import { clientPromise } from '@/lib/mongodb'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
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

  await clientPromise

  const user = await User.findById(decoded.userId).select('-password')
  if (!user) {
    return null
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
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