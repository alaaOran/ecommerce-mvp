import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const json = await fs.readFile(filePath, 'utf8')
    const all = JSON.parse(json) as any[]
    const product = all.find(p => p.slug === slug && p.active !== false)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch by slug error (JSON mode):', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
