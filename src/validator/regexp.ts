import { isRegExp } from '@lxjx/utils';
import { isVerifyEmpty, Meta } from '@m78/verify';

export const regexpValidatorKey = 'verifyRegexp';

/**
 * 是否为Regexp
 * */
export const regexp = () => {
  function regexpValidator({ value, config }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (!isRegExp(value)) return config.languagePack.regexp;
  }

  regexpValidator.key = regexpValidatorKey;

  return regexpValidator;
};
