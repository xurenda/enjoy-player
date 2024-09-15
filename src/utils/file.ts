export function readFile(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export async function readFileAsJson<T = any>(file: Blob) {
  return JSON.parse(await readFile(file)) as T
}

export function createFile(content: any, type: string = 'text/plain'): Blob {
  if (typeof content === 'object') {
    content = JSON.stringify(content, null, 2)
  }
  return new Blob([content], { type })
}

export function downloadFile(file: Blob, name: string) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
