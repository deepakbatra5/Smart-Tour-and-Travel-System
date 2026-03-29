import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma, Category } from '@/generated/prisma/client'

interface CreatePackageBody {
  title: string
  destination: string
  description: string
  price: string | number
  duration: string | number
  category: Category
  images?: string[]
  itinerary?: Prisma.InputJsonValue
  inclusions?: string[]
  exclusions?: string[]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Prisma.PackageWhereInput = { isActive: true }

    if (category && category !== 'ALL' && category in Category) {
      where.category = category as Category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
      ]
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(packages)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as CreatePackageBody
    const { title, destination, description, price, duration, category, images, itinerary, inclusions, exclusions } = body

    const slugify = (await import('slugify')).default
    const slug = slugify(title, { lower: true, strict: true })

    const pkg = await prisma.package.create({
      data: {
        title, slug, destination, description,
        price: Number(price),
        duration: Number(duration),
        category,
        images: images || [],
        itinerary: itinerary || [],
        inclusions: inclusions || [],
        exclusions: exclusions || [],
      }
    })

    return NextResponse.json(pkg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
