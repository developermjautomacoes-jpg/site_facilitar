import sanitizeHtml from 'sanitize-html'

export function sanitizeField(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim()
}

export function sanitizeContactData(data: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    result[key] = typeof value === 'string' ? sanitizeField(value) : value
  }
  return result
}
