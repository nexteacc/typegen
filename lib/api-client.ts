/**
 * API客户端
 * 封装前端调用API的逻辑，提供统一的接口
 */

import { TransformRequest, TransformResponse } from './api-types';

export class TransformApiClient {
  private readonly baseUrl = '/api';
  private readonly timeout = 30000; // 30秒超时

  /**
   * 转换文本风格
   * @param text 原始文本
   * @param style 目标风格
   * @returns 转换结果
   */
  async transformText(text: string, style: string): Promise<TransformResponse> {
    const requestData: TransformRequest = { 
      text: text.trim(), 
      style 
    };

    console.log('🚀 API Client: Starting transform request', {
      textLength: text.length,
      style,
      timestamp: new Date().toISOString()
    });

    try {
      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      // 清除超时定时器
      clearTimeout(timeoutId);

      // 检查HTTP状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: TransformResponse = await response.json();
      
      console.log('✅ API Client: Transform request completed', {
        success: result.success,
        processingTime: result.data?.processingTime,
        timestamp: new Date().toISOString()
      });

      return result;

    } catch (error) {
      console.error('❌ API Client: Transform request failed', error);
      
      // 处理不同类型的错误
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接后重试');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('网络连接失败，请检查网络后重试');
      }
      
      throw new Error(`API调用失败: ${error.message}`);
    }
  }

  /**
   * 获取API健康状态
   * @returns API状态信息
   */
  async getApiStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/transform`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API status check failed:', error);
      throw error;
    }
  }

  /**
   * 检查文本是否符合API要求
   * @param text 待检查的文本
   * @returns 检查结果
   */
  validateText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: '文本内容不能为空' };
    }

    if (text.length > 5000) {
      return { valid: false, error: '文本长度不能超过5000个字符' };
    }

    return { valid: true };
  }
}