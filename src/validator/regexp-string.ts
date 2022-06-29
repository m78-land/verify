import { isRegExp, isString } from '@lxjx/utils';
import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const regexpStringValidatorKey = 'verifyRegexpString';

/**
 * 是否为有效的Regexp字符或RegExp
 * */
export const regexpString = () => {
  const regexpStringValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;
    if (!isString(value)) return config.languagePack.regexpString;
    if (!isRegExp(new RegExp(value))) return config.languagePack.regexpString;
  };

  regexpStringValidator.key = regexpStringValidatorKey;

  return regexpStringValidator;
};
