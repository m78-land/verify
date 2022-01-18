import { isFunction } from '@lxjx/utils';
import { Meta } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const fnValidatorKey = 'verifyFn';

/**
 * 是否为function
 * */
export const fn = () => {
  function fnValidator({ value, config }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (!isFunction(value)) return config.languagePack.fn;
  }

  fnValidator.key = fnValidatorKey;

  return fnValidator;
};
