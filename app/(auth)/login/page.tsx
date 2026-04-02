'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getSafeCallbackPath = () => {
    const rawCallback = new URLSearchParams(window.location.search).get('callbackUrl')

    if (!rawCallback) return '/dashboard'

    try {
      const callbackUrl = new URL(rawCallback, window.location.origin)

      if (callbackUrl.origin !== window.location.origin) {
        return '/dashboard'
      }

      const pathWithQuery = `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`
      return pathWithQuery || '/dashboard'
    } catch {
      return rawCallback.startsWith('/') ? rawCallback : '/dashboard'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const safeCallbackPath = getSafeCallbackPath()

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      callbackUrl: safeCallbackPath,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else if (!result?.ok) {
      setError('Unable to login right now. Please try again.')
    } else {
      // Use sanitized callback path directly to avoid callback URL loop issues in production.
      window.location.assign(safeCallbackPath)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            KingHills Travels
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Do not have an account?{' '}
          <Link href="/register" className="text-orange-500 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}