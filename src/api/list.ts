import request from '@/utils/request'

export interface GetListQuery {
  /**
   * action
   * Default: list
   */
  ac?: 'list'

  /**
   * 返回数据类型
   * Default: xml
   */
  at?: string

  /**
   * 类别 ID
   */
  t?: number

  /**
   * 页码
   */
  pg?: number

  /**
   * 搜索关键字
   */
  wd?: string

  /**
   * 几小时内的数据
   */
  h?: string
}

export interface CategoryResponse {
  /**
   * 类别 ID
   */
  type_id: number

  /**
   * 类别名称
   */
  type_name: string

  /**
   * 类别父 ID
   */
  type_pid: number
}

export interface VideoResponse {
  /**
   * 类别 ID
   */
  type_id: number

  /**
   * 类别名称
   */
  type_name: string

  /**
   * 视频 ID
   */
  vod_id: number

  /**
   * 视频名称
   */
  vod_name: string

  /**
   * 视频名称（英文）
   */
  vod_en: string

  /**
   * 视频播放来源
   */
  vod_play_from: string

  /**
   * 视频备注
   */
  vod_remarks: string

  /**
   * 视频时间
   */
  vod_time: string
}

export interface GetListResponse {
  /**
   * 分类数据
   */
  class: CategoryResponse[]

  /**
   * 视频数据
   */
  list: VideoResponse[]

  /**
   * 当前页码
   */
  page: number

  /**
   * 总页数
   */
  pagecount: number

  /**
   * 总条数
   */
  total: number

  /**
   * 每页条数
   */
  limit: string

  /**
   * 消息
   */
  msg: string

  /**
   * 代码
   */
  code: number
}

const defaultParams = {
  ac: 'list',
  at: 'json',
}

export default function getList(url: string, query?: GetListQuery): Promise<GetListResponse> {
  return request.get(url, {
    params: {
      ...defaultParams,
      ...query,
    },
  })
}
