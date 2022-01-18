import { isSymbol } from '@lxjx/utils';
import { isVerifyEmpty, Meta } from '@m78/verify';

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
