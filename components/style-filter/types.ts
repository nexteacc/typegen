/**
 * 风格滤镜类型定义
 */

/**
 * 风格滤镜接口
 * 定义了风格滤镜的基本属性
 */
export interface StyleFilter {
  /** 滤镜唯一标识符 */
  id: string;
  
  /** 滤镜名称 */
  name: string;
  
  /** 滤镜图标路径或组件 */
  icon: string;
  
  /** 滤镜描述 */
  description?: string;
  
  /** 用于API请求的参数 */
  apiParameter: string;
  
  /** 滤镜类别，用于分组显示 */
  category?: 'news' | 'social' | 'academic' | 'creative' | 'marketing';
}

/**
 * 转换请求模型
 * 用于向API发送文本转换请求
 */
export interface TransformRequest {
  /** 原始文本内容 */
  originalText: string;
  
  /** 目标风格，对应 StyleFilter.apiParameter */
  targetStyle: string;
}

/**
 * 转换响应模型
 * API返回的转换结果
 */
export interface TransformResponse {
  /** 转换后的文本内容 */
  transformedText: string;
  
  /** 转换状态 */
  status: 'success' | 'error';
  
  /** 错误或成功消息 */
  message?: string;
}

/**
 * 应用状态类型
 * 定义了应用可能的状态
 */
export type TransformerState = 
  | 'idle'               // 初始状态
  | 'readyToTransform'   // 可转换态
  | 'filterDragging'     // 滤镜拖动中
  | 'transforming'       // 转换处理中
  | 'transformed';       // 转换完成

/**
 * 应用状态模型
 * 定义了应用的完整状态
 */
export interface AppState {
  /** 原始文本内容 */
  originalText: string;
  
  /** 转换后的文本内容 */
  transformedText: string;
  
  /** 当前应用状态 */
  currentState: TransformerState;
  
  /** 选中的滤镜 */
  selectedFilter: StyleFilter | null;
  
  /** 是否正在处理中 */
  isProcessing: boolean;
  
  /** 错误信息 */
  error: string | null;
}