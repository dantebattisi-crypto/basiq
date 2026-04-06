import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { getAdminSession } from '../../../../lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: setups, error } = await supabaseAdmin
    .from('setups')
    .select('*, clients(id, name, username)')
    .in('status', ['active', 'paused'])
    .order('est_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ setups: setups || [] })
}
