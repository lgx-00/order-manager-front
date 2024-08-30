export interface CreateOrUpdatePlatformRequestData {

  /** 平台编号 */
  platformId?: number

  /** 平台名称 */
  platformName: string

}

export interface PlatformData {
  /** 平台编号 */
  platformId?: number

  /** 平台名称 */
  platformName: string

}

export type PlatformResponseData = ApiResponseData<PlatformData[]>
