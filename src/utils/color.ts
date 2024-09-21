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
