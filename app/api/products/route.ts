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
    featured: true,
    active: true,
    images: [{ url: '/products/hoodie.jpg', alt: 'Cozy Hoodie' }],
    sizes: [
      { size: 'S', stock: 5 }, 
      { size: 'M', stock: 8 }, 
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 6 }
    ],
    colors: ['black', 'gray'],
    stock: 30
  },
  {
    _id: '3',
    title: 'Athletic Joggers',
    description: 'Comfortable joggers for both workouts and casual wear.',
    price: 44.99,
    comparePrice: 59.99,
    category: 'pants',
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
    stock: 40
  },
  {
    _id: '4',
    title: 'Classic Sneakers',
    description: 'Versatile sneakers for everyday comfort and style.',
    price: 79.99,
    comparePrice: 99.99,
    category: 'shoes',
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
    colors: ['white', 'black'],
    stock: 25
  },
  // Add more mock products as needed
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = (searchParams.get('search') || '').trim().toLowerCase()
    const featured = searchParams.get('featured') === 'true'

    // Use mock products data
    const allProducts = mockProducts

    // Filter in-memory
    let filtered = allProducts.filter(p => p.active !== false)

    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    if (featured) {
      filtered = filtered.filter(p => p.featured === true)
    }

    if (search) {
      filtered = filtered.filter(p => {
        return (
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
        )
      })
    }

    // Sort by product title
    filtered.sort((a, b) => a.title.localeCompare(b.title))

    const total = filtered.length
    const skip = (page - 1) * limit
    const products = filtered.slice(skip, skip + limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products fetch error (JSON mode):', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// In DB-less mode, POST is disabled. Uncomment and implement write-to-file if needed.
// export async function POST(request: NextRequest) { ... }