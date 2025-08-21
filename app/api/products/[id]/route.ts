import { NextRequest, NextResponse } from 'next/server'

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'A comfortable and stylish white t-shirt for everyday wear.',
    price: 24.99,
    category: 't-shirts',
    featured: true,
    active: true,
    images: ['/products/tshirt.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['white'],
    stock: 100
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    description: 'Classic blue jeans with a modern slim fit.',
    price: 59.99,
    category: 'pants',
    featured: true,
    active: true,
    images: ['/products/jeans.jpg'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['blue'],
    stock: 50
  }
  // Add more mock products as needed
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Find product in mock data
    const product = mockProducts.find(p => p.id === id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch by ID error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT() {
  // Not implemented in mock mode
  return NextResponse.json(
    { error: 'Update operation not supported in demo mode' },
    { status: 405 }
  )
}

export async function DELETE() {
  // Not implemented in mock mode
  return NextResponse.json(
    { error: 'Delete operation not supported in demo mode' },
    { status: 405 }
  )
}