import axios from 'axios'
import { LinkStatus } from '../types'

// 在Vercel部署时，API端点在相同域名下
// 在本地开发时，通过代理访问API
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? ''  // 本地开发时使用代理
  : '';  // Vercel部署时也在相同域名

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
    const response = await axios.get<StatusResponse>(`${API_BASE_URL}/api/status`, {
      timeout: 15000  // 设置超时时间
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching statuses:', error);
    
    // 检查错误类型并提供更具体的错误信息
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请稍后重试');
    } else if (error.response) {
      // 服务器响应了错误状态
      if (error.response.status === 500) {
        throw new Error('服务器内部错误，请稍后重试');
      } else {
        throw new Error(`服务器错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error('获取数据失败，请刷新页面重试');
    }
  }
}