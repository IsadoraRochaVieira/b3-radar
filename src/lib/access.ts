export const ACCESS_COOKIE = 'caryo_map_access'

export function safeReturnTo(value: FormDataEntryValue | string | null) {
  const path = typeof value === 'string' ? value : ''
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/acesso') ? path : '/painel'
}

export async function secretsMatch(received: string, expected: string) {
  const encoder = new TextEncoder()
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(received)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ])
  const a = new Uint8Array(left); const b = new Uint8Array(right)
  let different = a.length ^ b.length
  for (let index = 0; index < Math.max(a.length, b.length); index++) different |= (a[index] ?? 0) ^ (b[index] ?? 0)
  return different === 0
}
