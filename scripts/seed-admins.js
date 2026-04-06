/**
 * Run once to seed admin accounts:
 *   node scripts/seed-admins.js
 *
 * Clears existing admins, clients, setups, setup_logs before inserting.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMINS = [
  { email: 'dante@basiq.com',   password: 'r#Uf@jx9pFyqyEjw', name: 'Dante' },
  { email: 'enzo@basiq.com',    password: 'U7Ygr#k8bHcVs6Eb', name: 'Enzo' },
  { email: 'godfrey@basiq.com', password: '9ghpuMGTH!8fgm@W', name: 'Godfrey' },
  { email: 'albert@basiq.com',  password: 'gahErQE29PJrKd2q', name: 'Albert' },
  { email: 'lorenzo@basiq.com', password: 'a#DaDb9U#KCQKm7d', name: 'Lorenzo' },
]

async function seed() {
  console.log('Clearing database…\n')

  const tables = ['setup_logs', 'setups', 'clients', 'admins']
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) console.error(`❌ Clear ${table}:`, error.message)
    else console.log(`🗑  Cleared ${table}`)
  }

  console.log('\nSeeding admin accounts…\n')

  for (const admin of ADMINS) {
    const password_hash = await bcrypt.hash(admin.password, 12)

    const { data, error } = await supabase
      .from('admins')
      .insert({ email: admin.email, password_hash, name: admin.name })
      .select()
      .single()

    if (error) {
      console.error(`❌ ${admin.email}:`, error.message)
    } else {
      console.log(`✅ ${admin.email}`)
      console.log(`   Name:     ${admin.name}`)
      console.log(`   Password: ${admin.password}\n`)
    }
  }

  console.log('Done. Each admin must set up 2FA on first login.')
}

seed().catch(console.error)
