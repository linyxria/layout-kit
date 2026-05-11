export type ImageCrossOrigin = "" | "anonymous" | "use-credentials" | null

export function loadImage(src: string, crossOrigin: ImageCrossOrigin) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    if (crossOrigin !== null) {
      image.crossOrigin = crossOrigin
    }

    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

export function getAverageImageColor(
  image: HTMLImageElement,
  fallbackColor: string,
) {
  const sampleSize = 40
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d", { willReadFrequently: true })

  if (!context) {
    return fallbackColor
  }

  const scale = Math.min(
    1,
    sampleSize / Math.max(image.naturalWidth, image.naturalHeight),
  )
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  const { data } = context.getImageData(0, 0, width, height)
  let red = 0
  let green = 0
  let blue = 0
  let count = 0

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] / 255

    if (alpha < 0.05) {
      continue
    }

    red += data[index] * alpha
    green += data[index + 1] * alpha
    blue += data[index + 2] * alpha
    count += alpha
  }

  if (!count) {
    return fallbackColor
  }

  return `rgb(${Math.round(red / count)} ${Math.round(green / count)} ${Math.round(
    blue / count,
  )})`
}
