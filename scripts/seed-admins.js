/**
 * Run once to seed the 3 admin accounts:
 *   node scripts/seed-admins.js
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMINS = [
  { email: 'admin1@basiq.com', password: 'change-me-admin1', name: 'Manager 1' },
  { email: 'admin2@basiq.com', password: 'change-me-admin2', name: 'Manager 2' },
  { email: 'admin3@basiq.com', password: 'change-me-admin3', name: 'Manager 3' },
]

async function seed() {
  console.log('Seeding admin accounts…\n')

  for (const admin of ADMINS) {
    const password_hash = await bcrypt.hash(admin.password, 12)

    const { data, error } = await supabase
      .from('admins')
      .upsert({ email: admin.email, password_hash, name: admin.name }, { onConflict: 'email' })
      .select()
      .single()

    if (error) {
      console.error(`❌ ${admin.email}:`, error.message)
    } else {
      console.log(`✅ ${admin.email} — created (id: ${data.id})`)
      console.log(`   Password: ${admin.password}`)
      console.log(`   ⚠️  Change this password after first login!\n`)
    }
  }

  console.log('Done. Set up 2FA for each admin on first login.')
}

seed().catch(console.error)
