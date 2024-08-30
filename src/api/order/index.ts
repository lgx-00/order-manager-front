import { request } from "@/utils/service"
import type * as Order from "./types/order"

/** 增 */
export function createOrderDataApi(data: Order.CreateOrUpdateOrderRequestData) {
  return request({
    url: "order",
    method: "post",
    data
  })
}

/** 删 */
export function deleteOrderDataApi(id: number) {
  return request({
    url: `order/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateOrderDataApi(data: Order.CreateOrUpdateOrderRequestData) {
  return request({
    url: "order",
    method: "put",
    data
  })
}

/** 查 */
export function getOrderDataApi(params: Order.QueryOrderRequestData) {
  return request<Order.OrderResponseData>({
    url: "order",
    method: "get",
    params
  })
}
