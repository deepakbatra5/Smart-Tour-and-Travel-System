import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, city, state, experience, bio, languages } = await req.json()

    if (!name || !email || !password || !phone || !city || !state || !experience || !Array.isArray(languages) || languages.length === 0) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Email already registered.' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        role: 'USER',
        agent: {
          create: {
            phone,
            city,
            state,
            experience: parseInt(experience, 10),
            bio: bio || null,
            languages,
            status: 'PENDING',
          },
        },
      },
    })

    return NextResponse.json({ message: 'Agent registered successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
