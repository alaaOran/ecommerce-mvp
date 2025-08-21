import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = (searchParams.get('search') || '').trim().toLowerCase()
    const featured = searchParams.get('featured') === 'true'

    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const json = await fs.readFile(filePath, 'utf8')
    const allProducts = JSON.parse(json) as any[]

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
        const hay = `${p.title} ${p.description} ${(p.tags || []).join(' ')}`.toLowerCase()
        return hay.includes(search)
      })
    }

    // Sort newest first by a pseudo timestamp if present; fallback to title
    filtered.sort((a, b) => {
      const at = a.updatedAt || a.createdAt || 0
      const bt = b.updatedAt || b.createdAt || 0
      if (at !== bt) return bt - at
      return String(a.title).localeCompare(String(b.title))
    })

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