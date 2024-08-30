export interface CreateOrUpdateTagRequestData {

  /** 标签编号 */
  tagId?: number

  /** 标签名称 */
  tagName: string

}

export interface TagData {
  /** 标签编号 */
  tagId?: number

  /** 标签名称 */
  tagName: string

}

export type TagResponseData = ApiResponseData<TagData[]>
