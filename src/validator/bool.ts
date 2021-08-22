import { isBoolean } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 是否为boolean值
 * */
export const bool = () => ({ value, config }: Meta) => {
  if (!isBoolean(value)) return config.languagePack.bool;
};
