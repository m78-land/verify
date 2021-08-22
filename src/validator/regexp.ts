import { isRegExp } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 是否为Regexp
 * */
export const regexp = () => ({ value, config }: Meta) => {
  if (!isRegExp(value)) return config.languagePack.regexp;
};
