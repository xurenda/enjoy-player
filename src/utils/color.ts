const colors = [
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
  return colors[key.charCodeAt(0) % colors.length]
}
