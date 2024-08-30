import { request } from "@/utils/service"
import type * as Tag from "./types/tag"

/** 增 */
export function createTagDataApi(data: Tag.CreateOrUpdateTagRequestData) {
  return request({
    url: "tech-tag",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTagDataApi(id: number) {
  return request({
    url: `tech-tag/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTagDataApi(data: Tag.CreateOrUpdateTagRequestData) {
  return request({
    url: "tech-tag",
    method: "put",
    data
  })
}

/** 查 */
export function getTagDataApi() {
  return request<Tag.TagResponseData>({
    url: "tech-tag",
    method: "get",
  })
}
