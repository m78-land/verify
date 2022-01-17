import { isRegExp, isString } from '@lxjx/utils';
import { Meta } from '@m78/verify';

export const regexpStringValidatorKey = 'verifyRegexpString';

/**
 * 是否为有效的Regexp字符或RegExp
 * */
export const regexpString = () => {
  function regexpStringValidator({ value, config }: Meta) {
    if (!isString(value)) return config.languagePack.regexpString;
    if (!isRegExp(new RegExp(value))) return config.languagePack.regexpString;
  }

  regexpStringValidator.key = regexpStringValidatorKey;

  return regexpStringValidator;
};
