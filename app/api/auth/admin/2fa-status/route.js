import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getAdminSession } from '../../../../../lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ enabled: false })

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('totp_enabled')
    .eq('id', session.sub)
    .single()

  return NextResponse.json({ enabled: admin?.totp_enabled || false })
}