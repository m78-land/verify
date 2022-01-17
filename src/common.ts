import { AnyObject, isFunction, isObject } from '@lxjx/utils';
import { ErrorTemplateInterpolate, Schema } from './types';

/** 格式化并返回验证器数组 */
export function fmtValidator(validator: Schema['validator']) {
  if (isFunction(validator)) return [validator];
  if (validator?.length) return validator;
  return [];
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
