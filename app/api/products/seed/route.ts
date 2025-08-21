import { NextRequest, NextResponse } from 'next/server'
import { clientPromise } from '@/lib/mongodb'
import Product from '@/models/Product'

// Convenience seeder to populate 4 demo products with your images.
// Visit /api/products/seed (GET) once in dev to insert if missing.
export async function GET(_req: NextRequest) {
  try {
    await clientPromise

    const items = [
      {
        slug: 'dazy-men-kangaroo-pocket-drop-shoulder-hoodie',
        title: 'DAZY Men Kangaroo Pocket Drop Shoulder Hoodie',
        description: 'Soft fleece-lined hoodie with relaxed fit and kangaroo pocket.',
        price: 69.99,
        comparePrice: 89.99,
        category: 'hoodies',
        subcategory: 'Hoodies',
        brand: 'Urban Basics',
        images: [
          { url: '/products/hoodie.jpg', alt: 'DAZY Men Kangaroo Pocket Drop Shoulder Hoodie' }
        ],
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 6 },
        ],
        colors: ['navy', 'black', 'grey'],
        tags: ['hoodie', 'navy', 'minimal'],
        featured: true,
        totalStock: 36,
      },
      {
        slug: 'tall-basic-oversized-fit-joggers-boohooman-ie',
        title: 'Tall Basic Oversized Fit Joggers - boohooMAN IE',
        description: 'Tapered fit joggers with elastic waistband and side pockets.',
        price: 49.99,
        comparePrice: 59.99,
        category: 'joggers',
        subcategory: 'Joggers',
        brand: 'Urban Basics',
        images: [
          { url: '/products/joggers.jpg', alt: 'Tall Basic Oversized Fit Joggers - boohooMAN IE' }
        ],
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 14 },
          { size: 'L', stock: 9 },
          { size: 'XL', stock: 5 },
        ],
        colors: ['black', 'charcoal'],
        tags: ['joggers', 'black', 'comfort'],
        featured: true,
        totalStock: 38,
      },
      {
        slug: 'classic-white-low-top-sneakers-for-effortless-style',
        title: 'Classic White Low-Top Sneakers for Effortless Style',
        description: 'Clean low-top silhouette with cushioned insole for everyday comfort.',
        price: 99.99,
        comparePrice: 119.99,
        category: 'shoes',
        subcategory: 'Sneakers',
        brand: 'Urban Basics',
        images: [
          { url: '/products/sneakers.jpg', alt: 'Classic White Low-Top Sneakers for Effortless Style' }
        ],
        sizes: [
          { size: 'US 7', stock: 4 },
          { size: 'US 8', stock: 9 },
          { size: 'US 9', stock: 11 },
          { size: 'US 10', stock: 3 },
        ],
        colors: ['white', 'black'],
        tags: ['sneakers', 'street', 'white'],
        featured: true,
        totalStock: 27,
      },
      {
        slug: 'mens-pure-cotton-solid-color-basic-tshirt-2xl-navy-blue',
        title: "Men's Pure Cotton Solid Color Basic T-Shirt - 2XL, Navy Blue",
        description: 'Ultra-soft crew neck t-shirt made from breathable cotton.',
        price: 24.99,
        comparePrice: 29.99,
        category: 't-shirts',
        subcategory: 'T-Shirts',
        brand: 'Urban Basics',
        images: [
          { url: '/products/tshirts.jpg', alt: "Men's Pure Cotton Solid Color Basic T-Shirt - 2XL, Navy Blue" }
        ],
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 7 },
        ],
        colors: ['white', 'beige', 'navy', 'black'],
        tags: ['t-shirt', 'cotton', 'basics'],
        featured: true,
        totalStock: 44,
      },
    ]

    // Upsert by title to avoid duplicates
    const inserted: any[] = []
    for (const item of items) {
      const existing = await Product.findOne({ title: item.title })
      if (!existing) {
        const doc = await Product.create(item)
        inserted.push(doc)
      }
    }

    const msg = inserted.length > 0
      ? `Inserted ${inserted.length} products.`
      : 'Products already exist. No changes.'

    return NextResponse.json({ message: msg })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed products' }, { status: 500 })
  }
}
