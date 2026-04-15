/**
 * 工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDuration,
  generateId,
  deepClone,
  debounce,
  throttle,
  truncateText,
  isEmpty,
  delay
} from '../src/utils/helpers';

describe('formatDate', () => {
  it('应该正确格式化日期', () => {
    const timestamp = new Date('2024-01-15').getTime();
    expect(formatDate(timestamp)).toBe('2024-01-15');
  });
});

describe('formatDuration', () => {
  it('应该正确格式化秒数（小于 60 秒）', () => {
    expect(formatDuration(30)).toBe('30 秒');
  });

  it('应该正确格式化秒数（1-60 分钟）', () => {
    expect(formatDuration(125)).toBe('2 分 5 秒');
  });

  it('应该正确格式化秒数（超过 1 小时）', () => {
    expect(formatDuration(3725)).toBe('1 小时 2 分');
  });
});

describe('generateId', () => {
  it('应该生成唯一 ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });
});

describe('deepClone', () => {
  it('应该深拷贝简单对象', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('应该深拷贝数组', () => {
    const arr = [1, 2, { a: 3 }];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned[2]).not.toBe(arr[2]);
  });
});

describe('truncateText', () => {
  it('应该截断过长的文本', () => {
    const text = 'Hello, World! This is a test.';
    expect(truncateText(text, 10)).toBe('Hello, Wo...');
  });

  it('不应该截断短文本', () => {
    const text = 'Hi';
    expect(truncateText(text, 10)).toBe('Hi');
  });
});

describe('isEmpty', () => {
  it('应该识别 null 和 undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('应该识别空字符串', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('   ')).toBe(true);
  });

  it('应该识别空数组和空对象', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  it('应该正确识别非空值', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe('delay', () => {
  it('应该延迟执行', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90); // 允许一些误差
  });
});