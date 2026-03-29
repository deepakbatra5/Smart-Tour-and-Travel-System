'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const categories = ['ALL', 'HONEYMOON', 'FAMILY', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'SOLO', 'CORPORATE']
const durations = ['ALL', '1-3', '4-6', '7-10', '10+']
const budgets = [
  { label: 'All Budgets', value: 'ALL' },
  { label: 'Under Rs 10,000', value: '0-10000' },
  { label: 'Rs 10k to 25k', value: '10000-25000' },
  { label: 'Rs 25k to 50k', value: '25000-50000' },
  { label: 'Above Rs 50k', value: '50000-999999' },
]

export default function PackageFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL')
  const [duration, setDuration] = useState(searchParams.get('duration') || 'ALL')
  const [budget, setBudget] = useState(searchParams.get('budget') || 'ALL')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'ALL') params.set('category', category)
    if (duration !== 'ALL') params.set('duration', duration)
    if (budget !== 'ALL') params.set('budget', budget)
    router.push(`/packages?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('ALL')
    setDuration('ALL')
    setBudget('ALL')
    router.push('/packages')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search destination or package name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex flex-wrap gap-3">

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
          ))}
        </select>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          {durations.map((d) => (
            <option key={d} value={d}>{d === 'ALL' ? 'All Durations' : `${d} Days`}</option>
          ))}
        </select>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>

        <button
          onClick={applyFilters}
          className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="border border-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm hover:bg-gray-50 transition"
        >
          Clear
        </button>
      </div>
    </div>
  )
}