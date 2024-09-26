export function array2Tree<T extends { [key: string]: any }>(
  arr: T[],
  idName = 'id',
  pidName = 'pid',
  rootId: string | number = '0',
) {
  type R = T & { children?: T[] }
  const tree: R[] = []
  // const map = arr.reduce(
  //   (acc, cur) => {
  //     acc[cur[idName]] = { ...cur }
  //     return acc
  //   },
  //   {} as { [key: string]: R },
  // )
  const map = new Map<string, R>()
  const set = new Set<string>()
  arr.forEach(item => {
    map.set(item[idName], { ...item })
    set.add(item[idName])
  })
  arr.forEach(item => {
    if (item[pidName] === rootId) {
      tree.push(map.get(item[idName])!)
      set.delete(item[idName])
    } else {
      const parent = map.get(item[pidName])
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
        set.delete(item[idName])
      }
    }
  })
  set.forEach(id => {
    tree.push(map.get(id)!)
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

export function mapTreeNode<T extends { children?: T[]; [key: string]: any }, R extends T = T>(
  tree: T[],
  fn: (notLeafNode: T) => R,
) {
  return tree.map(node => {
    if (node.children) {
      node.children = mapTreeNode(node.children, fn)
    }
    return fn(node)
  })
}
