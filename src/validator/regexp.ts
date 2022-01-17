import { isRegExp } from '@lxjx/utils';
import { Meta } from '@m78/verify';

export const regexpValidatorKey = 'verifyRegexp';

/**
 * 是否为Regexp
 * */
export const regexp = () => {
  function regexpValidator({ value, config }: Meta) {
    if (!isRegExp(value)) return config.languagePack.regexp;
  }

  regexpValidator.key = regexpValidatorKey;

  return regexpValidator;
};
