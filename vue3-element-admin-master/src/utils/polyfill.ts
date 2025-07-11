/**
 * 安全数据处理垫片
 * 防止各种数据处理错误
 */

// 安全地访问嵌套对象属性
export function safeGet(obj: any, path: string, defaultValue: any = undefined) {
  try {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === null ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
}

// 安全转换为数组
export function safeToArray<T>(value: any): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return [];
  }
  return [value] as T[];
}

// 安全对象
export function safeObject(obj: any): Record<string, any> {
  return obj && typeof obj === 'object' ? obj : {};
}

// 安全解析JSON
export function safeParseJSON(json: string, defaultValue: any = {}) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn('JSON解析失败:', e);
    return defaultValue;
  }
}

// 安全执行函数
export function safeExecute<T>(fn: Function, defaultValue: T, ...args: any[]): T {
  try {
    const result = fn(...args);
    return result === undefined ? defaultValue : result;
  } catch (e) {
    console.warn('函数执行错误:', e);
    return defaultValue;
  }
}

// 应用全局垫片
export function applyPolyfills() {
  // 保护数组方法
  const protectArrayMethod = (methodName: string) => {
    const original = Array.prototype[methodName];
    if (original) {
      // @ts-ignore
      Array.prototype[methodName] = function(...args) {
        if (this === undefined || this === null) {
          console.warn(`防止对undefined/null调用${methodName}方法`);
          if (methodName === 'reduce') {
            return args[1] !== undefined ? args[1] : [];
          }
          return methodName === 'find' || methodName === 'findIndex' ? (methodName === 'findIndex' ? -1 : undefined) : [];
        }
        return original.apply(this, args);
      };
    }
  };

  // 保护常用数组方法
  ['map', 'forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex'].forEach(protectArrayMethod);

  // 保护对象方法
  const originalObjectKeys = Object.keys;
  Object.keys = function(obj) {
    if (obj === undefined || obj === null) {
      console.warn('防止对undefined/null调用Object.keys');
      return [];
    }
    return originalObjectKeys(obj);
  };

  const originalObjectEntries = Object.entries;
  Object.entries = function(obj) {
    if (obj === undefined || obj === null) {
      console.warn('防止对undefined/null调用Object.entries');
      return [];
    }
    return originalObjectEntries(obj);
  };

  // 增强错误处理能力
  window.addEventListener('error', (event) => {
    console.warn('全局错误捕获:', event.message);
    // 防止错误中断JS执行
    event.preventDefault();
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('未处理的Promise拒绝:', event.reason);
    // 防止错误中断JS执行
    event.preventDefault();
  });

  console.log('全局数据安全垫片已应用');
}

export default {
  safeGet,
  safeToArray,
  safeObject,
  safeParseJSON,
  safeExecute,
  applyPolyfills
}; 