import request from '@/utils/request'

export interface getListQuery {
  /**
  action
  Default: list
  */
  ac?: string

  /**
  返回数据类型
  Default: xml
  */
  at?: string

  /**
  类别ID
  */
  t?: string

  /**
  页码
  */
  pg?: string

  /**
  搜索关键字
  */
  wd?: string

  /**
  几小时内的数据
  */
  h?: string
}

// export interface getDetailQuery {}

// export interface getListResponse {
//   class: []
// }

export default function getList(url: string, query?: getListQuery): Promise<any> {
  return request.get(url, {
    params: {
      ac: 'list',
      at: 'json',
      ...query,
    },
  })
}
