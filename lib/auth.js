import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signToken(payload, expiresIn = '8h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export function getAdminCookie() {
  return cookies().get('admin_session')?.value
}

export function getClientCookie() {
  return cookies().get('client_session')?.value
}

export async function getAdminSession() {
  const token = getAdminCookie()
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export async function getClientSession() {
  const token = getClientCookie()
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'client') return null
  return payload
}
