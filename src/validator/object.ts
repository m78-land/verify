import { isObject } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 必须是严格的对象类型 [Object objcet], 如果是[Object regexp]等特殊内置对象则不会通过检测
 * */
export const object = () => ({ value, config }: Meta) => {
  if (!isObject(value)) return config.languagePack.object;
};
