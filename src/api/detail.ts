import request from '@/utils/request'
import { stringify } from 'qs'

export interface getDetailQuery {
  /**
   * action
   * Default: detail
   */
  ac?: 'detail' | 'videolist'

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
   * 几小时内的数据
   */
  h?: string

  /**
   * 数据 ID，多个 ID 逗号分割
   */
  ids?: (string | number)[]
}

export interface VideoUrlResponse {
  name: string
  url: string
}

export interface VideoDetailResponse {
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
   * 视频类别名称
   */
  vod_class: string

  /**
   * 简介
   */
  vod_blurb: string

  /**
   * 导演
   */
  vod_author: string

  /**
   * 演员
   */
  vod_actor: string

  /**
   * 语言
   */
  vod_lang: string

  /**
   * 地区
   */
  vod_area: string

  /**
   * 年份
   */
  vod_year: string

  /**
   * 封面图
   */
  vod_pic: string

  /**
   * 播放地址，多个 名称$url#名称2$url2 ...
   */
  vod_play_url: VideoUrlResponse[]

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

  [key: string]: any
}

export interface GetDetailResponse {
  /**
   * 视频数据
   */
  list: VideoDetailResponse[]

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
  ac: 'detail',
  at: 'json',
}

export default function getDetail(url: string, query: getDetailQuery): Promise<GetDetailResponse> {
  return request
    .get(url, {
      params: {
        ...defaultParams,
        ...query,
      },
      paramsSerializer(query) {
        return stringify(query, { arrayFormat: 'comma' })
      },
    })
    .then((res: any) => {
      if (Array.isArray(res?.list)) {
        res.list.forEach((item: any) => {
          item.vod_play_url = item.vod_play_url.split('#').map((i: any) => {
            const [name, url] = i.split('$')
            return { name, url }
          })
        })
      }
      return res
    })
}
