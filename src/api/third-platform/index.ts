import { request } from "@/utils/service"
import type * as Platform from "./types/platform"

/** 增 */
export function createPlatformDataApi(data: Platform.CreateOrUpdatePlatformRequestData) {
  return request({
    url: "third-platform",
    method: "post",
    data
  })
}

/** 删 */
export function deletePlatformDataApi(id: number) {
  return request({
    url: `third-platform/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updatePlatformDataApi(data: Platform.CreateOrUpdatePlatformRequestData) {
  return request({
    url: "third-platform",
    method: "put",
    data
  })
}

/** 查 */
export function getPlatformDataApi() {
  return request<Platform.PlatformResponseData>({
    url: "third-platform",
    method: "get",
  })
}
