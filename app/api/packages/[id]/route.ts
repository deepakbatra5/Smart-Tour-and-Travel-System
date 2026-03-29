import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const { id } = await Promise.resolve(params)
    const pkg = await prisma.package.findUnique({ where: { id } })
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const { id } = await Promise.resolve(params)
    const body = await req.json()
    const pkg = await prisma.package.update({
      where: { id },
      data: { ...body, price: parseFloat(body.price), duration: parseInt(body.duration) }
    })
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const { id } = await Promise.resolve(params)
    await prisma.package.update({
      where: { id },
      data: { isActive: false }
    })
    return NextResponse.json({ message: 'Package deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
