import { SupportedStyle } from './api-types';

interface LengthAdjustment {
  /** 当目标长度与原文长度的比例低于该值时应用 */
  ratioBelow?: number;
  /** 当目标长度与原文长度的比例高于该值时应用 */
  ratioAbove?: number;
  /** 温度调整增量（可为负数） */
  delta: number;
}

interface StyleProfile {
  /** 该风格的基础温度 */
  baseTemperature: number;
  /** 可选的温度下限（含） */
  minTemperature?: number;
  /** 可选的温度上限（含） */
  maxTemperature?: number;
  /** 针对长度比例的温度调整规则 */
  lengthAdjustments?: LengthAdjustment[];
}

const DEFAULT_MIN_TEMPERATURE = 0.5;
const DEFAULT_MAX_TEMPERATURE = 0.8;

const defaultLengthAdjustments: LengthAdjustment[] = [
  {
    ratioBelow: 0.7,
    delta: -0.05,
  },
  {
    ratioAbove: 1.3,
    delta: 0.05,
  },
];

export const styleProfiles: Record<SupportedStyle, StyleProfile> = {
  // Style · 新闻 / 学术 / 教科书
  'ap-style': {
    baseTemperature: 0.57,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.7,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'apa-style': {
    baseTemperature: 0.56,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.68,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'ieee-style': {
    baseTemperature: 0.5,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.65,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'textbook-style': {
    baseTemperature: 0.55,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.68,
    lengthAdjustments: defaultLengthAdjustments,
  },
  investigative: {
    baseTemperature: 0.6,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.72,
    lengthAdjustments: defaultLengthAdjustments,
  },

  // Style · 社群 / 平台文化
  '4chan-style': {
    baseTemperature: 0.7,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'reddit-style': {
    baseTemperature: 0.65,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'buzzfeed-style': {
    baseTemperature: 0.72,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'twitter-style': {
    baseTemperature: 0.68,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'instagram-caption': {
    baseTemperature: 0.7,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'meme-style': {
    baseTemperature: 0.78,
    minTemperature: 0.6,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: [
      {
        ratioBelow: 0.7,
        delta: -0.05,
      },
      {
        ratioAbove: 1.4,
        delta: 0.05,
      },
    ],
  },

  // Style · 小说 / 创意写作
  'hemingway-style': {
    baseTemperature: 0.62,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.75,
    lengthAdjustments: defaultLengthAdjustments,
  },

  // Structure · 新闻 / 资讯结构
  'inverted-pyramid': {
    baseTemperature: 0.58,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.7,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'headline-driven': {
    baseTemperature: 0.63,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.75,
    lengthAdjustments: defaultLengthAdjustments,
  },

  // Structure · 列表 / 线程 / 教程
  listicle: {
    baseTemperature: 0.63,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.75,
    lengthAdjustments: defaultLengthAdjustments,
  },
  threaded: {
    baseTemperature: 0.66,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.78,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'how-to': {
    baseTemperature: 0.58,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.7,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'bullet-pointed': {
    baseTemperature: 0.57,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.7,
    lengthAdjustments: defaultLengthAdjustments,
  },

  // Structure · 学术 / 叙事结构
  'imrd-style': {
    baseTemperature: 0.55,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.68,
    lengthAdjustments: defaultLengthAdjustments,
  },

  // Strategy & Controls
  clickbait: {
    baseTemperature: 0.75,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'call-to-action': {
    baseTemperature: 0.66,
    minTemperature: 0.55,
    maxTemperature: 0.78,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'seo-optimized': {
    baseTemperature: 0.6,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.72,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'fomo-driven': {
    baseTemperature: 0.74,
    minTemperature: 0.6,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'hashtag-heavy': {
    baseTemperature: 0.7,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'emoji-laden': {
    baseTemperature: 0.72,
    minTemperature: 0.55,
    maxTemperature: DEFAULT_MAX_TEMPERATURE,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'flesch-kincaid': {
    baseTemperature: 0.58,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.72,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'citation-heavy': {
    baseTemperature: 0.52,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.66,
    lengthAdjustments: defaultLengthAdjustments,
  },
  'technical-jargon': {
    baseTemperature: 0.5,
    minTemperature: DEFAULT_MIN_TEMPERATURE,
    maxTemperature: 0.65,
    lengthAdjustments: defaultLengthAdjustments,
  },
};

export type { LengthAdjustment, StyleProfile };
