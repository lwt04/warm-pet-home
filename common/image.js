function normalizeImageSrc(value) {
  if (!value) return ''
  const text = String(value).replace(/\\/g, '/')
  if (/^(https?:|blob:|data:)/i.test(text)) return text
  const staticIndex = text.toLowerCase().lastIndexOf('/static/')
  if (staticIndex !== -1) return text.slice(staticIndex)
  if (text.startsWith('static/')) return `/${text}`
  if (text.startsWith('/')) return text
  return text
}

function fileToDataUrl(blobUrl) {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))
}

export async function persistSelectedImages(paths = [], limit = 9) {
  const results = []
  for (const path of paths.slice(0, limit)) {
    const normalized = normalizeImageSrc(path)
    if (!normalized) continue
    if (normalized.startsWith('blob:')) {
      try {
        const dataUrl = await fileToDataUrl(normalized)
        if (dataUrl) {
          results.push(dataUrl)
          continue
        }
      } catch (error) {
        // Keep the original path if the browser cannot read the blob.
      }
    }
    results.push(normalized)
  }
  return results
}

export function displayImageSrc(value, fallback = '') {
  const normalized = normalizeImageSrc(value)
  if (!normalized) return fallback
  if (normalized.startsWith('blob:')) return fallback
  return normalized
}

export function displayAvatarSrc(value) {
  return displayImageSrc(value, '')
}
