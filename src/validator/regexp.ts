import { isRegExp } from '@lxjx/utils';
import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const regexpValidatorKey = 'verifyRegexp';

/**
 * 是否为Regexp
 * */
export const regexp = () => {
  const regexpValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;
    if (!isRegExp(value)) return config.languagePack.regexp;
  };

  regexpValidator.key = regexpValidatorKey;

  return regexpValidator;
};
