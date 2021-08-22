import { isRegExp, isString } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 是否为有效的Regexp字符
 * */
export const regexpString = () => ({ value, config }: Meta) => {
  if (!isString(value)) return config.languagePack.regexpString;
  if (!isRegExp(new RegExp(value))) return config.languagePack.regexpString;
};
