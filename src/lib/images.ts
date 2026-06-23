const MAX_DIMENSION = 512
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function isAcceptedImageType(type: string): boolean {
  return ACCEPTED_TYPES.includes(type)
}

export function urlToDataUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      let { width, height } = img
      const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not process image.'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png', 0.85))
    }
    img.onerror = () => reject(new Error('Could not load image.'))
    img.src = url
  })
}

export function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isAcceptedImageType(file.type)) {
      reject(new Error('Please upload a PNG, JPEG, or WebP image.'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
        width = Math.round(width * scale)
        height = Math.round(height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not process image.'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        resolve(canvas.toDataURL(mime, 0.85))
      }
      img.onerror = () => reject(new Error('Could not load image.'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsDataURL(file)
  })
}
