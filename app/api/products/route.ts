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
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
        )
      })
    }

    // Sort by product name
    filtered.sort((a, b) => a.name.localeCompare(b.name))

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