export function isHEXColor(color: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)
}

export function isRGBColor(color: string) {
  return !!getRGBColor(color)
}

export function getHEXColor(color: string): [number, number, number] | null {
  if (color.slice(0, 1) !== '#') {
    return null
  }
  const rgb = color.slice(1)
  let r = 0
  let g = 0
  let b = 0
  if (rgb.length === 3) {
    ;[r, g, b] = rgb.split('').map(n => parseInt(n + n, 16))
  } else if (rgb.length === 6) {
    ;[r, g, b] = rgb.match(/.{2}/g)!.map(n => parseInt(n, 16))
  } else {
    return null
  }
  return [r, g, b]
}

export function getRGBColor(color: string): [number, number, number] | null {
  if (color.slice(0, 3).toLowerCase() !== 'rgb') {
    return null
  }
  const [r, g, b] = color
    .slice(4, -1)
    .split(',')
    .map(n => +n.trim())
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return null
  }
  return [r, g, b]
}

export function getColor(color: string): [number, number, number] | null {
  if (isHEXColor(color)) {
    return getHEXColor(color)
  }
  return getRGBColor(color)
}

export function toHEXColor([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')}`
}

export function toRGBColor([r, g, b]: [number, number, number]) {
  return `rgb(${r}, ${g}, ${b})`
}

const antdColors = [
  'processing',
  'success',
  'error',
  'warning',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'blue',
  'geekblue',
  'purple',
]

export function getColorByKey(key: string) {
  return antdColors[key.charCodeAt(0) % antdColors.length]
}
