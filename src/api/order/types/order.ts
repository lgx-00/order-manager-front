import { TagData } from "@/api/tech-tag/types/tag";
import { PlatformData } from "@/api/third-platform/types/platform";

export interface CreateOrUpdateOrderRequestData {

  /** 订单编号 */
  orderId?: number

  /** 客户编号 */
  customerId?: number

  /** 订单标题 */
  orderTitle: string

  /** 订单详情 */
  orderContent: string

  /** 订单附件编号 */
  orderAppendixPath?: string

  /** 订单截止日期 */
  orderDeadline?: string

  /** 订单创建时间 */
  orderCreatedAt?: string

  /** 订单预算 * 100 */
  orderBudget: number

  /** 订单支付方式 */
  orderPayment?: number

  /** 订单交易额 * 100 */
  orderSum?: string

  /** 订单完成时间 */
  orderComplete?: string

  /** 订单来源 */
  orderSource?: string

  /** 订单技术栈标签 */
  orderTag?: number[]
}

export interface QueryOrderRequestData {
  /** 当前页码 */
  pageNum: number

  /** 查询条数 */
  pageSize: number

  /** 订单编号 */
  orderId?: number

  /** 客户编号 */
  customerId?: number

  /** 订单标题 */
  orderTitle?: string

  /** 订单详情 */
  orderContent?: string

  /** 订单截止日期 */
  orderDeadlineMin?: string

  /** 订单截止日期 */
  orderDeadlineMax?: string

  /** 订单预算 * 100 */
  orderBudgetMin?: number

  /** 订单预算 * 100 */
  orderBudgetMax?: number

  /** 订单支付方式 */
  orderPayment?: number[]

  /** 订单交易额 * 100 */
  orderSumMin?: number

  /** 订单交易额 * 100 */
  orderSumMax?: number

  /** 订单完成时间最小值 */
  orderCompleteMin?: string

  /** 订单完成时间最大值 */
  orderCompleteMax?: string

  /** 订单状态 */
  orderStatus?: string

  /** 订单来源 */
  orderSourceList?: number[]

  /** 订单技术栈标签 */
  orderTag?: number[]
}

export interface OrderData {
  /** 订单编号 */
  orderId?: number

  /** 客户编号 */
  customerId?: number

  /** 订单标题 */
  orderTitle: string

  /** 订单详情 */
  orderContent: string

  /** 订单附件编号 */
  orderAppendixPath?: string

  /** 订单截止日期 */
  orderDeadline?: string

  /** 订单预算 * 100 */
  orderBudget: number

  /** 订单支付方式 */
  orderPayment?: number

  /** 订单交易额 * 100 */
  orderSum?: string

  /** 订单完成时间 */
  orderComplete?: string

  /** 订单来源 */
  orderSource?: string

  /** 订单技术栈标签 */
  tags?: string[]
}

export type OrderResponseData = ApiResponseData<{
  list: OrderData[]
  total: number
}>

export interface BaseData {
  tags: TagData[]
  platforms: PlatformData[]
}
