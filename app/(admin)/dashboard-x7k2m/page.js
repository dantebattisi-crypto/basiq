import { redirect } from 'next/navigation'

const SEGMENT = process.env.NEXT_PUBLIC_ADMIN_SEGMENT || 'dashboard-x7k2m'

export default function AdminRootPage() {
  redirect(`/${SEGMENT}/clients`)
}
