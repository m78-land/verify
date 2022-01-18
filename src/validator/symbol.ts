import { isSymbol } from '@lxjx/utils';
import { Meta } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const symbolValidatorKey = 'verifySymbol';

/**
 * 是否为symbol
 * */
export const symbol = () => {
  function symbolValidator({ value, config }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (!isSymbol(value)) return config.languagePack.symbol;
  }

  symbolValidator.key = symbolValidatorKey;

  return symbolValidator;
};
