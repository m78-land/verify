import { isFunction } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 是否为function
 * */
export const fn = () => ({ value, config }: Meta) => {
  if (!isFunction(value)) return config.languagePack.fn;
};
