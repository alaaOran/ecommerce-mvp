import { NextRequest, NextResponse } from 'next/server'

// Define Product interface
interface Product {
  _id: string
  title: string
  description: string
  price: number
  comparePrice: number
  images: { url: string; alt: string }[]
  category: string
  subcategory: string
  brand: string
  sizes: { size: string; stock: number }[]
  colors: string[]
  featured: boolean
  active: boolean
  stock: number
  ratings?: {
    average: number
    count: number
  }
  createdAt: Date
  updatedAt: Date
}

// Mock product data
const mockProducts: Product[] = [
  {
    _id: '1',
    title: 'Classic White T-Shirt',
    description: 'A comfortable and stylish white t-shirt for everyday wear.',
    price: 24.99,
    comparePrice: 29.99,
    category: 't-shirts',
    subcategory: 'casual',
    brand: 'BasicWear',
    images: [{ url: '/products/tshirts.jpg', alt: 'Classic White T-Shirt' }],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 8 }
    ],
    colors: ['white', 'black', 'gray'],
    featured: true,
    active: true,
    stock: 100,
    ratings: {
      average: 4.5,
      count: 128
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    _id: '2',
    title: 'Cozy Hoodie',
    description: 'Warm and comfortable hoodie for casual wear.',
    price: 49.99,
    comparePrice: 64.99,
    category: 'hoodies',
    subcategory: 'casual',
    brand: 'UrbanStyle',
    featured: true,
    active: true,
    images: [{ url: '/products/hoodie.jpg', alt: 'Cozy Hoodie' }],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 5 }
    ],
    colors: ['black', 'gray', 'navy'],
    stock: 50,
    ratings: {
      average: 4.8,
      count: 89
    },
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20')
  },
  {
    _id: '3',
    title: 'Athletic Joggers',
    description: 'Comfortable joggers for both workouts and casual wear.',
    price: 44.99,
    comparePrice: 59.99,
    category: 'pants',
    subcategory: 'athletic',
    brand: 'FitWear',
    featured: true,
    active: true,
    images: [{ url: '/products/joggers.jpg', alt: 'Athletic Joggers' }],
    sizes: [
      { size: 'S', stock: 8 }, 
      { size: 'M', stock: 10 }, 
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 7 }
    ],
    colors: ['black', 'navy'],
    stock: 37,
    ratings: {
      average: 4.7,
      count: 156
    },
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  },
  {
    _id: '4',
    title: 'Classic Sneakers',
    description: 'Versatile sneakers for everyday comfort and style.',
    price: 79.99,
    comparePrice: 99.99,
    category: 'shoes',
    subcategory: 'casual',
    brand: 'SoleMates',
    featured: true,
    active: true,
    images: [{ url: '/products/sneakers.jpg', alt: 'Classic Sneakers' }],
    sizes: [
      { size: '7', stock: 4 }, 
      { size: '8', stock: 6 }, 
      { size: '9', stock: 8 },
      { size: '10', stock: 5 },
      { size: '11', stock: 3 }
    ],
    colors: ['white', 'black', 'red'],
    stock: 26,
    ratings: {
      average: 4.9,
      count: 215
    },
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-05')
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

    // Ensure product has ratings
    if (!product.ratings) {
      product.ratings = {
        average: 4.0,
        count: 0
      };
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