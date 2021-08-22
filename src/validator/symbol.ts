import { isSymbol } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 是否为symbol
 * */
export const symbol = () => ({ value, config }: Meta) => {
  if (!isSymbol(value)) return config.languagePack.symbol;
};
