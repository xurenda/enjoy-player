export function array2Tree<T extends { [key: string]: any }>(
  arr: T[],
  idName = 'id',
  pidName = 'pid',
  rootId: string | number = '0',
) {
  type R = T & { children?: T[] }
  const tree: R[] = []
  const map = arr.reduce(
    (acc, cur) => {
      acc[cur[idName]] = { ...cur }
      return acc
    },
    {} as { [key: string]: R },
  )
  arr.forEach(item => {
    if (item[pidName] === rootId) {
      tree.push(map[item[idName]])
    } else {
      const parent = map[item[pidName]]
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
      }
    }
  })
  return tree
}

export function mapTreeNotLeafNode<T extends { children?: T[]; [key: string]: any }>(
  tree: T[],
  fn: (notLeafNode: T) => void,
) {
  tree.forEach(node => {
    if (node.children) {
      mapTreeNotLeafNode(node.children, fn)
      fn(node)
    }
  })
}
