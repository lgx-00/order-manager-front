export interface LoginRequestData {
  /** admin 或 editor */
  userName: string
  /** 密码 */
  userPassword: string
}

export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ userName: string; roles: string[] }>
