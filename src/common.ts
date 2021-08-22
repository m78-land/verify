import { AnyObject, isArray, isFunction, isNumber, isObject, isString } from '@lxjx/utils';
import { ErrorTemplateInterpolate, NamePath, Schema } from './types';

/** 格式化并返回验证器数组 */
export function fmtValidator(validator: Schema['validator']) {
  if (isFunction(validator)) return [validator];
  if (validator?.length) return validator;
  return [];
}

/** 根据NamePath在对象中获取值` */
export function getValue(obj: AnyObject, field?: NamePath) {
  if (isString(field)) {
    return obj?.[field];
  }

  if (isArray(field) && field.length) {
    return field.reduce((p, i) => {
      return p?.[i];
    }, obj);
  }
}

/** 将 ['user', 'name'], ['list', '0', 'title'] 格式的字段数组转换为字符串  */
export function stringifyNamePath(name: NamePath) {
  if (isString(name)) return name;

  return name.reduce((p, i) => {
    if (isNumber(Number(i))) {
      return `${p}[${i}]`;
    }

    if (isString(i)) {
      return (p as string).length ? `${p}.${i}` : i;
    }

    return p;
  }, '');
}

/** 是否为ErrorTemplateInterpolate对象 */
export function isErrorTemplateInterpolate(obj: any): obj is ErrorTemplateInterpolate {
  return isObject(obj) && 'errorTemplate' in obj && 'interpolateValues' in obj;
}

/**
 * 根据模板和给定对象进行插值
 * - 插值语法为{key}, 通过\\{key}来避免插值, 如果未从obj中取到值，将其替换为 ''
 * TODO: 添加到utils包
 * */
export function interpolate(tpl: string, obj: AnyObject) {
  return tpl.replace(/((\\{|{).+?})/g, a => {
    if (a.startsWith('\\{')) return a.slice(1);
    return obj[a.slice(1, -1)] || '';
  });
}

/** 确保返回数组值 */
export const ensureArray = (val: any) => (isArray(val) ? val : [val]);
