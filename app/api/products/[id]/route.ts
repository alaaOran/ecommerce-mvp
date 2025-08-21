import { NextRequest, NextResponse } from 'next/server'

// Mock product data
const mockProducts = [
  {
    _id: '1',
    title: 'Classic White T-Shirt',
    description: 'A comfortable and stylish white t-shirt for everyday wear.',
    price: 24.99,
    comparePrice: 29.99,
    category: 't-shirts',
    featured: true,
    active: true,
    images: [{ url: '/products/tshirts.jpg', alt: 'Classic White T-Shirt' }],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 20 }, { size: 'XL', stock: 8 }],
    colors: ['white'],
    stock: 100
  },
  {
    _id: '2',
    title: 'Slim Fit Jeans',
    description: 'Classic blue jeans with a modern slim fit.',
    price: 59.99,
    comparePrice: 79.99,
    category: 'pants',
    featured: true,
    active: true,
    images: [{ url: '/products/hoodie.jpg', alt: 'Slim Fit Jeans' }],
    sizes: [
      { size: '28', stock: 5 }, 
      { size: '30', stock: 8 }, 
      { size: '32', stock: 10 },
      { size: '34', stock: 6 },
      { size: '36', stock: 4 }
    ],
    colors: ['blue'],
    stock: 50
  }
  // Add more mock products as needed
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Find product in mock data
    const product = mockProducts.find(p => p._id === id)

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