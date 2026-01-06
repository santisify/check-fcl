import axios from 'axios'
import { LinkStatus } from '../types'

const API_BASE_URL = '/api' // 使用相对路径

export interface StatusResponse {
  lastUpdate: string
  totalLinks: number
  statuses: LinkStatus[]
}

/**
 * Fetches link statuses from the API
 * @returns Promise<StatusResponse>
 */
export async function fetchStatuses(): Promise<StatusResponse> {
  try {
    const response = await axios.get<StatusResponse>(API_BASE_URL + '/status', {
      // 设置更长的超时时间，因为后端可能正在初始化
      timeout: 15000
    })
    return response.data
  } catch (error) {
    console.error('Error fetching statuses:', error)
    // 如果是网络错误，提供一个更友好的错误信息
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('无法连接到后端服务，请确保后端服务器已启动')
      } else if (error.response?.status === 500) {
        throw new Error('后端服务内部错误，请检查服务器日志')
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请稍后重试')
      }
    }
    throw new Error('Failed to fetch link statuses')
  }
}