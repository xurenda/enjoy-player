import request from '@/utils/request'

export interface getDetailQuery {
  /**
  action
  Default: detail
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
  数据ID,多个ID逗号分割
  */
  ids?: string

  /**
  几小时内的数据
  */
  h?: string
}

export default function getDetail(url: string, query: getDetailQuery): Promise<any> {
  return request.get(url, {
    params: query,
  })
}
