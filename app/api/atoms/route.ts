import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import supabase from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const cacheKey = `atoms:${userId}`

  // 1. Try to fetch from Redis first
  const cached = await redis.get(cacheKey)
  if (cached) {
    console.log('💾 Cache Hit')
    console.log(cached)
    return NextResponse.json(cached)
  }

  console.log('🚀 Cache Miss - Fetching from Supabase')

  // 2. Fetch from Supabase
  const { data, error } = await supabase
    .from('atoms')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching atoms:', error)
    return NextResponse.json({ error: 'Failed to fetch atoms' }, { status: 500 })
  }

  // 3. Save to Redis with a TTL [Time-To-Live] (example: 5 minutes)
  await redis.set(cacheKey, JSON.stringify(data), { ex: 300 })

  return NextResponse.json(data)
}
